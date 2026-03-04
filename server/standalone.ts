import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "zuno-glass-secret-2025";
const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || "APP_USR-7342182629407170-030307-d26fb83cc501bea0f26eb7bd84dfded2-253817435";
const MP_PUBLIC_KEY = process.env.MERCADO_PAGO_PUBLIC_KEY || "APP_USR-f4856d8d-0b95-4520-bdc3-b6a12f5ed7ff";

// ─── Data files ───────────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, "../data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");

function readJSON(file: string, def: any = []) {
  try { return JSON.parse(fs.readFileSync(file, "utf-8")); } catch { return def; }
}
function writeJSON(file: string, data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ─── In-memory users ─────────────────────────────────────────────────────────
const users: any[] = [];
(async () => {
  const hash = await bcrypt.hash("admin123", 10);
  users.push({ id: 1, email: "admin@zunoglass.com", passwordHash: hash, name: "Admin ZUNO", roles: ["admin", "ops"], isActive: true });
})();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ─── Auth middleware ──────────────────────────────────────────────────────────
function requireAuth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token não fornecido." });
  try {
    req.authUser = jwt.verify(token, JWT_SECRET);
    next();
  } catch { return res.status(401).json({ error: "Token inválido." }); }
}

// ─── Auth routes ──────────────────────────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
    if (users.find(u => u.email === email.toLowerCase())) return res.status(409).json({ error: "E-mail já cadastrado." });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, email: email.toLowerCase(), passwordHash, name, roles: ["customer"], isActive: true };
    users.push(user);
    const accessToken = jwt.sign({ userId: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ accessToken, user: { id: user.id, name: user.name, email: user.email, roles: user.roles } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email?.toLowerCase());
    if (!user) return res.status(401).json({ error: "E-mail ou senha incorretos." });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "E-mail ou senha incorretos." });
    const accessToken = jwt.sign({ userId: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, roles: user.roles } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/auth/logout", (_req, res) => res.json({ success: true }));
app.post("/api/auth/refresh", (_req, res) => res.status(401).json({ error: "Not supported" }));
app.post("/api/auth/forgot-password", (_req, res) => res.json({ success: true, message: "Se o e-mail existir, você receberá as instruções." }));

app.get("/api/auth/me", requireAuth, (req: any, res) => {
  const user = users.find(u => u.id === req.authUser.userId);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
  res.json({ user: { id: user.id, name: user.name, email: user.email, roles: user.roles, address: {} } });
});

app.put("/api/auth/profile", requireAuth, (req: any, res) => {
  const user = users.find(u => u.id === req.authUser.userId);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
  Object.assign(user, req.body);
  res.json({ success: true, user });
});

// ─── Catalog ──────────────────────────────────────────────────────────────────
app.get("/api/catalog", async (_req, res) => {
  try {
    const { catalog } = await import("../shared/catalog.js");
    res.json(catalog);
  } catch (e: any) {
    console.error("[Catalog] Error:", e.message);
    res.json([]);
  }
});

// ─── Stock ──────────────────────────────────────────────────────────────────
app.get("/api/stock", async (_req, res) => {
  try {
    const { catalog } = await import("../shared/catalog.js");
    const stock: any = {};
    for (const p of (catalog as any[])) {
      const variants: any = {};
      if (p.variants) {
        for (const v of p.variants) {
          variants[v.colorName || v.color] = 99;
        }
      }
      stock[p.id] = { total: 99, variants };
    }
    res.json({ stock });
  } catch (e: any) { res.json({ stock: {} }); }
});

// ─── Mercado Pago Public Key ──────────────────────────────────────────────────
app.get("/api/mercadopago/public-key", (_req, res) => {
  res.json({ publicKey: MP_PUBLIC_KEY });
});

// ─── Shipping ─────────────────────────────────────────────────────────────────
app.get("/api/shipping", async (req, res) => {
  try {
    const { calculateShipping, isValidCep } = await import("../shared/shipping.js");
    const cep = String(req.query.cep || "").replace(/\D/g, "");
    if (!isValidCep(cep)) return res.status(400).json({ error: "CEP inválido" });
    const options = calculateShipping(cep);
    res.json(options);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ─── Waitlist ─────────────────────────────────────────────────────────────────
app.post("/api/waitlist", (req, res) => {
  try {
    const { email, name, source } = req.body;
    if (!email) return res.status(400).json({ error: "E-mail é obrigatório." });
    const list = readJSON(WAITLIST_FILE);
    if (!list.find((e: any) => e.email === email)) {
      list.push({ email, name, source, createdAt: new Date().toISOString() });
      writeJSON(WAITLIST_FILE, list);
    }
    res.json({ success: true, message: "Você entrou para o squad!" });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ─── Checkout principal (CartDrawer) ──────────────────────────────────────────────────
app.post("/api/checkout", async (req, res) => {
  try {
    const { items, shippingCost } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: "Carrinho vazio" });
    const { catalog } = await import("../shared/catalog.js");
    const { MercadoPagoConfig, Preference } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const preference = new Preference(client);
    const mpItems: any[] = items.map((item: any) => {
      const product = (catalog as any[]).find((p: any) => p.id === item.productId);
      const price = product ? Number(product.price) : 189.90;
      return {
        id: item.productId,
        title: product?.name || item.productId,
        quantity: Number(item.quantity) || 1,
        unit_price: price,
        currency_id: "BRL",
      };
    });
    if (shippingCost && Number(shippingCost) > 0) {
      mpItems.push({ id: "frete", title: "Frete", quantity: 1, unit_price: Number(shippingCost), currency_id: "BRL" });
    }
    const origin = (req.headers.origin as string) || "http://localhost:3000";
    const extRef = `order-${Date.now()}`;
    const result = await preference.create({
      body: {
        items: mpItems,
        back_urls: {
          success: `${origin}/checkout/success`,
          failure: `${origin}/products`,
          pending: `${origin}/products`,
        },
        auto_approve: false,
        external_reference: extRef,
        payment_methods: { installments: 3 },
      },
    });
    const orders = readJSON(ORDERS_FILE);
    orders.push({ id: extRef, items, shippingCost: shippingCost || 0, status: "pending", preferenceId: result.id, createdAt: new Date().toISOString() });
    writeJSON(ORDERS_FILE, orders);
    res.json({ url: result.init_point, preferenceId: result.id });
  } catch (e: any) {
    console.error("[Checkout] Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// ─── Checkout / Mercado Pago (advanced) ──────────────────────────────────────────────────
app.post("/api/checkout/preference", async (req, res) => {
  try {
    const { items, payer, backUrls, externalReference } = req.body;
    const { MercadoPagoConfig, Preference } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: "BRL",
        })),
        payer: payer || {},
        back_urls: backUrls || {
          success: `${req.headers.origin || "http://localhost:3000"}/checkout/success`,
          failure: `${req.headers.origin || "http://localhost:3000"}/checkout`,
          pending: `${req.headers.origin || "http://localhost:3000"}/checkout`,
        },
        auto_approve: false,
        external_reference: externalReference || `order-${Date.now()}`,
        payment_methods: { installments: 3 },
      },
    });
    res.json({ preferenceId: result.id, initPoint: result.init_point, sandboxInitPoint: result.sandbox_init_point });
  } catch (e: any) {
    console.error("[MP Preference] Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/checkout/pix", async (req, res) => {
  try {
    const { items, payer, externalReference } = req.body;
    const { MercadoPagoConfig, Payment } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const totalAmount = items.reduce((sum: number, i: any) => sum + i.unit_price * i.quantity, 0);
    const result = await payment.create({
      body: {
        transaction_amount: Math.round(totalAmount * 100) / 100,
        description: items.map((i: any) => i.title).join(", "),
        payment_method_id: "pix",
        payer: { email: payer?.email || "cliente@zunoglass.com", first_name: payer?.first_name, last_name: payer?.last_name },
        external_reference: externalReference || `pix-${Date.now()}`,
      },
    });
    // Save order
    const orders = readJSON(ORDERS_FILE);
    const order = {
      id: orders.length + 1,
      orderNumber: `ZG-${Date.now()}`,
      items,
      payer,
      total: totalAmount,
      paymentMethod: "pix",
      paymentId: result.id,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    writeJSON(ORDERS_FILE, orders);
    res.json({
      paymentId: result.id,
      status: result.status,
      pixQrCode: result.point_of_interaction?.transaction_data?.qr_code,
      pixQrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
      orderNumber: order.orderNumber,
    });
  } catch (e: any) {
    console.error("[MP PIX] Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/checkout/card", async (req, res) => {
  try {
    const { items, payer, token, installments, paymentMethodId, externalReference } = req.body;
    const { MercadoPagoConfig, Payment } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const totalAmount = items.reduce((sum: number, i: any) => sum + i.unit_price * i.quantity, 0);
    const result = await payment.create({
      body: {
        transaction_amount: Math.round(totalAmount * 100) / 100,
        token,
        description: items.map((i: any) => i.title).join(", "),
        installments: installments || 1,
        payment_method_id: paymentMethodId,
        payer: { email: payer?.email, identification: { type: "CPF", number: payer?.cpf || "" } },
        external_reference: externalReference || `card-${Date.now()}`,
      },
    });
    // Save order
    const orders = readJSON(ORDERS_FILE);
    const order = {
      id: orders.length + 1,
      orderNumber: `ZG-${Date.now()}`,
      items,
      payer,
      total: totalAmount,
      paymentMethod: "card",
      paymentId: result.id,
      status: result.status,
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    writeJSON(ORDERS_FILE, orders);
    res.json({ paymentId: result.id, status: result.status, statusDetail: result.status_detail, orderNumber: order.orderNumber });
  } catch (e: any) {
    console.error("[MP Card] Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/payment/:id/status", async (req, res) => {
  try {
    const { MercadoPagoConfig, Payment } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const result = await payment.get({ id: req.params.id });
    res.json({ status: result.status, statusDetail: result.status_detail });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ─── Admin routes ─────────────────────────────────────────────────────────────
app.get("/api/admin/orders", requireAuth, (_req, res) => {
  res.json(readJSON(ORDERS_FILE));
});

app.get("/api/admin/waitlist", requireAuth, (_req, res) => {
  res.json(readJSON(WAITLIST_FILE));
});

app.get("/api/admin/stats", requireAuth, (_req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const waitlist = readJSON(WAITLIST_FILE);
  const totalRevenue = orders.filter((o: any) => o.status === "paid").reduce((s: number, o: any) => s + (o.total || 0), 0);
  res.json({ totalOrders: orders.length, totalRevenue, waitlistCount: waitlist.length, pendingOrders: orders.filter((o: any) => o.status === "pending").length });
});

// ─── Webhook ──────────────────────────────────────────────────────────────────
app.post("/api/webhooks/mercadopago", async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type === "payment" && data?.id) {
      const { MercadoPagoConfig, Payment } = await import("mercadopago");
      const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
      const payment = new Payment(client);
      const result = await payment.get({ id: data.id });
      if (result.status === "approved") {
        const orders = readJSON(ORDERS_FILE);
        const order = orders.find((o: any) => o.paymentId === data.id);
        if (order) { order.status = "paid"; writeJSON(ORDERS_FILE, orders); }
      }
    }
    res.sendStatus(200);
  } catch (e: any) { console.error("[Webhook] Error:", e.message); res.sendStatus(200); }
});

// ─── Static files ─────────────────────────────────────────────────────────────
const distPath = path.join(__dirname, "../dist/public");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "3001");
const httpServer = createServer(app);
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}/`);
  console.log(`Mercado Pago configured with Public Key: ${MP_PUBLIC_KEY.substring(0, 20)}...`);
});

export default app;
