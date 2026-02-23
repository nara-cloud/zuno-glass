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
      apiVersion: "2026-01-28.clover",
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
          console.log(`[Webhook] Customer email: ${session.customer_email}`);
          console.log(`[Webhook] Amount: ${session.amount_total}`);
          console.log(`[Webhook] Metadata:`, session.metadata);
          // Here you would update your order tracking, send confirmation emails, etc.
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

  // ─── Stripe Checkout Session ───
  app.post("/api/checkout", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: "Stripe not configured" });
    }

    try {
      const { productId, variantColor, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({ error: "productId is required" });
      }

      // Import product catalog dynamically
      const { getProductById } = await import("../shared/products.js");
      const product = getProductById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const origin = req.headers.origin || `${req.protocol}://${req.get("host")}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        allow_promotion_codes: true,
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: `ZUNO GLASS — ${product.name}`,
                description: variantColor
                  ? `Modelo ${product.name} — Cor: ${variantColor}`
                  : `Modelo ${product.name}`,
                images: [],
              },
              unit_amount: Math.round(product.price * 100), // Stripe uses cents
            },
            quantity,
          },
        ],
        metadata: {
          product_id: product.id,
          product_name: product.name,
          variant_color: variantColor || "default",
        },
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/product/${productId}`,
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

      res.json({
        id: session.id,
        status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email || session.customer_email,
        customer_name: session.customer_details?.name,
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
