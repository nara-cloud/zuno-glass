import {
  mysqlTable,
  varchar,
  int,
  decimal,
  timestamp,
  text,
  mysqlEnum,
  index,
  bigint,
  boolean,
} from 'drizzle-orm/mysql-core';

// ─── Users ─────────────────────────────────────────────────────────────────────
export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 200 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 200 }),
  phone: varchar('phone', { length: 30 }),
  cpf: varchar('cpf', { length: 20 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  // Address
  addressZip: varchar('address_zip', { length: 10 }),
  addressStreet: varchar('address_street', { length: 200 }),
  addressNumber: varchar('address_number', { length: 20 }),
  addressComplement: varchar('address_complement', { length: 100 }),
  addressNeighborhood: varchar('address_neighborhood', { length: 100 }),
  addressCity: varchar('address_city', { length: 100 }),
  addressState: varchar('address_state', { length: 2 }),
  // Status
  isActive: boolean('is_active').notNull().default(true),
  emailVerified: boolean('email_verified').notNull().default(false),
  // Password reset
  resetToken: varchar('reset_token', { length: 200 }),
  resetTokenExpiresAt: timestamp('reset_token_expires_at'),
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  lastLoginAt: timestamp('last_login_at'),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

// ─── Roles ─────────────────────────────────────────────────────────────────────
export const roles = mysqlTable('roles', {
  id: int('id').primaryKey().autoincrement(),
  name: mysqlEnum('name', ['admin', 'ops', 'creator_partner', 'customer', 'community_member']).notNull().unique(),
  description: varchar('description', { length: 200 }),
});

// ─── User Roles (many-to-many) ─────────────────────────────────────────────────
export const userRoles = mysqlTable('user_roles', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  roleId: int('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  assignedAt: timestamp('assigned_at').notNull().defaultNow(),
  assignedBy: bigint('assigned_by', { mode: 'number' }),
}, (table) => ({
  userRoleIdx: index('user_role_idx').on(table.userId, table.roleId),
}));

// ─── Refresh Tokens ────────────────────────────────────────────────────────────
export const refreshTokens = mysqlTable('refresh_tokens', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 500 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  revokedAt: timestamp('revoked_at'),
  userAgent: varchar('user_agent', { length: 500 }),
  ipAddress: varchar('ip_address', { length: 50 }),
}, (table) => ({
  tokenIdx: index('refresh_token_idx').on(table.token),
  userIdIdx: index('refresh_token_user_idx').on(table.userId),
}));

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = mysqlTable('orders', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  orderNumber: varchar('order_number', { length: 32 }).notNull().unique(),
  // Link to user account (optional — guest orders allowed)
  userId: bigint('user_id', { mode: 'number' }).references(() => users.id, { onDelete: 'set null' }),
  // Customer
  customerName: varchar('customer_name', { length: 120 }),
  customerEmail: varchar('customer_email', { length: 200 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 30 }),
  customerCpf: varchar('customer_cpf', { length: 20 }),
  // Shipping address
  shippingZip: varchar('shipping_zip', { length: 10 }),
  shippingStreet: varchar('shipping_street', { length: 200 }),
  shippingNumber: varchar('shipping_number', { length: 20 }),
  shippingNeighborhood: varchar('shipping_neighborhood', { length: 100 }),
  shippingCity: varchar('shipping_city', { length: 100 }),
  shippingState: varchar('shipping_state', { length: 2 }),
  // Financials
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).notNull().default('0.00'),
  discount: decimal('discount', { precision: 10, scale: 2 }).notNull().default('0.00'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  // Payment
  paymentMethod: mysqlEnum('payment_method', ['pix', 'boleto', 'card', 'stripe']).notNull().default('stripe'),
  paymentStatus: mysqlEnum('payment_status', ['pending', 'paid', 'failed', 'refunded']).notNull().default('pending'),
  paymentId: varchar('payment_id', { length: 200 }),
  paymentGateway: mysqlEnum('payment_gateway', ['stripe', 'mercadopago']).notNull().default('stripe'),
  // Order status
  status: mysqlEnum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).notNull().default('pending'),
  trackingCode: varchar('tracking_code', { length: 100 }),
  notes: text('notes'),
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.customerEmail),
  statusIdx: index('status_idx').on(table.status),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
  userIdIdx: index('orders_user_id_idx').on(table.userId),
}));

