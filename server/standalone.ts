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
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const STOCK_FILE = path.join(DATA_DIR, "stock.json");

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

// // ─── Catalog & Stock (persistent) ────────────────────────────────────────────
let _catalogCache: any[] | null = null;
let _stockCache: any | null = null;

// Gera slug a partir do nome
function slugify(name: string): string {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Carrega produtos: primeiro do JSON persistente, depois do catálogo estático
async function getProducts(): Promise<any[]> {
  if (_catalogCache) return _catalogCache;
  // Se já existe products.json, usar ele
  if (fs.existsSync(PRODUCTS_FILE)) {
    const saved = readJSON(PRODUCTS_FILE, null);
    if (Array.isArray(saved) && saved.length > 0) {
      _catalogCache = saved;
      return _catalogCache;
    }
  }
  // Primeira vez: inicializar do catálogo estático
  try {
    const { catalog } = await import("../shared/catalog.js");
    _catalogCache = catalog as any[];
    writeJSON(PRODUCTS_FILE, _catalogCache);
  } catch { _catalogCache = []; }
  return _catalogCache!;
}

// Carrega estoque: do JSON persistente ou inicializa com 99
async function getStock(): Promise<any> {
  if (_stockCache) return _stockCache;
  if (fs.existsSync(STOCK_FILE)) {
    const saved = readJSON(STOCK_FILE, null);
    if (saved && typeof saved === 'object' && Object.keys(saved).length > 0) {
      _stockCache = saved;
      return _stockCache;
    }
  }
  // Inicializar estoque padrão
  const products = await getProducts();
  const stock: any = {};
  for (const p of products) {
    const variants: any = {};
    if (p.variants) {
      for (const v of p.variants) {
        variants[v.colorName || v.color] = 99;
      }
    }
    stock[p.id] = { total: 99, variants };
  }
  _stockCache = stock;
  writeJSON(STOCK_FILE, _stockCache);
  return _stockCache;
}

app.get("/api/catalog", async (_req, res) => {
  try {
    const products = await getProducts();
    res.setHeader('Cache-Control', 'no-cache');
    res.json(products);
  } catch (e: any) {
    console.error("[Catalog] Error:", e.message);
    res.json([]);
  }
});

app.get("/api/stock", async (_req, res) => {
  try {
    const stock = await getStock();
    res.setHeader('Cache-Control', 'no-cache');
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

// ─── Admin: Produtos CRUD ────────────────────────────────────────────────────
// Bulk replace all products at once
app.put("/api/admin/products/bulk", async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ error: 'Array de produtos esperado' });
    writeJSON(PRODUCTS_FILE, products);
    _catalogCache = products;
    // PRESERVAR estoque existente — apenas inicializar produtos novos
    const existingStock = fs.existsSync(STOCK_FILE) ? readJSON(STOCK_FILE, {}) : {};
    const stock: any = { ...existingStock };
    for (const p of products) {
      if (!stock[p.id]) {
        const variants: any = {};
        if (p.variants) { for (const v of p.variants) { variants[v.colorName || v.color || 'default'] = 99; } }
        stock[p.id] = { total: 99, variants };
      }
    }
    _stockCache = stock;
    writeJSON(STOCK_FILE, stock);
    res.json({ success: true, count: products.length });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});
app.get("/api/admin/products", async (_req, res) => {
  try { res.json(await getProducts()); } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/products", async (req, res) => {
  try {
    const products = await getProducts();
    const data = req.body;
    if (!data.name) return res.status(400).json({ error: 'Nome obrigatório' });
    const id = data.id || slugify(data.name);
    if (products.find((p: any) => p.id === id)) return res.status(409).json({ error: 'ID já existe. Use um nome diferente.' });
    const product = { id, ...data };
    products.push(product);
    writeJSON(PRODUCTS_FILE, products);
    _catalogCache = products;
    // Inicializar estoque para o novo produto
    const stock = await getStock();
    const variants: any = {};
    if (product.variants) { for (const v of product.variants) { variants[v.colorName || v.color] = 99; } }
    stock[id] = { total: 99, variants };
    writeJSON(STOCK_FILE, stock);
    res.status(201).json(product);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/products/:id", async (req, res) => {
  try {
    const products = await getProducts();
    const idx = products.findIndex((p: any) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Produto não encontrado' });
    products[idx] = { ...products[idx], ...req.body, id: req.params.id };
    writeJSON(PRODUCTS_FILE, products);
    _catalogCache = products;
    // Atualizar variantes no estoque se mudaram
    const stock = await getStock();
    const p = products[idx];
    if (p.variants && stock[p.id]) {
      const existing = stock[p.id].variants || {};
      const updated: any = {};
      for (const v of p.variants) {
        const key = v.colorName || v.color;
        updated[key] = existing[key] ?? 99;
      }
      stock[p.id].variants = updated;
      stock[p.id].total = Object.values(updated).reduce((a: any, b: any) => a + b, 0);
      writeJSON(STOCK_FILE, stock);
    }
    res.json(products[idx]);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/products/:id", async (req, res) => {
  try {
    let products = await getProducts();
    const idx = products.findIndex((p: any) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Produto não encontrado' });
    products.splice(idx, 1);
    writeJSON(PRODUCTS_FILE, products);
    _catalogCache = products;
    // Remover do estoque
    const stock = await getStock();
    delete stock[req.params.id];
    writeJSON(STOCK_FILE, stock);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ─── Admin: Estoque ───────────────────────────────────────────────────────────
app.get("/api/admin/stock", async (_req, res) => {
  try { res.json(await getStock()); } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/stock/:productId", async (req, res) => {
  try {
    const stock = await getStock();
    const { variants } = req.body; // { 'Preto Fosco': 10, 'Azul': 5 }
    if (!stock[req.params.productId]) stock[req.params.productId] = { total: 0, variants: {} };
    stock[req.params.productId].variants = variants;
    stock[req.params.productId].total = Object.values(variants as any).reduce((a: any, b: any) => a + Number(b), 0);
    writeJSON(STOCK_FILE, stock);
    _stockCache = stock;
    res.json(stock[req.params.productId]);
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

// ─── Admin panel auth endpoints ─────────────────────────────────────────────
const ADMIN_PANEL_PASSWORD = process.env.ADMIN_PASSWORD || 'zuno2025';

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PANEL_PASSWORD) return res.status(401).json({ error: 'Senha incorreta.' });
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, success: true });
});

app.get('/api/admin/me', (req: any, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== 'admin') return res.status(403).json({ error: 'Acesso negado.' });
    res.json({ role: 'admin', name: 'Admin ZUNO' });
  } catch { return res.status(401).json({ error: 'Token inválido.' }); }
});

app.post('/api/admin/logout', (_req, res) => res.json({ success: true }));

// ─── Gestão endpoints (JSON file-based) ───────────────────────────────────────
const INVESTMENTS_FILE = path.join(DATA_DIR, 'investments.json');
const AFFILIATES_FILE = path.join(DATA_DIR, 'affiliates.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const FINANCIAL_FILE = path.join(DATA_DIR, 'financial.json');
const SALES_FILE = path.join(DATA_DIR, 'sales.json');
const SCENARIOS_FILE = path.join(DATA_DIR, 'scenarios.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Investments
app.get('/api/admin/gestao/investments', requireAuth, (_req, res) => {
  res.json(readJSON(INVESTMENTS_FILE, []));
});
app.post('/api/admin/gestao/investments', requireAuth, (req, res) => {
  const items = readJSON(INVESTMENTS_FILE, []);
  const item = { id: Date.now(), created_at: new Date().toISOString(), ...req.body };
  items.push(item);
  writeJSON(INVESTMENTS_FILE, items);
  res.json(item);
});
app.delete('/api/admin/gestao/investments/:id', requireAuth, (req, res) => {
  const items = readJSON(INVESTMENTS_FILE, []);
  const filtered = items.filter((i: any) => String(i.id) !== req.params.id);
  writeJSON(INVESTMENTS_FILE, filtered);
  res.json({ success: true });
});

// Affiliates
app.get('/api/admin/gestao/affiliates', requireAuth, (_req, res) => {
  res.json(readJSON(AFFILIATES_FILE, []));
});
app.post('/api/admin/gestao/affiliates', requireAuth, (req, res) => {
  const items = readJSON(AFFILIATES_FILE, []);
  const item = { id: Date.now(), created_at: new Date().toISOString(), active: true, sales: 0, commission: 0, ...req.body };
  items.push(item);
  writeJSON(AFFILIATES_FILE, items);
  res.json(item);
});
app.put('/api/admin/gestao/affiliates/:id', requireAuth, (req, res) => {
  const items = readJSON(AFFILIATES_FILE, []);
  const idx = items.findIndex((i: any) => String(i.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items[idx] = { ...items[idx], ...req.body };
  writeJSON(AFFILIATES_FILE, items);
  res.json(items[idx]);
});
app.delete('/api/admin/gestao/affiliates/:id', requireAuth, (req, res) => {
  const items = readJSON(AFFILIATES_FILE, []);
  writeJSON(AFFILIATES_FILE, items.filter((i: any) => String(i.id) !== req.params.id));
  res.json({ success: true });
});

// Payments
app.get('/api/admin/gestao/payments', requireAuth, (_req, res) => {
  // Derive from orders
  const orders = readJSON(ORDERS_FILE, []);
  const payments = orders.map((o: any) => ({
    id: o.id,
    date: o.createdAt,
    amount: o.items?.reduce((s: number, i: any) => s + (i.price || 0) * (i.quantity || 1), 0) + (o.shippingCost || 0),
    method: o.paymentMethod || 'credit_card',
    status: o.status,
    customer: o.customerName || o.customer?.name || 'Cliente',
    orderId: o.id,
  }));
  res.json(payments);
});

// Financial
app.get('/api/admin/gestao/financial', requireAuth, (_req, res) => {
  res.json(readJSON(FINANCIAL_FILE, { revenue: 0, expenses: 0, profit: 0, records: [] }));
});

// Sales (aggregate from orders)
app.get('/api/admin/gestao/sales', requireAuth, (_req, res) => {
  const orders = readJSON(ORDERS_FILE, []);
  const approved = orders.filter((o: any) => o.status === 'approved' || o.status === 'paid');
  const total = approved.reduce((s: number, o: any) => {
    return s + (o.items?.reduce((ss: number, i: any) => ss + (i.price || 0) * (i.quantity || 1), 0) || 0) + (o.shippingCost || 0);
  }, 0);
  res.json({ total, count: approved.length, orders: approved });
});

// Scenarios
app.get('/api/admin/gestao/scenarios', requireAuth, (_req, res) => {
  res.json(readJSON(SCENARIOS_FILE, []));
});
app.post('/api/admin/gestao/scenarios', requireAuth, (req, res) => {
  const items = readJSON(SCENARIOS_FILE, []);
  const item = { id: Date.now(), created_at: new Date().toISOString(), ...req.body };
  items.push(item);
  writeJSON(SCENARIOS_FILE, items);
  res.json(item);
});

// Settings
app.get('/api/admin/settings', requireAuth, (_req, res) => {
  res.json(readJSON(SETTINGS_FILE, { storeName: 'ZUNO GLASS', adminPassword: 'zuno2025', freeShippingThreshold: 299, shippingCost: 19.90 }));
});
app.put('/api/admin/settings', requireAuth, (req, res) => {
  const current = readJSON(SETTINGS_FILE, {});
  const updated = { ...current, ...req.body };
  writeJSON(SETTINGS_FILE, updated);
  // Update admin password if changed
  if (req.body.adminPassword) {
    process.env.ADMIN_PASSWORD = req.body.adminPassword;
  }
  res.json(updated);
});

// Partners
app.get('/api/admin/gestao/partners', requireAuth, (_req, res) => {
  res.json(readJSON(path.join(DATA_DIR, 'partners.json'), []));
});
app.post('/api/admin/gestao/partners', requireAuth, (req, res) => {
  const items = readJSON(path.join(DATA_DIR, 'partners.json'), []);
  const item = { id: Date.now(), created_at: new Date().toISOString(), ...req.body };
  items.push(item);
  writeJSON(path.join(DATA_DIR, 'partners.json'), items);
  res.json(item);
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
