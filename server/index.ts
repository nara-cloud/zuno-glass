import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import cookieParser from "cookie-parser";
import authRouter from "./auth.js";
// Note: ZUNO Gestão API removed - stock managed via local DB (catalog_variants table)

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

          // ─── Decrement stock in local DB ───
          if (session.metadata?.items) {
            const itemEntries = session.metadata.items.split(";");
            const mysql2 = await import('mysql2/promise');
            const pool = mysql2.createPool(process.env.DATABASE_URL || '');
            for (const entry of itemEntries) {
              const [productName, variantColor, quantityStr] = entry.split("|");
              const quantity = parseInt(quantityStr, 10) || 1;
              try {
                // Find product by name and decrement variant stock
                const [rows] = await pool.execute(
                  `UPDATE catalog_variants cv
                   JOIN catalog_products cp ON cv.product_id = cp.id
                   SET cv.stock = GREATEST(0, cv.stock - ?)
                   WHERE cp.name = ? AND cv.color_name = ?`,
                  [quantity, productName, variantColor]
                ) as any[];
                console.log(`[Webhook] Stock decremented for ${productName} / ${variantColor} (qty: -${quantity})`);
              } catch (stockErr: any) {
                console.warn(`[Webhook] Failed to decrement stock for ${productName} / ${variantColor}:`, stockErr.message);
              }
            }
            await pool.end();
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

  // ─── Stock Endpoint: Get all stock levels (from local DB) ───
  app.get("/api/stock", async (_req, res) => {
    try {
      const mysql2 = await import('mysql2/promise');
      const pool = mysql2.createPool(process.env.DATABASE_URL || '');
      const [rows] = await pool.execute(
        `SELECT cv.color_name, cv.stock, cp.slug as product_slug
         FROM catalog_variants cv
         JOIN catalog_products cp ON cv.product_id = cp.id
         WHERE cv.is_active = 1 AND cp.is_active = 1`
      ) as any[];
      await pool.end();
      const stockData: Record<string, { total: number; variants: Record<string, number> }> = {};
      for (const v of rows) {
        const slug = v.product_slug;
        if (!stockData[slug]) stockData[slug] = { total: 0, variants: {} };
        stockData[slug].variants[v.color_name] = Number(v.stock);
        stockData[slug].total += Number(v.stock);
      }
      res.json({ stock: stockData, cached: false });
    } catch (err: any) {
      console.error("[Stock] Error fetching stock from DB:", err.message);
      res.status(500).json({ error: "Erro ao buscar estoque" });
    }
  });

  // ─── Stock Endpoint: Get stock for specific product (from local DB) ───
  app.get("/api/stock/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const mysql2 = await import('mysql2/promise');
      const pool = mysql2.createPool(process.env.DATABASE_URL || '');
      const [rows] = await pool.execute(
        `SELECT cv.color_name, cv.stock
         FROM catalog_variants cv
         JOIN catalog_products cp ON cv.product_id = cp.id
         WHERE cp.slug = ? AND cv.is_active = 1 AND cp.is_active = 1`,
        [productId]
      ) as any[];
      await pool.end();
      if ((rows as any[]).length === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      const variantMap: Record<string, number> = {};
      let total = 0;
      for (const v of rows as any[]) {
        variantMap[v.color_name] = Number(v.stock);
        total += Number(v.stock);
      }
      res.json({ productId, total, variants: variantMap });
    } catch (err: any) {
      console.error("[Stock] Error fetching product stock from DB:", err.message);
      res.status(500).json({ error: "Erro ao buscar estoque do produto" });
    }
  });

  // ─── Stock Endpoint: Force refresh (no-op for DB) ───
  app.post("/api/stock/refresh", async (_req, res) => {
    res.json({ success: true, message: 'Estoque sincronizado com a base de dados local' });
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

  // ─── Mercado Pago Checkout Pro (Multi-item cart with shipping) ───
  app.post("/api/checkout", async (req, res) => {
    try {
      const { items, productId, variantColor, quantity = 1, shippingCost = 0, shippingRegion, payerEmail } = req.body;
      const { getProductById } = await import("../shared/products.js");
      const origin = req.headers.origin || `${req.protocol}://${req.get("host")}`;

      // ─── Stock validation before checkout (local DB) ───
      const stockErrors: string[] = [];
      const mysql2 = await import('mysql2/promise');
      const stockPool = mysql2.createPool(process.env.DATABASE_URL || '');

      const checkStock = async (prodId: string, color: string, qty: number, prodName: string) => {
        const [rows] = await stockPool.execute(
          `SELECT cv.stock FROM catalog_variants cv
           JOIN catalog_products cp ON cv.product_id = cp.id
           WHERE cp.slug = ? AND cv.color_name = ? AND cv.is_active = 1`,
          [prodId, color]
        ) as any[];
        const available = rows.length > 0 ? Number(rows[0].stock) : -1;
        if (available !== -1 && available < qty) {
          stockErrors.push(`${prodName} (${color || 'padrão'}): apenas ${available} em estoque`);
        }
      };

      if (items && Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const product = getProductById(item.productId);
          if (!product) continue;
          await checkStock(item.productId, item.variantColor || '', item.quantity || 1, product.name);
        }
      } else if (productId) {
        const product = getProductById(productId);
        if (product) {
          await checkStock(productId, variantColor || '', quantity, product.name);
        }
      }
      await stockPool.end();

      if (stockErrors.length > 0) {
        return res.status(409).json({
          error: "Estoque insuficiente",
          details: stockErrors,
        });
      }

      // Build MP items list
      const mpItems: { id: string; title: string; quantity: number; unit_price: number }[] = [];
      let externalRef: string[] = [];

      if (items && Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const product = getProductById(item.productId);
          if (!product) continue;
          mpItems.push({
            id: item.productId,
            title: `ZUNO GLASS — ${product.name}${item.variantColor ? ` (${item.variantColor})` : ''}`,
            quantity: item.quantity || 1,
            unit_price: product.price,
          });
          externalRef.push(`${item.productId}|${item.variantColor || 'default'}|${item.quantity || 1}`);
        }
      } else if (productId) {
        const product = getProductById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });
        mpItems.push({
          id: productId,
          title: `ZUNO GLASS — ${product.name}${variantColor ? ` (${variantColor})` : ''}`,
          quantity,
          unit_price: product.price,
        });
        externalRef.push(`${productId}|${variantColor || 'default'}|${quantity}`);
      } else {
        return res.status(400).json({ error: "items or productId is required" });
      }

      if (mpItems.length === 0) {
        return res.status(400).json({ error: "No valid products found" });
      }

      const { createPreference } = await import("./mercadopago.js");
      const preference = await createPreference({
        items: mpItems,
        externalReference: externalRef.join(';'),
        successUrl: `${origin}/checkout/success`,
        failureUrl: `${origin}/checkout?error=payment_failed`,
        pendingUrl: `${origin}/checkout/success?pending=true`,
        payerEmail: payerEmail || undefined,
        shippingCost: shippingCost || 0,
        notificationUrl: `${origin}/api/mp/webhook`,
      });

      res.json({ url: preference.init_point });
    } catch (err: any) {
      console.error("[Checkout MP] Error creating preference:", err.message);
      res.status(500).json({ error: "Erro ao criar sessão de pagamento" });
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
            // Idempotency: avoid duplicate orders
            const existingOrder = await getOrderByNumber(`MP-${payment.id}`);
            if (!existingOrder) {
              const parts = payment.external_reference.split(';');
              const orderItems: any[] = [];
              let subtotal = 0;
              // Use local DB to look up products instead of static catalog
              const mysql2mp = await import('mysql2/promise');
              const mpPool = mysql2mp.createPool(process.env.DATABASE_URL || '');
              for (const part of parts) {
                const [productSlug, variantColor, qtyStr] = part.split('|');
                const qty = parseInt(qtyStr, 10) || 1;
                // Look up product and variant from local DB
                const [productRows] = await mpPool.execute(
                  `SELECT cp.id, cp.name, cp.slug, cp.image_url,
                          cv.color_name, cv.price, cv.image_url as variant_image
                   FROM catalog_products cp
                   LEFT JOIN catalog_variants cv ON cv.product_id = cp.id
                   WHERE cp.slug = ? AND (cv.color_name = ? OR cv.color_name IS NULL)
                   LIMIT 1`,
                  [productSlug, variantColor]
                ) as any[];
                if (productRows.length > 0) {
                  const row = productRows[0];
                  const unitPrice = parseFloat(row.price) || 0;
                  const totalPrice = unitPrice * qty;
                  subtotal += totalPrice;
                  orderItems.push({
                    productId: row.slug,
                    productName: row.name,
                    variantColor: variantColor !== 'default' ? variantColor : undefined,
                    variantColorName: row.color_name || (variantColor !== 'default' ? variantColor : undefined),
                    quantity: qty,
                    unitPrice,
                    totalPrice,
                    imageUrl: row.variant_image || row.image_url || undefined,
                  });
                }
              }
              await mpPool.end();

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

        // Decrement stock on approved payment (local DB)
        if (payment.status === "approved" && payment.external_reference) {
          console.log(`[MP Webhook] Payment approved, ref: ${payment.external_reference}`);
          // external_reference format: "productId|variantColor|quantity"
          const parts = payment.external_reference.split(";");
          const mysql2 = await import('mysql2/promise');
          const pool = mysql2.createPool(process.env.DATABASE_URL || '');
          for (const part of parts) {
            const [productSlug, variantColor, qtyStr] = part.split("|");
            const quantity = parseInt(qtyStr, 10) || 1;
            try {
              await pool.execute(
                `UPDATE catalog_variants cv
                 JOIN catalog_products cp ON cv.product_id = cp.id
                 SET cv.stock = GREATEST(0, cv.stock - ?)
                 WHERE cp.slug = ? AND cv.color_name = ?`,
                [quantity, productSlug, variantColor]
              );
              console.log(`[MP Webhook] Stock decremented for ${productSlug} / ${variantColor} (qty: -${quantity})`);
            } catch (stockErr: any) {
              console.warn(`[MP Webhook] Failed to decrement stock for ${productSlug} / ${variantColor}:`, stockErr.message);
            }
          }
          await pool.end();
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("[MP Webhook] Error:", err.message);
      res.status(500).json({ error: "Webhook error" });
    }
  });

  // ─── Coupon Validation ───
  app.get('/api/mp/coupon', async (req, res) => {
    try {
      const code = (req.query.code as string || '').trim().toUpperCase();
      const total = parseFloat(req.query.total as string) || 0;

      if (!code) {
        return res.status(400).json({ valid: false, error: 'Código do cupom não informado.' });
      }

      const mysql2 = await import('mysql2/promise');
      const conn = await mysql2.createConnection(process.env.DATABASE_URL || '');
      const [rows] = await conn.execute(
        'SELECT * FROM coupons WHERE code = ? AND is_active = 1 LIMIT 1',
        [code]
      ) as any[];
      await conn.end();

      if (!rows || rows.length === 0) {
        return res.json({ valid: false, error: 'Cupom inválido ou não encontrado.' });
      }

      const coupon = rows[0];

      // Check expiry
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return res.json({ valid: false, error: 'Cupom expirado.' });
      }

      // Check max uses
      if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
        return res.json({ valid: false, error: 'Cupom já atingiu o limite de usos.' });
      }

      // Check minimum order value
      if (coupon.min_order_value !== null && total < parseFloat(coupon.min_order_value)) {
        return res.json({
          valid: false,
          error: `Pedido mínimo de R$ ${parseFloat(coupon.min_order_value).toFixed(2).replace('.', ',')} para usar este cupom.`
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discount_type === 'percentage') {
        discountAmount = total * (parseFloat(coupon.discount_value) / 100);
      } else {
        discountAmount = Math.min(parseFloat(coupon.discount_value), total);
      }

      return res.json({
        valid: true,
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: parseFloat(coupon.discount_value),
        discountAmount: Math.round(discountAmount * 100) / 100,
      });
    } catch (err: any) {
      console.error('[Coupon] Error:', err.message);
      res.status(500).json({ valid: false, error: 'Erro ao validar cupom.' });
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

  // ─── Admin: Stock (from local DB) ───
  app.get('/api/admin/stock', async (req, res) => {
    try {
      const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (!token || !(await validateAdminToken(token))) return res.status(401).json({ error: 'Não autorizado' });
      const mysql2 = await import('mysql2/promise');
      const pool = mysql2.createPool(process.env.DATABASE_URL || '');
      const [rows] = await pool.execute(
        `SELECT cv.sku, cv.color_name as ecommerceColorName, cv.stock as currentStock,
                cp.slug as ecommerceProductId, cp.name as productName, cp.category
         FROM catalog_variants cv
         JOIN catalog_products cp ON cv.product_id = cp.id
         WHERE cv.is_active = 1 AND cp.is_active = 1
         ORDER BY cp.name, cv.color_name`
      ) as any[];
      await pool.end();
      res.json(rows);
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

  // ─── Admin: Create User ───
  app.post('/api/admin/users', async (req, res) => {
    try {
      const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (!token || !(await validateAdminToken(token))) return res.status(401).json({ error: 'Não autorizado' });
      const { db } = await import('./db/connection.js');
      const { users: usersTable, roles: rolesTable, userRoles: userRolesTable } = await import('../drizzle/schema.js');
      const { eq, inArray } = await import('drizzle-orm');
      const bcrypt = await import('bcryptjs');
      const { name, email, password, roles: newRoles } = req.body;
      if (!name || !email || !password) return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
      if (password.length < 6) return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
      const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
      if (existing.length > 0) return res.status(409).json({ error: 'Já existe um utilizador com este e-mail.' });
      const passwordHash = await bcrypt.hash(password, 10);
      const [result] = await db.insert(usersTable).values({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        emailVerified: true,
      });
      const userId = (result as any).insertId;
      if (newRoles && newRoles.length > 0) {
        const roleRows = await db.select().from(rolesTable).where(inArray(rolesTable.name, newRoles));
        if (roleRows.length > 0) {
          await db.insert(userRolesTable).values(roleRows.map((r: any) => ({ userId, roleId: r.id })));
        }
      }
      res.json({ ok: true, userId });
    } catch (err: any) {
      console.error('[Admin Create User]', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Admin: Delete User ───
  app.delete('/api/admin/users/:id', async (req, res) => {
    try {
      const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
      const token = extractAdminToken(req);
      if (!token || !(await validateAdminToken(token))) return res.status(401).json({ error: 'Não autorizado' });
      const { db } = await import('./db/connection.js');
      const { users: usersTable } = await import('../drizzle/schema.js');
      const { eq } = await import('drizzle-orm');
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) return res.status(400).json({ error: 'ID inválido.' });
      await db.delete(usersTable).where(eq(usersTable.id, userId));
      res.json({ ok: true });
    } catch (err: any) {
      console.error('[Admin Delete User]', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  async function requireAdmin(req: any, res: any): Promise<boolean> {
    const { extractAdminToken, validateAdminToken } = await import('./adminAuth.js');
    const token = extractAdminToken(req);
    if (!token || !(await validateAdminToken(token))) {
      res.status(401).json({ error: 'Não autorizado' });
      return false;
    }
    return true;
  }
  async function getPool() {
    const mysql2 = await import('mysql2/promise');
    return mysql2.createPool(process.env.DATABASE_URL || '');
  }

  // ─── Admin: Sales (from orders table) ───────────────────────────────────────
  app.get('/api/admin/gestao/sales', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      const [rows] = await pool.execute(
        `SELECT o.id, o.order_number, o.customer_name, o.customer_email, o.total,
                o.payment_status, o.status, o.payment_method, o.created_at,
                GROUP_CONCAT(oi.product_name SEPARATOR ', ') as items
         FROM orders o
         LEFT JOIN order_items oi ON oi.order_id = o.id
         WHERE o.payment_status = 'paid'
         GROUP BY o.id
         ORDER BY o.created_at DESC
         LIMIT 200`
      );
      await pool.end();
      res.json(rows);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ─── Admin: Financial Summary ────────────────────────────────────────────────
  app.get('/api/admin/gestao/financial', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      const [[summary]] = await pool.execute(
        `SELECT
           COUNT(*) as total_orders,
           SUM(CASE WHEN payment_status='paid' THEN total ELSE 0 END) as total_revenue,
           SUM(CASE WHEN payment_status='paid' AND MONTH(created_at)=MONTH(NOW()) AND YEAR(created_at)=YEAR(NOW()) THEN total ELSE 0 END) as revenue_this_month,
           SUM(CASE WHEN payment_status='paid' AND DATE(created_at)=DATE(NOW()) THEN total ELSE 0 END) as revenue_today,
           SUM(CASE WHEN payment_status='pending' THEN total ELSE 0 END) as pending_revenue
         FROM orders`
      ) as any[];
      const [[investTotal]] = await pool.execute(
        `SELECT COALESCE(SUM(amount),0) as total_invested FROM investments`
      ) as any[];
      await pool.end();
      res.json({ ...summary, total_invested: investTotal.total_invested });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ─── Admin: Investments ──────────────────────────────────────────────────────
  app.get('/api/admin/gestao/investments', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      const [rows] = await pool.execute(`SELECT * FROM investments ORDER BY date DESC, created_at DESC`);
      await pool.end();
      res.json(rows);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.post('/api/admin/gestao/investments', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { description, amount, category, date, notes } = req.body;
      const pool = await getPool();
      const [result] = await pool.execute(
        `INSERT INTO investments (description, amount, category, date, notes) VALUES (?,?,?,?,?)`,
        [description, amount, category || 'geral', date, notes || null]
      ) as any[];
      const [rows] = await pool.execute(`SELECT * FROM investments WHERE id = ?`, [result.insertId]);
      await pool.end();
      res.json((rows as any[])[0]);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/admin/gestao/investments/:id', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      await pool.execute(`DELETE FROM investments WHERE id = ?`, [req.params.id]);
      await pool.end();
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ─── Admin: Partners ─────────────────────────────────────────────────────────
  app.get('/api/admin/gestao/partners', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      const [rows] = await pool.execute(`SELECT * FROM partners ORDER BY name`);
      await pool.end();
      res.json(rows);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.post('/api/admin/gestao/partners', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { name, email, phone, commissionRate, notes } = req.body;
      const pool = await getPool();
      const [result] = await pool.execute(
        `INSERT INTO partners (name, email, phone, commission_rate, notes) VALUES (?,?,?,?,?)`,
        [name, email || null, phone || null, commissionRate || 0, notes || null]
      ) as any[];
      const [rows] = await pool.execute(`SELECT * FROM partners WHERE id = ?`, [result.insertId]);
      await pool.end();
      res.json((rows as any[])[0]);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.patch('/api/admin/gestao/partners/:id', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { name, email, phone, commissionRate, isActive, notes } = req.body;
      const pool = await getPool();
      await pool.execute(
        `UPDATE partners SET name=?, email=?, phone=?, commission_rate=?, is_active=?, notes=? WHERE id=?`,
        [name, email || null, phone || null, commissionRate || 0, isActive !== false ? 1 : 0, notes || null, req.params.id]
      );
      const [rows] = await pool.execute(`SELECT * FROM partners WHERE id = ?`, [req.params.id]);
      await pool.end();
      res.json((rows as any[])[0]);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/admin/gestao/partners/:id', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      await pool.execute(`DELETE FROM partners WHERE id = ?`, [req.params.id]);
      await pool.end();
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ─── Admin: Coupons ──────────────────────────────────────────────────────────
  app.get('/api/admin/gestao/coupons', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      const [rows] = await pool.execute(`SELECT * FROM coupons ORDER BY created_at DESC`);
      await pool.end();
      res.json(rows);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.post('/api/admin/gestao/coupons', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { code, discountType, discountValue, minOrderValue, maxUses, expiresAt } = req.body;
      const pool = await getPool();
      const [result] = await pool.execute(
        `INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_uses, expires_at) VALUES (?,?,?,?,?,?)`,
        [code.toUpperCase(), discountType || 'percentage', discountValue, minOrderValue || null, maxUses || null, expiresAt || null]
      ) as any[];
      const [rows] = await pool.execute(`SELECT * FROM coupons WHERE id = ?`, [result.insertId]);
      await pool.end();
      res.json((rows as any[])[0]);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.patch('/api/admin/gestao/coupons/:id/toggle', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      await pool.execute(`UPDATE coupons SET is_active = NOT is_active WHERE id = ?`, [req.params.id]);
      const [rows] = await pool.execute(`SELECT * FROM coupons WHERE id = ?`, [req.params.id]);
      await pool.end();
      res.json((rows as any[])[0]);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/admin/gestao/coupons/:id', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      await pool.execute(`DELETE FROM coupons WHERE id = ?`, [req.params.id]);
      await pool.end();
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ─── Admin: Affiliates ───────────────────────────────────────────────────────
  app.get('/api/admin/gestao/affiliates', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      const [rows] = await pool.execute(`SELECT * FROM affiliates ORDER BY name`);
      await pool.end();
      res.json(rows);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.post('/api/admin/gestao/affiliates', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { name, email, code, commissionRate } = req.body;
      const pool = await getPool();
      const [result] = await pool.execute(
        `INSERT INTO affiliates (name, email, code, commission_rate) VALUES (?,?,?,?)`,
        [name, email, code.toUpperCase(), commissionRate || 10]
      ) as any[];
      const [rows] = await pool.execute(`SELECT * FROM affiliates WHERE id = ?`, [result.insertId]);
      await pool.end();
      res.json((rows as any[])[0]);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.patch('/api/admin/gestao/affiliates/:id/toggle', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      await pool.execute(`UPDATE affiliates SET is_active = NOT is_active WHERE id = ?`, [req.params.id]);
      const [rows] = await pool.execute(`SELECT * FROM affiliates WHERE id = ?`, [req.params.id]);
      await pool.end();
      res.json((rows as any[])[0]);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/admin/gestao/affiliates/:id', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      await pool.execute(`DELETE FROM affiliates WHERE id = ?`, [req.params.id]);
      await pool.end();
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ─── Admin: Products (from catalog_products) ─────────────────────────────────
  app.get('/api/admin/gestao/products', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const pool = await getPool();
      const [rows] = await pool.execute(
        `SELECT cp.id, cp.name, cp.slug, cp.category, cp.price, cp.cost_price,
                cp.is_active, COALESCE(SUM(cv.stock),0) as total_stock
         FROM catalog_products cp
         LEFT JOIN catalog_variants cv ON cv.product_id = cp.id
         GROUP BY cp.id
         ORDER BY cp.name`
      );
      await pool.end();
      res.json(rows);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.patch('/api/admin/gestao/products/:id/stock', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { stock } = req.body;
      const pool = await getPool();
      await pool.execute(`UPDATE catalog_variants SET stock = ? WHERE product_id = ?`, [parseInt(stock), req.params.id]);
      await pool.end();
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ─── Validate Coupon (public) ────────────────────────────────────────────────
  app.post('/api/coupons/validate', async (req, res) => {
    try {
      const { code, orderValue } = req.body;
      const pool = await getPool();
      const [rows] = await pool.execute(
        `SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW()) AND (max_uses IS NULL OR used_count < max_uses)`,
        [code?.toUpperCase()]
      ) as any[];
      await pool.end();
      if (!(rows as any[]).length) return res.status(404).json({ error: 'Cupom inválido ou expirado' });
      const coupon = (rows as any[])[0];
      if (coupon.min_order_value && orderValue < coupon.min_order_value) {
        return res.status(400).json({ error: `Pedido mínimo de R$ ${coupon.min_order_value}` });
      }
      const discount = coupon.discount_type === 'percentage'
        ? (orderValue * coupon.discount_value / 100)
        : coupon.discount_value;
      res.json({ valid: true, coupon, discount: Math.min(discount, orderValue) });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ─── Catalog Products CRUD (completo) ────────────────────────────────────────

  // GET /api/admin/catalog/products — lista todos os produtos com variantes
  app.get('/api/admin/catalog/products', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const mysql2 = await import('mysql2/promise');
      const pool = mysql2.createPool(process.env.DATABASE_URL || '');
      const [products] = await pool.execute(
        `SELECT * FROM catalog_products ORDER BY created_at DESC`
      ) as any[];
      const [variants] = await pool.execute(
        `SELECT * FROM catalog_variants ORDER BY product_id, id`
      ) as any[];
      await pool.end();
      const result = products.map((p: any) => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : [],
        tags: p.tags ? JSON.parse(p.tags) : [],
        variants: variants.filter((v: any) => v.product_id === p.id),
      }));
      res.json({ products: result });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // GET /api/admin/catalog/products/:id — detalhe de um produto
  app.get('/api/admin/catalog/products/:id', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const mysql2 = await import('mysql2/promise');
      const pool = mysql2.createPool(process.env.DATABASE_URL || '');
      const [products] = await pool.execute(
        `SELECT * FROM catalog_products WHERE id = ?`, [req.params.id]
      ) as any[];
      if (!products.length) { await pool.end(); return res.status(404).json({ error: 'Produto não encontrado' }); }
      const [variants] = await pool.execute(
        `SELECT * FROM catalog_variants WHERE product_id = ? ORDER BY id`, [req.params.id]
      ) as any[];
      await pool.end();
      const p = products[0];
      res.json({ ...p, images: p.images ? JSON.parse(p.images) : [], tags: p.tags ? JSON.parse(p.tags) : [], variants });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // POST /api/admin/catalog/products — cria produto
  app.post('/api/admin/catalog/products', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const mysql2 = await import('mysql2/promise');
      const pool = mysql2.createPool(process.env.DATABASE_URL || '');
      const b = req.body;
      const baseSlug = (b.slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
      const slug = baseSlug + '-' + Date.now();
      const [result] = await pool.execute(
        `INSERT INTO catalog_products (name, slug, category, description, short_description, price, compare_at_price, cost_price,
          is_active, is_featured, image_url, images, meta_title, meta_description, weight, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          b.name, slug, b.category || 'esportivo',
          b.description || null, b.shortDescription || null,
          b.price, b.compareAtPrice || null, b.costPrice || null,
          b.isActive !== false ? 1 : 0, b.isFeatured ? 1 : 0,
          b.imageUrl || null,
          b.images ? JSON.stringify(b.images) : null,
          b.metaTitle || null, b.metaDescription || null,
          b.weight || null,
          b.tags ? JSON.stringify(b.tags) : null,
        ]
      ) as any[];
      const productId = result.insertId;
      if (b.variants && b.variants.length > 0) {
        for (const v of b.variants) {
          const varSku = v.sku || `${baseSlug.substring(0,20)}-${Date.now()}-${Math.random().toString(36).substr(2,4)}`;
          await pool.execute(
            `INSERT INTO catalog_variants (product_id, sku, color_name, color_hex, image_url, stock, price, compare_at_price, supplier_code, barcode, weight, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [productId, varSku, v.colorName, v.colorHex || null, v.imageUrl || null,
             parseInt(v.stock) || 0, v.price || null, v.compareAtPrice || null,
             v.supplierCode || null, v.barcode || null, v.weight || null, v.isActive !== false ? 1 : 0]
          );
        }
      }
      await pool.end();
      res.json({ ok: true, productId });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // PUT /api/admin/catalog/products/:id — actualiza produto completo
  app.put('/api/admin/catalog/products/:id', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const mysql2 = await import('mysql2/promise');
      const pool = mysql2.createPool(process.env.DATABASE_URL || '');
      const id = parseInt(req.params.id);
      const b = req.body;
      const [existing] = await pool.execute(`SELECT slug FROM catalog_products WHERE id = ?`, [id]) as any[];
      const slug = existing[0]?.slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + id;
      await pool.execute(
        `UPDATE catalog_products SET name=?, slug=?, category=?, description=?, short_description=?,
          price=?, compare_at_price=?, cost_price=?, is_active=?, is_featured=?,
          image_url=?, images=?, meta_title=?, meta_description=?, weight=?, tags=?
         WHERE id=?`,
        [
          b.name, slug, b.category || 'esportivo',
          b.description || null, b.shortDescription || null,
          b.price, b.compareAtPrice || null, b.costPrice || null,
          b.isActive !== false ? 1 : 0, b.isFeatured ? 1 : 0,
          b.imageUrl || null,
          b.images ? JSON.stringify(b.images) : null,
          b.metaTitle || null, b.metaDescription || null,
          b.weight || null,
          b.tags ? JSON.stringify(b.tags) : null,
          id
        ]
      );
      if (b.variants !== undefined) {
        const newIds = b.variants.filter((v: any) => v.id).map((v: any) => v.id);
        if (newIds.length > 0) {
          await pool.execute(
            `DELETE FROM catalog_variants WHERE product_id = ? AND id NOT IN (${newIds.map(() => '?').join(',')})`,
            [id, ...newIds]
          );
        } else {
          await pool.execute(`DELETE FROM catalog_variants WHERE product_id = ?`, [id]);
        }
        for (const v of b.variants) {
          if (v.id) {
            await pool.execute(
              `UPDATE catalog_variants SET sku=?, color_name=?, color_hex=?, image_url=?, stock=?,
                price=?, compare_at_price=?, supplier_code=?, barcode=?, weight=?, is_active=?
               WHERE id=? AND product_id=?`,
              [v.sku, v.colorName, v.colorHex || null, v.imageUrl || null,
               parseInt(v.stock) || 0, v.price || null, v.compareAtPrice || null,
               v.supplierCode || null, v.barcode || null, v.weight || null,
               v.isActive !== false ? 1 : 0, v.id, id]
            );
          } else {
            const varSku = v.sku || `var-${id}-${Date.now()}-${Math.random().toString(36).substr(2,4)}`;
            await pool.execute(
              `INSERT INTO catalog_variants (product_id, sku, color_name, color_hex, image_url, stock, price, compare_at_price, supplier_code, barcode, weight, is_active)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [id, varSku, v.colorName, v.colorHex || null, v.imageUrl || null,
               parseInt(v.stock) || 0, v.price || null, v.compareAtPrice || null,
               v.supplierCode || null, v.barcode || null, v.weight || null, v.isActive !== false ? 1 : 0]
            );
          }
        }
      }
      await pool.end();
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // PATCH /api/admin/catalog/variants/:id/stock — actualiza apenas o estoque de uma variante
  app.patch('/api/admin/catalog/variants/:id/stock', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const mysql2 = await import('mysql2/promise');
      const pool = mysql2.createPool(process.env.DATABASE_URL || '');
      const { stock } = req.body;
      await pool.execute(`UPDATE catalog_variants SET stock = ? WHERE id = ?`, [parseInt(stock), req.params.id]);
      await pool.end();
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // POST /api/admin/catalog/upload-image — upload de imagem para S3
  app.post('/api/admin/catalog/upload-image', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { storagePut } = await import('./storage.js');
      const { imageData, mimeType } = req.body;
      if (!imageData) return res.status(400).json({ error: 'imageData obrigatório' });
      const buffer = Buffer.from(imageData.replace(/^data:[^;]+;base64,/, ''), 'base64');
      const ext = (mimeType || 'image/jpeg').split('/')[1] || 'jpg';
      const key = `products/${Date.now()}-${Math.random().toString(36).substr(2,8)}.${ext}`;
      const { url } = await storagePut(key, buffer, mimeType || 'image/jpeg');
      res.json({ ok: true, url });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // DELETE /api/admin/catalog/products/:id — remove produto
  app.delete('/api/admin/catalog/products/:id', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const mysql2 = await import('mysql2/promise');
      const pool = mysql2.createPool(process.env.DATABASE_URL || '');
      await pool.execute(`DELETE FROM catalog_products WHERE id = ?`, [req.params.id]);
      await pool.end();
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });


  // ─── Public Catalog API ────────────────────────────────────────────────────
  app.get('/api/catalog', async (_req, res) => {
    try {
      const mysql2 = await import('mysql2/promise');
      const pool = mysql2.createPool(process.env.DATABASE_URL || '');
      // Fetch products
      const [products] = await pool.execute(
        `SELECT id, name, slug, description, tagline, category, price, compare_at_price,
                image_url, images, features
         FROM catalog_products WHERE is_active = 1 ORDER BY name`
      ) as any[];
      // Fetch variants separately
      const [variants] = await pool.execute(
        `SELECT id, product_id, sku, color_name, color_hex, price, stock, image_url, is_active
         FROM catalog_variants WHERE is_active = 1`
      ) as any[];
      await pool.end();
      // Map DB categories to frontend categories
      const categoryMap: Record<string, string> = {
        'esportivo': 'performance',
        'casual_masculino': 'lifestyle',
        'casual_feminino': 'lifestyle',
        'casual': 'lifestyle',
        'limited': 'limited',
        'edicao_limitada': 'limited',
      };
      // VORTEXA is lifestyle not performance
      const forceLifestyle = ['zuno-vortexa'];
      const variantsByProduct: Record<number, any[]> = {};
      for (const v of variants as any[]) {
        if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
        variantsByProduct[v.product_id].push({
          ...v,
          color: v.color_hex,
          colorName: v.color_name,
        });
      }
      const mapped = (products as any[]).map((p: any) => {
        const parsedImages = (() => { try { return JSON.parse(p.images || '[]'); } catch { return []; } })();
        const productVariants = variantsByProduct[p.id] || [];
        const mainImage = parsedImages[0] || p.image_url || productVariants[0]?.image_url || '';
        return {
          ...p,
          id: p.slug, // use slug as id for stock compatibility
          dbId: p.id,
          category: forceLifestyle.includes(p.slug) ? 'lifestyle' : (categoryMap[p.category] || p.category),
          image: mainImage,
          images: parsedImages,
          features: (() => { try { return JSON.parse(p.features || '[]'); } catch { return []; } })(),
          variants: productVariants,
          tagline: p.tagline || '',
          price: parseFloat(p.price) || 0,
          compareAtPrice: p.compare_at_price ? parseFloat(p.compare_at_price) : null,
          cost: p.cost ? parseFloat(p.cost) : null,
        };
      });
      res.json(mapped);
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
