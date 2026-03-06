import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db/connection.js';
import { users, roles, userRoles, refreshTokens } from '../drizzle/schema.js';
import { eq, and, gt, isNull } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'zuno-jwt-secret-change-in-prod';
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_DAYS = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateAccessToken(payload: { userId: number; email: string; roles: string[] }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

async function getUserWithRoles(userId: number) {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user[0]) return null;

  const userRoleRows = await db
    .select({ roleName: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));

  return {
    ...user[0],
    roles: userRoleRows.map((r: { roleName: string }) => r.roleName),
  };
}

async function assignRole(userId: number, roleName: string) {
  const role = await db.select().from(roles).where(eq(roles.name, roleName as any)).limit(1);
  if (!role[0]) return;
  await db.insert(userRoles).ignore().values({ userId, roleId: role[0].id });
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (existing[0]) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await db.insert(users).values({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    const newUserId = (result as any).insertId;
    await assignRole(newUserId, 'customer');

    const userWithRoles = await getUserWithRoles(newUserId);
    const accessToken = generateAccessToken({
      userId: newUserId,
      email: email.toLowerCase(),
      roles: userWithRoles?.roles || ['customer'],
    });
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

    await db.insert(refreshTokens).values({
      userId: newUserId,
      token: refreshToken,
      expiresAt,
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || '',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });

    return res.status(201).json({
      accessToken,
      user: {
        id: newUserId,
        name: userWithRoles?.name,
        email: userWithRoles?.email,
        roles: userWithRoles?.roles || ['customer'],
      },
    });
  } catch (err: any) {
    console.error('[Auth] Register error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao criar conta.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (!user[0] || !user[0].passwordHash) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }
    if (!user[0].isActive) {
      return res.status(403).json({ error: 'Conta desativada. Entre em contato com o suporte.' });
    }

    const valid = await bcrypt.compare(password, user[0].passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const userWithRoles = await getUserWithRoles(user[0].id);
    const accessToken = generateAccessToken({
      userId: user[0].id,
      email: user[0].email,
      roles: userWithRoles?.roles || [],
    });
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

    await db.insert(refreshTokens).values({
      userId: user[0].id,
      token: refreshToken,
      expiresAt,
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || '',
    });

    // Update last login
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user[0].id));

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });

    return res.json({
      accessToken,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        avatarUrl: user[0].avatarUrl,
        roles: userWithRoles?.roles || [],
      },
    });
  } catch (err: any) {
    console.error('[Auth] Login error:', err.message);
    return res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
});

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) {
      return res.status(401).json({ error: 'Refresh token não encontrado.' });
    }

    const stored = await db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.token, token), isNull(refreshTokens.revokedAt), gt(refreshTokens.expiresAt, new Date())))
      .limit(1);

    if (!stored[0]) {
      return res.status(401).json({ error: 'Refresh token inválido ou expirado.' });
    }

    const userWithRoles = await getUserWithRoles(stored[0].userId);
    if (!userWithRoles || !userWithRoles.isActive) {
      return res.status(403).json({ error: 'Conta inativa.' });
    }

    const accessToken = generateAccessToken({
      userId: userWithRoles.id,
      email: userWithRoles.email,
      roles: userWithRoles.roles,
    });

    return res.json({
      accessToken,
      user: {
        id: userWithRoles.id,
        name: userWithRoles.name,
        email: userWithRoles.email,
        avatarUrl: userWithRoles.avatarUrl,
        roles: userWithRoles.roles,
      },
    });
  } catch (err: any) {
    console.error('[Auth] Refresh error:', err.message);
    return res.status(500).json({ error: 'Erro ao renovar sessão.' });
  }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refresh_token;
    if (token) {
      await db.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.token, token));
    }
    res.clearCookie('refresh_token', { path: '/api/auth' });
    return res.json({ success: true });
  } catch (err: any) {
    console.error('[Auth] Logout error:', err.message);
    return res.status(500).json({ error: 'Erro ao fazer logout.' });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUser.userId;
    const userWithRoles = await getUserWithRoles(userId);
    if (!userWithRoles) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    return res.json({
      user: {
        id: userWithRoles.id,
        name: userWithRoles.name,
        email: userWithRoles.email,
        phone: userWithRoles.phone,
        cpf: userWithRoles.cpf,
        avatarUrl: userWithRoles.avatarUrl,
        address: {
          zip: userWithRoles.addressZip,
          street: userWithRoles.addressStreet,
          number: userWithRoles.addressNumber,
          complement: userWithRoles.addressComplement,
          neighborhood: userWithRoles.addressNeighborhood,
          city: userWithRoles.addressCity,
          state: userWithRoles.addressState,
        },
        roles: userWithRoles.roles,
        createdAt: userWithRoles.createdAt,
        lastLoginAt: userWithRoles.lastLoginAt,
      },
    });
  } catch (err: any) {
    console.error('[Auth] Me error:', err.message);
    return res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'E-mail é obrigatório.' });

    const user = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    // Always return success to avoid user enumeration
    if (!user[0]) {
      return res.json({ success: true, message: 'Se o e-mail existir, você receberá as instruções.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.update(users).set({ resetToken, resetTokenExpiresAt: expiresAt }).where(eq(users.id, user[0].id));

    // TODO: Send email with reset link
    console.log(`[Auth] Password reset token for ${email}: ${resetToken}`);

    return res.json({ success: true, message: 'Se o e-mail existir, você receberá as instruções.' });
  } catch (err: any) {
    console.error('[Auth] Forgot password error:', err.message);
    return res.status(500).json({ error: 'Erro ao processar solicitação.' });
  }
});

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
    if (password.length < 6) return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });

    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.resetToken, token), gt(users.resetTokenExpiresAt!, new Date())))
      .limit(1);

    if (!user[0]) return res.status(400).json({ error: 'Token inválido ou expirado.' });

    const passwordHash = await bcrypt.hash(password, 12);
    await db.update(users).set({ passwordHash, resetToken: null, resetTokenExpiresAt: null }).where(eq(users.id, user[0].id));

    return res.json({ success: true, message: 'Senha redefinida com sucesso.' });
  } catch (err: any) {
    console.error('[Auth] Reset password error:', err.message);
    return res.status(500).json({ error: 'Erro ao redefinir senha.' });
  }
});

