import crypto from 'crypto';
import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL not configured');
    pool = mysql.createPool(dbUrl);
  }
  return pool;
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zuno@admin2025';
const SESSION_DURATION_HOURS = 24;

export async function adminLogin(password: string): Promise<string | null> {
  if (password !== ADMIN_PASSWORD) return null;

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

  const db = getPool();
  await db.execute(
    'INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)',
    [token, expiresAt]
  );

  return token;
}

export async function validateAdminToken(token: string): Promise<boolean> {
  if (!token) return false;
  const db = getPool();
  const [rows] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT id FROM admin_sessions WHERE token = ? AND expires_at > NOW()',
    [token]
  );
  return rows.length > 0;
}

export async function adminLogout(token: string): Promise<void> {
  const db = getPool();
  await db.execute('DELETE FROM admin_sessions WHERE token = ?', [token]);
}

export function extractAdminToken(req: any): string | null {
  // Check Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  // Check cookie
  const cookieHeader = req.headers['cookie'] || '';
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  if (match) return match[1];
  return null;
}
