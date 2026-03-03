import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../../drizzle/schema.js';

const dbUrl = process.env.DATABASE_URL || '';
const pool = mysql.createPool(dbUrl);
export const db = drizzle(pool, { schema, mode: 'default' });