// ─── PUT /api/auth/profile ────────────────────────────────────────────────────
router.put('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUser.userId;
    const { name, phone, cpf, addressZip, addressStreet, addressNumber, addressComplement, addressNeighborhood, addressCity, addressState } = req.body;

    await db.update(users).set({
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(cpf !== undefined && { cpf }),
      ...(addressZip !== undefined && { addressZip }),
      ...(addressStreet !== undefined && { addressStreet }),
      ...(addressNumber !== undefined && { addressNumber }),
      ...(addressComplement !== undefined && { addressComplement }),
      ...(addressNeighborhood !== undefined && { addressNeighborhood }),
      ...(addressCity !== undefined && { addressCity }),
      ...(addressState !== undefined && { addressState }),
    }).where(eq(users.id, userId));

    const updated = await getUserWithRoles(userId);
    return res.json({ success: true, user: updated });
  } catch (err: any) {
    console.error('[Auth] Profile update error:', err.message);
    return res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  }
});

// ─── GET /api/auth/my-orders ─────────────────────────────────────────────────
router.get('/my-orders', requireAuth, async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser;
    const email = authUser.email;
    const mysql2 = await import('mysql2/promise');
    const pool = mysql2.createPool(process.env.DATABASE_URL || '');
    // Buscar pedidos do cliente pelo email
    const [orderRows] = await pool.execute<any[]>(
      `SELECT o.id, o.order_number, o.status, o.payment_status, o.total,
              o.shipping_cost, o.subtotal, o.tracking_code, o.created_at
       FROM orders o
       WHERE o.customer_email = ?
       ORDER BY o.created_at DESC
       LIMIT 50`,
      [email]
    );
    const orders = orderRows as any[];
    // Para cada pedido, buscar os itens
    const ordersWithItems = await Promise.all(
      orders.map(async (order: any) => {
        const [itemRows] = await pool.execute<any[]>(
          `SELECT product_name, variant_color_name, quantity, unit_price, image_url
           FROM order_items WHERE order_id = ?`,
          [order.id]
        );
        return {
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          paymentStatus: order.payment_status,
          total: parseFloat(order.total),
          shippingCost: parseFloat(order.shipping_cost || 0),
          subtotal: parseFloat(order.subtotal || 0),
          trackingCode: order.tracking_code,
          createdAt: order.created_at,
          items: (itemRows as any[]).map((item: any) => ({
            productName: item.product_name,
            variantColorName: item.variant_color_name,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unit_price),
            imageUrl: item.image_url,
          })),
        };
      })
    );
    await pool.end();
    return res.json({ orders: ordersWithItems });
  } catch (err: any) {
    console.error('[Auth] My orders error:', err.message);
    return res.status(500).json({ error: 'Erro ao buscar pedidos.' });
  }
});

// ─── Middleware: requireAuth ──────────────────────────────────────────────────
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).authUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

// ─── Middleware: requireRole ──────────────────────────────────────────────────
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authUser = (req as any).authUser;
    if (!authUser) return res.status(401).json({ error: 'Não autenticado.' });

    const userRolesList: string[] = authUser.roles || [];
    const hasRole = allowedRoles.some((r) => userRolesList.includes(r));
    if (!hasRole) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
}

export default router;
