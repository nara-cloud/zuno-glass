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
} from 'drizzle-orm/mysql-core';

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = mysqlTable('orders', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  orderNumber: varchar('order_number', { length: 32 }).notNull().unique(),

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
  paymentId: varchar('payment_id', { length: 200 }), // Stripe session ID or MP payment ID
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

// ─── Types ─────────────────────────────────────────────────────────────────────
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
