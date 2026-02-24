import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Initialize Stripe
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let stripe: Stripe | null = null;

  if (stripeSecretKey) {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-12-18.acacia" as any,
    });
    console.log("[Stripe] Initialized successfully");
  } else {
    console.warn("[Stripe] STRIPE_SECRET_KEY not set — payment endpoints disabled");
  }

  // ─── Stripe Webhook (MUST be before express.json()) ───
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      if (!stripe || !stripeWebhookSecret) {
        return res.status(503).json({ error: "Stripe not configured" });
      }

      const sig = req.headers["stripe-signature"] as string;

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
      } catch (err: any) {
        console.error(`[Webhook] Signature verification failed: ${err.message}`);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      // Handle real events
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log(`[Webhook] Checkout completed: ${session.id}`);
          console.log(`[Webhook] Customer email: ${session.customer_email || session.customer_details?.email}`);
          console.log(`[Webhook] Amount: ${session.amount_total}`);
          console.log(`[Webhook] Metadata:`, session.metadata);
          break;
        }
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`[Webhook] Payment succeeded: ${paymentIntent.id}`);
          break;
        }
        default:
          console.log(`[Webhook] Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    }
  );

  // JSON body parser for all other routes
  app.use(express.json());

  // ─── Shipping Quote Endpoint ───
  app.post("/api/shipping/quote", async (req, res) => {
    try {
      const { cep, cartTotal } = req.body;
      const { calculateShipping, isValidCep } = await import("../shared/shipping.js");

      if (!cep || !isValidCep(cep)) {
        return res.status(400).json({ error: "CEP inválido" });
      }

      const quote = calculateShipping(cep, cartTotal || 0);
      if (!quote) {
        return res.status(404).json({ error: "CEP não encontrado" });
      }

      res.json(quote);
    } catch (err: any) {
      console.error("[Shipping] Error calculating quote:", err.message);
      res.status(500).json({ error: "Erro ao calcular frete" });
    }
  });

  // ─── Stripe Checkout Session (Multi-item cart with shipping) ───
  app.post("/api/checkout", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: "Stripe not configured" });
    }

    try {
      const { items, productId, variantColor, quantity = 1, shippingCost = 0, shippingRegion, shippingEstimate } = req.body;
      const { getProductById } = await import("../shared/products.js");
      const origin = req.headers.origin || `${req.protocol}://${req.get("host")}`;

      let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      let metadataItems: string[] = [];

      // Multi-item cart checkout
      if (items && Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const product = getProductById(item.productId);
          if (!product) continue;

          lineItems.push({
            price_data: {
              currency: "brl",
              product_data: {
                name: `ZUNO GLASS — ${product.name}`,
                description: item.variantColor
                  ? `Modelo ${product.name} — Cor: ${item.variantColor}`
                  : `Modelo ${product.name}`,
                images: [],
              },
              unit_amount: Math.round(product.price * 100),
            },
            quantity: item.quantity || 1,
          });

          metadataItems.push(
            `${product.name}|${item.variantColor || "default"}|${item.quantity || 1}`
          );
        }
      }
      // Single item checkout (backward compatible)
      else if (productId) {
        const product = getProductById(productId);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        lineItems.push({
          price_data: {
            currency: "brl",
            product_data: {
              name: `ZUNO GLASS — ${product.name}`,
              description: variantColor
                ? `Modelo ${product.name} — Cor: ${variantColor}`
                : `Modelo ${product.name}`,
              images: [],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity,
        });

        metadataItems.push(`${product.name}|${variantColor || "default"}|${quantity}`);
      } else {
        return res.status(400).json({ error: "items or productId is required" });
      }

      if (lineItems.length === 0) {
        return res.status(400).json({ error: "No valid products found" });
      }

      // Build shipping options based on calculated shipping
      const shippingAmountCents = Math.round((shippingCost || 0) * 100);
      const isFreeShipping = shippingAmountCents === 0;

      // Parse estimate for Stripe delivery estimate
      let minDays = 5;
      let maxDays = 10;
      if (shippingEstimate) {
        const match = shippingEstimate.match(/(\d+)\s*a\s*(\d+)/);
        if (match) {
          minDays = parseInt(match[1], 10);
          maxDays = parseInt(match[2], 10);
        }
      }

      const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shippingAmountCents, currency: "brl" },
            display_name: isFreeShipping
              ? "Frete Grátis"
              : `Envio para ${shippingRegion || "Brasil"}`,
            delivery_estimate: {
              minimum: { unit: "business_day", value: minDays },
              maximum: { unit: "business_day", value: maxDays },
            },
          },
        },
      ];

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        allow_promotion_codes: true,
        shipping_address_collection: {
          allowed_countries: ["BR"],
        },
        shipping_options: shippingOptions,
        phone_number_collection: { enabled: true },
        line_items: lineItems,
        metadata: {
          items: metadataItems.join(";"),
          item_count: String(lineItems.length),
          shipping_region: shippingRegion || "Brasil",
          shipping_estimate: shippingEstimate || `${minDays} a ${maxDays} dias úteis`,
        },
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/products`,
      });

      res.json({ url: session.url });
    } catch (err: any) {
      console.error("[Checkout] Error creating session:", err.message);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // ─── Get Order by Session ID ───
  app.get("/api/order/:sessionId", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: "Stripe not configured" });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
        expand: ["line_items", "payment_intent"],
      });

      const sessionAny = session as any;
      res.json({
        id: session.id,
        status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email || session.customer_email,
        customer_name: session.customer_details?.name,
        customer_phone: session.customer_details?.phone,
        shipping: sessionAny.shipping_details || null,
        shipping_cost: sessionAny.total_details?.amount_shipping || 0,
        metadata: session.metadata,
        created: session.created,
        line_items: session.line_items?.data.map((item) => ({
          name: item.description,
          quantity: item.quantity,
          amount: item.amount_total,
        })),
      });
    } catch (err: any) {
      console.error("[Order] Error retrieving session:", err.message);
      res.status(500).json({ error: "Failed to retrieve order" });
    }
  });

  // ─── List Orders by Customer Email ───
  app.get("/api/orders", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: "Stripe not configured" });
    }

    try {
      const { email } = req.query;

      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "email query parameter is required" });
      }

      // Search completed checkout sessions by customer email
      const sessions = await stripe.checkout.sessions.list({
        limit: 50,
        expand: ["data.line_items"],
      });

      const customerOrders = sessions.data
        .filter(
          (s) =>
            s.payment_status === "paid" &&
            (s.customer_details?.email?.toLowerCase() === email.toLowerCase() ||
              s.customer_email?.toLowerCase() === email.toLowerCase())
        )
        .map((s) => {
          const sAny = s as any;
          return {
            id: s.id,
            status: s.payment_status,
            amount_total: s.amount_total,
            currency: s.currency,
            customer_email: s.customer_details?.email || s.customer_email,
            customer_name: s.customer_details?.name,
            shipping: sAny.shipping_details || null,
            shipping_cost: sAny.total_details?.amount_shipping || 0,
            metadata: s.metadata,
            created: s.created,
            line_items: s.line_items?.data.map((item) => ({
              name: item.description,
              quantity: item.quantity,
              amount: item.amount_total,
            })),
          };
        });

      res.json({ orders: customerOrders });
    } catch (err: any) {
      console.error("[Orders] Error listing orders:", err.message);
      res.status(500).json({ error: "Failed to list orders" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
