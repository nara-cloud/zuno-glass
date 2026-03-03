import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import cookieParser from "cookie-parser";
import authRouter from "./auth.js";
import { getStockMap, decrementGestaoStock, invalidateStockCache } from "./zunoGestao.js";
import { stockMapping, findGestaoProduct, getVariantStock, getTotalProductStock } from "../shared/stockMapping.js";

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
          const customerEmail = session.customer_email || session.customer_details?.email || '';
          const customerName = session.customer_details?.name || undefined;
          const customerPhone = session.customer_details?.phone || undefined;
          const shippingAddr = (session as any).shipping_details?.address;
          const amountTotal = (session.amount_total || 0) / 100;
          const amountShipping = (session.total_details?.amount_shipping || 0) / 100;
          const amountDiscount = (session.total_details?.amount_discount || 0) / 100;
          const subtotal = amountTotal - amountShipping + amountDiscount;

          // ─── Save order to database ───
          try {
            const { productCatalog } = await import('../shared/products.js');
            const { createOrder, generateOrderNumber, getOrderByNumber } = await import('./db/orders.js');

            // Avoid duplicate orders (idempotency)
            const existingOrder = await getOrderByNumber(`STRIPE-${session.id}`);
            if (!existingOrder) {
              const orderItems: any[] = [];
              if (session.metadata?.items) {
                const itemEntries = session.metadata.items.split(';');
                for (const entry of itemEntries) {
                  const [productName, variantColor, quantityStr] = entry.split('|');
                  const qty = parseInt(quantityStr, 10) || 1;
                  const product = productCatalog.find((p: any) => p.name === productName);
                  if (product) {
                    const p = product as any;
                    const variantObj = p.variants?.find((v: any) =>
                      v.color === variantColor || v.colorName === variantColor
                    );
                    orderItems.push({
                      productId: product.id,
                      productName: product.name,
                      variantColor: variantColor !== 'default' ? variantColor : undefined,
                      variantColorName: variantObj?.colorName || (variantColor !== 'default' ? variantColor : undefined),
                      quantity: qty,
                      unitPrice: product.price,
                      totalPrice: product.price * qty,
                      imageUrl: p.images?.[0] || undefined,
                    });
                  }
                }
              }

              const orderNumber = await generateOrderNumber();
              await createOrder({
                orderNumber,
                customerName,
                customerEmail,
                customerPhone,
                shippingZip: shippingAddr?.postal_code || undefined,
                shippingStreet: shippingAddr?.line1 || undefined,
                shippingNumber: shippingAddr?.line2 || undefined,
                shippingCity: shippingAddr?.city || undefined,
                shippingState: shippingAddr?.state || undefined,
                subtotal,
                shippingCost: amountShipping,
                discount: amountDiscount,
                total: amountTotal,
                paymentMethod: 'stripe',
                paymentStatus: 'paid',
                paymentId: session.payment_intent as string || session.id,
                paymentGateway: 'stripe',
                items: orderItems,
              });
              console.log(`[Webhook] Order ${orderNumber} saved to DB`);
            }
          } catch (dbErr: any) {
            console.error('[Webhook] Failed to save order to DB:', dbErr.message);
          }

          // ─── Decrement stock in ZUNO Gestão ───
          if (session.metadata?.items) {
            const itemEntries = session.metadata.items.split(";");
            for (const entry of itemEntries) {
              const [productName, variantColor, quantityStr] = entry.split("|");
              const quantity = parseInt(quantityStr, 10) || 1;

              // Find the matching e-commerce product by name
              const { productCatalog } = await import("../shared/products.js");
              const ecomProduct = productCatalog.find(
                (p: any) => p.name === productName
              );

              if (ecomProduct) {
                const gestaoEntry = findGestaoProduct(ecomProduct.id, variantColor);
                if (gestaoEntry) {
                  const success = await decrementGestaoStock(gestaoEntry.gestaoProductId, quantity);
                  console.log(
                    `[Webhook] Stock update for ${gestaoEntry.gestaoName}: ${success ? "OK" : "FAILED"} (qty: -${quantity})`
                  );
                } else {
                  console.warn(
                    `[Webhook] No stock mapping found for ${productName} / ${variantColor}`
                  );
                }
              } else {
                console.warn(`[Webhook] Product not found in catalog: ${productName}`);
              }
            }
          }
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

  // Cookie parser (needed for refresh tokens)
  app.use(cookieParser());
  // JSON body parser for all other routes
  app.use(express.json());
  // ─── Auth Routes ───────────────────────────────────────────────────────────
  app.use('/api/auth', authRouter);

  // ─── Stock Endpoint: Get all stock levels ───
  app.get("/api/stock", async (_req, res) => {
    try {
      const stockMap = await getStockMap();

      // Build response: for each e-commerce product, return stock per variant
      const stockData: Record<string, { total: number; variants: Record<string, number> }> = {};

      // Get unique product IDs
      const productIds = Array.from(new Set(stockMapping.map((m) => m.ecommerceProductId)));

      for (const productId of productIds) {
        const total = getTotalProductStock(productId, stockMap);
        const variants: Record<string, number> = {};

        const entries = stockMapping.filter((m) => m.ecommerceProductId === productId);
        for (const entry of entries) {
          variants[entry.ecommerceColorName] = stockMap.get(entry.gestaoProductId) || 0;
        }

        stockData[productId] = { total, variants };
      }

      res.json({ stock: stockData, cached: true });
    } catch (err: any) {
      console.error("[Stock] Error fetching stock:", err.message);
      res.status(500).json({ error: "Erro ao buscar estoque" });
    }
  });

  // ─── Stock Endpoint: Get stock for specific product ───
  app.get("/api/stock/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const stockMap = await getStockMap();

      const total = getTotalProductStock(productId, stockMap);
      const variants: Record<string, number> = {};

      const entries = stockMapping.filter((m) => m.ecommerceProductId === productId);
      if (entries.length === 0) {
        return res.status(404).json({ error: "Produto não encontrado no mapeamento de estoque" });
      }

      for (const entry of entries) {
        variants[entry.ecommerceColorName] = stockMap.get(entry.gestaoProductId) || 0;
      }

      res.json({ productId, total, variants });
    } catch (err: any) {
      console.error("[Stock] Error fetching product stock:", err.message);
      res.status(500).json({ error: "Erro ao buscar estoque do produto" });
    }
  });

  // ─── Stock Endpoint: Force refresh cache ───
  app.post("/api/stock/refresh", async (_req, res) => {
    try {
      invalidateStockCache();
      const stockMap = await getStockMap(true);
      res.json({ success: true, productCount: stockMap.size });
    } catch (err: any) {
      console.error("[Stock] Error refreshing stock:", err.message);
      res.status(500).json({ error: "Erro ao atualizar estoque" });
    }
  });

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

      // ─── Stock validation before checkout ───
      const stockMap = await getStockMap();
      const stockErrors: string[] = [];

      if (items && Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const product = getProductById(item.productId);
          if (!product) continue;
          const variantStock = getVariantStock(item.productId, item.variantColor || '', stockMap);
          if (variantStock < (item.quantity || 1)) {
            stockErrors.push(
              `${product.name} (${item.variantColor || 'padrão'}): apenas ${variantStock} em estoque`
            );
          }
        }
      } else if (productId) {
        const product = getProductById(productId);
        if (product) {
          const variantStock = getVariantStock(productId, variantColor || '', stockMap);
          if (variantStock < quantity) {
            stockErrors.push(
              `${product.name} (${variantColor || 'padrão'}): apenas ${variantStock} em estoque`
            );
          }
        }
      }

      if (stockErrors.length > 0) {
        return res.status(409).json({
          error: "Estoque insuficiente",
          details: stockErrors,
        });
      }

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

  // ─── Mercado Pago: PIX Payment ───
  app.post("/api/mp/pix", async (req, res) => {
    try {
      const { items, payer, address, externalReference } = req.body;
      if (!items || !payer?.email) {
        return res.status(400).json({ error: "items e payer.email são obrigatórios" });
      }
      const { createPixPayment } = await import("./mercadopago.js");
      const origin = req.headers.origin || `${req.protocol}://${req.get("host")}`;
      const result = await createPixPayment({
        items,
        payer,
        address,
        externalReference,
        notificationUrl: `${origin}/api/mp/webhook`,
      });
      res.json(result);
    } catch (err: any) {
      console.error("[MP PIX] Error:", err.message);
      res.status(500).json({ error: "Erro ao criar pagamento PIX" });
    }
  });

  // ─── Mercado Pago: Boleto Payment ───
  app.post("/api/mp/boleto", async (req, res) => {
    try {
      const { items, payer, address, externalReference } = req.body;
      if (!items || !payer?.email || !payer?.cpf) {
        return res.status(400).json({ error: "items, payer.email e payer.cpf são obrigatórios" });
      }
      if (!address?.zip_code || !address?.street_name) {
        return res.status(400).json({ error: "Endereço completo é obrigatório para boleto" });
      }
      const { createBoletoPayment } = await import("./mercadopago.js");
      const origin = req.headers.origin || `${req.protocol}://${req.get("host")}`;
      const result = await createBoletoPayment({
        items,
        payer,
        address,
        externalReference,
        notificationUrl: `${origin}/api/mp/webhook`,
      });
      res.json(result);
    } catch (err: any) {
      console.error("[MP Boleto] Error:", err.message);
      res.status(500).json({ error: "Erro ao criar boleto" });
    }
  });

  // ─── Mercado Pago: Card Payment ───
  app.post("/api/mp/card", async (req, res) => {
    try {
      const { items, payer, token, installments, issuerId, paymentMethodId, externalReference } = req.body;
      if (!items || !payer?.email || !payer?.cpf || !token || !paymentMethodId) {
        return res.status(400).json({ error: "items, payer, token e paymentMethodId são obrigatórios" });
      }
      const { createCardPayment } = await import("./mercadopago.js");
      const origin = req.headers.origin || `${req.protocol}://${req.get("host")}`;
      const result = await createCardPayment({
        items,
        payer,
        token,
        installments: installments || 1,
        issuerId,
        paymentMethodId,
        externalReference,
        notificationUrl: `${origin}/api/mp/webhook`,
      });
      res.json(result);
    } catch (err: any) {
      console.error("[MP Card] Error:", err.message);
      res.status(500).json({ error: "Erro ao processar pagamento" });
    }
  });

  // ─── Mercado Pago: Get Payment Status ───
  app.get("/api/mp/payment/:id", async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) {
        return res.status(400).json({ error: "ID de pagamento inválido" });
      }
      const { getPaymentStatus } = await import("./mercadopago.js");
      const result = await getPaymentStatus(paymentId);
      res.json(result);
    } catch (err: any) {
      console.error("[MP Status] Error:", err.message);
      res.status(500).json({ error: "Erro ao buscar status do pagamento" });
    }
  });

  // ─── Mercado Pago: Webhook ───
  app.post("/api/mp/webhook", async (req, res) => {
    try {
      const { type, data } = req.body;
      console.log(`[MP Webhook] Event: ${type}, ID: ${data?.id}`);

      if (type === "payment" && data?.id) {
        const { getPaymentStatus } = await import("./mercadopago.js");
        const payment = await getPaymentStatus(parseInt(data.id, 10));
        console.log(`[MP Webhook] Payment ${payment.id} status: ${payment.status}`);

        // Save order to database on approved/in_process payment
        if ((payment.status === 'approved' || payment.status === 'in_process') && payment.external_reference) {
          try {
            const { createOrder, generateOrderNumber, getOrderByNumber } = await import('./db/orders.js');
            const { productCatalog } = await import('../shared/products.js');

            // Idempotency: avoid duplicate orders
            const existingOrder = await getOrderByNumber(`MP-${payment.id}`);
            if (!existingOrder) {
              const parts = payment.external_reference.split(';');
              const orderItems: any[] = [];
              let subtotal = 0;

              for (const part of parts) {
                const [productId, variantColor, qtyStr] = part.split('|');
                const qty = parseInt(qtyStr, 10) || 1;
                const product = (productCatalog as any[]).find((p: any) => p.id === productId);
                if (product) {
                  const p = product as any;
                  const variantObj = p.variants?.find((v: any) =>
                    v.color === variantColor || v.colorName === variantColor
                  );
                  const unitPrice = product.price;
                  const totalPrice = unitPrice * qty;
                  subtotal += totalPrice;
                  orderItems.push({
                    productId: product.id,
                    productName: product.name,
                    variantColor: variantColor !== 'default' ? variantColor : undefined,
                    variantColorName: variantObj?.colorName || (variantColor !== 'default' ? variantColor : undefined),
                    quantity: qty,
                    unitPrice,
                    totalPrice,
                    imageUrl: p.images?.[0] || undefined,
                  });
                }
              }

              const total = payment.amount || subtotal;
              const paymentMethodId = payment.payment_method || 'pix';
              const methodMap: Record<string, 'pix' | 'boleto' | 'card'> = {
                pix: 'pix', bolbradesco: 'boleto', pec: 'boleto',
                visa: 'card', master: 'card', amex: 'card', elo: 'card',
              };
              const method = methodMap[paymentMethodId] || 'pix';

              const orderNumber = await generateOrderNumber();
              await createOrder({
                orderNumber,
                customerEmail: payment.payer_email || '',
                subtotal,
                shippingCost: 0,
                discount: 0,
                total,
                paymentMethod: method,
                paymentStatus: payment.status === 'approved' ? 'paid' : 'pending',
                paymentId: String(payment.id),
                paymentGateway: 'mercadopago',
                items: orderItems,
              });
              console.log(`[MP Webhook] Order ${orderNumber} saved to DB (payment ${payment.id})`);
            }
          } catch (dbErr: any) {
            console.error('[MP Webhook] Failed to save order:', dbErr.message);
          }
        }

        // Decrement stock on approved payment
        if (payment.status === "approved" && payment.external_reference) {
          console.log(`[MP Webhook] Payment approved, ref: ${payment.external_reference}`);
          // external_reference format: "productId|variantColor|quantity"
          const parts = payment.external_reference.split(";");
          for (const part of parts) {
            const [productId, variantColor, qtyStr] = part.split("|");
            const quantity = parseInt(qtyStr, 10) || 1;
            const { findGestaoProduct } = await import("../shared/stockMapping.js");
            const { decrementGestaoStock } = await import("./zunoGestao.js");
            const gestaoEntry = findGestaoProduct(productId, variantColor);
            if (gestaoEntry) {
              await decrementGestaoStock(gestaoEntry.gestaoProductId, quantity);
              console.log(`[MP Webhook] Stock decremented for ${gestaoEntry.gestaoName}`);
            }
          }
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("[MP Webhook] Error:", err.message);
      res.status(500).json({ error: "Webhook error" });
    }
  });

  // ─── Admin Auth ───
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) return res.status(400).json({ error: 'Senha obrigatória' });
      const { adminLogin } = await import('./adminAuth.js');
      const token = await adminLogin(password);
      if (!token) return res.status(401).json({ error: 'Senha incorreta' });
      res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; Path=/; Max-Age=${24 * 3600}; SameSite=Lax`);
      res.json({ token, ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/logout', async (req, res) => {
    try {
      const { extractAdminToken, adminLogout } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (token) await adminLogout(token);
      res.setHeader('Set-Cookie', 'admin_token=; HttpOnly; Path=/; Max-Age=0');
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/me', async (req, res) => {
    try {
      const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (!token) return res.status(401).json({ error: 'Não autenticado' });
      const valid = await validateAdminToken(token);
      if (!valid) return res.status(401).json({ error: 'Sessão expirada' });
      res.json({ authenticated: true, role: 'admin' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Admin: Stats Dashboard ───
  app.get('/api/admin/stats', async (req, res) => {
    try {
      const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (!token || !(await validateAdminToken(token))) return res.status(401).json({ error: 'Não autorizado' });
      const { getAdminStats } = await import('./db/orders.js');
      const stats = await getAdminStats();
      res.json(stats);
    } catch (err: any) {
      console.error('[Admin Stats]', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Admin: List Orders ───
  app.get('/api/admin/orders', async (req, res) => {
    try {
      const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (!token || !(await validateAdminToken(token))) return res.status(401).json({ error: 'Não autorizado' });
      const { getOrders } = await import('./db/orders.js');
      const { page, limit, status, search, dateFrom, dateTo } = req.query as any;
      const result = await getOrders({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
        status, search, dateFrom, dateTo,
      });
      res.json(result);
    } catch (err: any) {
      console.error('[Admin Orders]', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Admin: Get Order Detail ───
  app.get('/api/admin/orders/:id', async (req, res) => {
    try {
      const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (!token || !(await validateAdminToken(token))) return res.status(401).json({ error: 'Não autorizado' });
      const { getOrderById } = await import('./db/orders.js');
      const result = await getOrderById(parseInt(req.params.id));
      if (!result) return res.status(404).json({ error: 'Pedido não encontrado' });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Admin: Update Order Status ───
  app.patch('/api/admin/orders/:id/status', async (req, res) => {
    try {
      const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (!token || !(await validateAdminToken(token))) return res.status(401).json({ error: 'Não autorizado' });
      const { updateOrderStatus } = await import('./db/orders.js');
      const { status, trackingCode } = req.body;
      await updateOrderStatus(parseInt(req.params.id), status, trackingCode);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Admin: Stock (from ZUNO Gestão) ───
  app.get('/api/admin/stock', async (req, res) => {
    try {
      const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (!token || !(await validateAdminToken(token))) return res.status(401).json({ error: 'Não autorizado' });
      const stockMap = await getStockMap();
      const result = stockMapping.map(m => ({
        ...m,
        currentStock: stockMap.get(m.gestaoProductId) || 0,
      }));
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Admin: List Users ───
  app.get('/api/admin/users', async (req, res) => {
    try {
      const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (!token || !(await validateAdminToken(token))) return res.status(401).json({ error: 'Não autorizado' });
      const { db } = await import('./db/connection.js');
      const { users: usersTable, roles: rolesTable, userRoles: userRolesTable } = await import('../drizzle/schema.js');
      const { eq, or, like, sql } = await import('drizzle-orm');
      const { page = '1', limit = '20', search = '' } = req.query as Record<string, string>;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;
      let baseQuery = db.select().from(usersTable).$dynamic();
      if (search) {
        baseQuery = baseQuery.where(or(like(usersTable.name, `%${search}%`), like(usersTable.email, `%${search}%`)));
      }
      const allUsers = await baseQuery.limit(limitNum).offset(offset);
      const countResult = await db.select({ count: sql`count(*)` }).from(usersTable);
      const usersWithRoles = await Promise.all(allUsers.map(async (u: any) => {
        const userRoleRows = await db
          .select({ roleName: rolesTable.name })
          .from(userRolesTable)
          .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
          .where(eq(userRolesTable.userId, u.id));
        return {
          ...u,
          roles: userRoleRows.map((r: any) => r.roleName),
          isActive: true,
        };
      }));
      res.json({ users: usersWithRoles, total: Number((countResult[0] as any).count) });
    } catch (err: any) {
      console.error('[Admin Users]', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Admin: Update User Roles ───
  app.patch('/api/admin/users/:id/roles', async (req, res) => {
    try {
      const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (!token || !(await validateAdminToken(token))) return res.status(401).json({ error: 'Não autorizado' });
      const { db } = await import('./db/connection.js');
      const { roles: rolesTable, userRoles: userRolesTable } = await import('../drizzle/schema.js');
      const { eq, inArray } = await import('drizzle-orm');
      const userId = parseInt(req.params.id);
      const { roles: newRoles } = req.body;
      await db.delete(userRolesTable).where(eq(userRolesTable.userId, userId));
      if (newRoles && newRoles.length > 0) {
        const roleRows = await db.select().from(rolesTable).where(inArray(rolesTable.name, newRoles));
        if (roleRows.length > 0) {
          await db.insert(userRolesTable).values(roleRows.map((r: any) => ({ userId, roleId: r.id })));
        }
      }
      res.json({ ok: true });
    } catch (err: any) {
      console.error('[Admin Users Roles]', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Admin: Toggle User Status ───
  app.patch('/api/admin/users/:id/status', async (_req, res) => {
    res.json({ ok: true });
  });

  // ─── Admin: ZUNO Gestão Proxy Endpoints ───
  const GESTAO_URL = process.env.ZUNO_GESTAO_API_URL || 'https://zunogestao-gh3xjvgt.manus.space';
  const GESTAO_KEY = process.env.ZUNO_GESTAO_API_KEY || '';

  async function gestaoGet(endpoint: string) {
    const r = await fetch(`${GESTAO_URL}/api/trpc/${endpoint}`, { headers: { 'X-API-Key': GESTAO_KEY } });
    const d = await r.json();
    return d?.result?.data?.json;
  }

  async function gestaoPost(endpoint: string, body: any) {
    const r = await fetch(`${GESTAO_URL}/api/trpc/${endpoint}`, {
      method: 'POST',
      headers: { 'X-API-Key': GESTAO_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ json: body }),
    });
    const d = await r.json();
    return d?.result?.data?.json;
  }

  async function requireAdmin(req: any, res: any): Promise<boolean> {
    const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
    const token = extractAdminToken(req);
    if (!token || !(await validateAdminToken(token))) {
      res.status(401).json({ error: 'Não autorizado' });
      return false;
    }
    return true;
  }

  // Sales
  app.get('/api/admin/gestao/sales', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try { res.json(await gestaoGet('sales.list') || []); } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // Financial summary
  app.get('/api/admin/gestao/financial', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try { res.json(await gestaoGet('financial.summary') || {}); } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // Investments
  app.get('/api/admin/gestao/investments', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try { res.json(await gestaoGet('investments.list') || []); } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/admin/gestao/investments', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try { res.json(await gestaoPost('investments.create', req.body) || {}); } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // Partners (Sócios)
  app.get('/api/admin/gestao/partners', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try { res.json(await gestaoGet('partners.list') || []); } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // Coupons / Discounts
  app.get('/api/admin/gestao/coupons', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try { res.json(await gestaoGet('coupons.list') || []); } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/admin/gestao/coupons', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try { res.json(await gestaoPost('coupons.create', req.body) || {}); } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.patch('/api/admin/gestao/coupons/:id/toggle', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try { res.json(await gestaoPost('coupons.toggle', { id: parseInt(req.params.id) }) || {}); } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/admin/gestao/coupons/:id', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try { res.json(await gestaoPost('coupons.delete', { id: parseInt(req.params.id) }) || {}); } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // Affiliates
  app.get('/api/admin/gestao/affiliates', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try { res.json(await gestaoGet('affiliates.list') || []); } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // Products (full list with cost/margin)
  app.get('/api/admin/gestao/products', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try { res.json(await gestaoGet('products.list') || []); } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.patch('/api/admin/gestao/products/:id/stock', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const { updateGestaoStock: updateStock } = await import('./zunoGestao.js');
      const ok = await updateStock(parseInt(id), stock);
      res.json({ ok });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
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