// ─── Order Items ───────────────────────────────────────────────────────────────
export const orderItems = mysqlTable('order_items', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  orderId: bigint('order_id', { mode: 'number' }).notNull().references(() => orders.id),
  productId: varchar('product_id', { length: 100 }).notNull(),
  productName: varchar('product_name', { length: 200 }).notNull(),
  variantColor: varchar('variant_color', { length: 100 }),
  variantColorName: varchar('variant_color_name', { length: 100 }),
  quantity: int('quantity').notNull().default(1),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
}, (table) => ({
  orderIdIdx: index('order_id_idx').on(table.orderId),
}));

// ─── Admin Sessions ────────────────────────────────────────────────────────────
export const adminSessions = mysqlTable('admin_sessions', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  token: varchar('token', { length: 200 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
});

// ─── Catalog Products ──────// ─── Catalog Products ──────────────────────────────────────────────
export const catalogProducts = mysqlTable('catalog_products', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  category: mysqlEnum('category', ['esportivo', 'casual_masculino', 'casual_feminino', 'edicao_limitada']).notNull().default('esportivo'),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 500 }),
  // Pricing
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
  // Status
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  // Images (JSON array of URLs)
  imageUrl: varchar('image_url', { length: 500 }),
  images: text('images'), // JSON array of image URLs
  // SEO
  metaTitle: varchar('meta_title', { length: 200 }),
  metaDescription: varchar('meta_description', { length: 500 }),
  // Physical attributes
  weight: decimal('weight', { precision: 8, scale: 3 }),
  // Tags
  tags: text('tags'), // JSON array of tags
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  slugIdx: index('catalog_products_slug_idx').on(table.slug),
  categoryIdx: index('catalog_products_category_idx').on(table.category),
}));

// ─── Catalog Variants ─────────────────────────────────────────────
export const catalogVariants = mysqlTable('catalog_variants', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  productId: bigint('product_id', { mode: 'number' }).notNull().references(() => catalogProducts.id, { onDelete: 'cascade' }),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  colorName: varchar('color_name', { length: 100 }).notNull(),
  colorHex: varchar('color_hex', { length: 20 }),
  imageUrl: varchar('image_url', { length: 500 }),
  stock: int('stock').notNull().default(0),
  price: decimal('price', { precision: 10, scale: 2 }),
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
  supplierCode: varchar('supplier_code', { length: 100 }),
  barcode: varchar('barcode', { length: 100 }),
  weight: decimal('weight', { precision: 8, scale: 3 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  productIdIdx: index('catalog_variants_product_idx').on(table.productId),
  skuIdx: index('catalog_variants_sku_idx').on(table.sku),
}));

// ─── Investments ───────────────────────────────────────────────────────────────
export const investments = mysqlTable('investments', {
  id: int('id').primaryKey().autoincrement(),
  description: varchar('description', { length: 500 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }).notNull().default('geral'),
  date: varchar('date', { length: 20 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Partners ───────────────────────────────────────────────────────────────────
export const partners = mysqlTable('partners', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 200 }),
  phone: varchar('phone', { length: 50 }),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).notNull().default('0.00'),
  totalSales: int('total_sales').notNull().default(0),
  totalCommission: decimal('total_commission', { precision: 12, scale: 2 }).notNull().default('0.00'),
  isActive: boolean('is_active').notNull().default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Coupons ────────────────────────────────────────────────────────────────────
export const coupons = mysqlTable('coupons', {
  id: int('id').primaryKey().autoincrement(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  discountType: varchar('discount_type', { length: 20 }).notNull().default('percentage'),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  minOrderValue: decimal('min_order_value', { precision: 10, scale: 2 }),
  maxUses: int('max_uses'),
  usedCount: int('used_count').notNull().default(0),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Affiliates ──────────────────────────────────────────────────────────────────
export const affiliates = mysqlTable('affiliates', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 200 }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).notNull().default('10.00'),
  totalSales: int('total_sales').notNull().default(0),
  totalEarnings: decimal('total_earnings', { precision: 12, scale: 2 }).notNull().default('0.00'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Auto-promote admin emails ─────────────────────────────────────────────────
export const adminEmails = mysqlTable('admin_emails', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 200 }).notNull().unique(),
  addedAt: timestamp('added_at').notNull().defaultNow(),
});

// ─── Types ─────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Role = typeof roles.$inferSelect;
export type UserRole = typeof userRoles.$inferSelect;
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type CatalogProduct = typeof catalogProducts.$inferSelect;
export type NewCatalogProduct = typeof catalogProducts.$inferInsert;
export type CatalogVariant = typeof catalogVariants.$inferSelect;
export type NewCatalogVariant = typeof catalogVariants.$inferInsert;
