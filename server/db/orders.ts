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

export interface OrderRow {
  id: number;
  order_number: string;
  customer_name: string | null;
  customer_email: string;
  customer_phone: string | null;
  customer_cpf: string | null;
  shipping_zip: string | null;
  shipping_street: string | null;
  shipping_number: string | null;
  shipping_neighborhood: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  subtotal: string;
  shipping_cost: string;
  discount: string;
  total: string;
  payment_method: 'pix' | 'boleto' | 'card' | 'stripe';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_id: string | null;
  payment_gateway: 'stripe' | 'mercadopago';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_code: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItemRow {
  id: number;
  order_id: number;
  product_id: string;
  product_name: string;
  variant_color: string | null;
  variant_color_name: string | null;
  quantity: number;
  unit_price: string;
  total_price: string;
  image_url: string | null;
}

export interface CreateOrderInput {
  orderNumber: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  customerCpf?: string;
  shippingZip?: string;
  shippingStreet?: string;
  shippingNumber?: string;
  shippingNeighborhood?: string;
  shippingCity?: string;
  shippingState?: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: 'pix' | 'boleto' | 'card' | 'stripe';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  paymentGateway: 'stripe' | 'mercadopago';
  items: {
    productId: string;
    productName: string;
    variantColor?: string;
    variantColorName?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl?: string;
  }[];
}

export async function createOrder(input: CreateOrderInput): Promise<number> {
  const db = getPool();
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute<mysql.ResultSetHeader>(
      `INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone, customer_cpf,
        shipping_zip, shipping_street, shipping_number, shipping_neighborhood,
        shipping_city, shipping_state,
        subtotal, shipping_cost, discount, total,
        payment_method, payment_status, payment_id, payment_gateway, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        input.orderNumber,
        input.customerName || null,
        input.customerEmail,
        input.customerPhone || null,
        input.customerCpf || null,
        input.shippingZip || null,
        input.shippingStreet || null,
        input.shippingNumber || null,
        input.shippingNeighborhood || null,
        input.shippingCity || null,
        input.shippingState || null,
        input.subtotal.toFixed(2),
        input.shippingCost.toFixed(2),
        input.discount.toFixed(2),
        input.total.toFixed(2),
        input.paymentMethod,
        input.paymentStatus,
        input.paymentId || null,
        input.paymentGateway,
      ]
    );

    const orderId = result.insertId;

    for (const item of input.items) {
      await conn.execute(
        `INSERT INTO order_items (
          order_id, product_id, product_name, variant_color, variant_color_name,
          quantity, unit_price, total_price, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.productId,
          item.productName,
          item.variantColor || null,
          item.variantColorName || null,
          item.quantity,
          item.unitPrice.toFixed(2),
          item.totalPrice.toFixed(2),
          item.imageUrl || null,
        ]
      );
    }

    await conn.commit();
    return orderId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function getOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<{ orders: OrderRow[]; total: number }> {
  const db = getPool();
  const { page = 1, limit = 20, status, search, dateFrom, dateTo } = params;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const values: any[] = [];

  if (status && status !== 'all') {
    conditions.push('o.status = ?');
    values.push(status);
  }
  if (search) {
    conditions.push('(o.customer_email LIKE ? OR o.customer_name LIKE ? OR o.order_number LIKE ?)');
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (dateFrom) {
    conditions.push('o.created_at >= ?');
    values.push(dateFrom);
  }
  if (dateTo) {
    conditions.push('o.created_at <= ?');
    values.push(dateTo + ' 23:59:59');
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countRows] = await db.execute<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM orders o ${where}`,
    values
  );
  const total = (countRows[0] as any).total as number;

  const [rows] = await db.execute<mysql.RowDataPacket[]>(
    `SELECT o.* FROM orders o ${where} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return { orders: rows as OrderRow[], total };
}

export async function getOrderById(id: number): Promise<{ order: OrderRow; items: OrderItemRow[] } | null> {
  const db = getPool();
  const [orderRows] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT * FROM orders WHERE id = ?',
    [id]
  );
  if (!orderRows.length) return null;

  const [itemRows] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT * FROM order_items WHERE order_id = ? ORDER BY id',
    [id]
  );

  return {
    order: orderRows[0] as OrderRow,
    items: itemRows as OrderItemRow[],
  };
}

export async function getOrderByNumber(orderNumber: string): Promise<{ order: OrderRow; items: OrderItemRow[] } | null> {
  const db = getPool();
  const [orderRows] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT * FROM orders WHERE order_number = ?',
    [orderNumber]
  );
  if (!orderRows.length) return null;

  const [itemRows] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT * FROM order_items WHERE order_id = ? ORDER BY id',
    [orderRows[0].id]
  );

  return {
    order: orderRows[0] as OrderRow,
    items: itemRows as OrderItemRow[],
  };
}

export async function updateOrderStatus(
  id: number,
  status: OrderRow['status'],
  trackingCode?: string
): Promise<void> {
  const db = getPool();
  if (trackingCode !== undefined) {
    await db.execute(
      'UPDATE orders SET status = ?, tracking_code = ? WHERE id = ?',
      [status, trackingCode, id]
    );
  } else {
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  paymentStatus: OrderRow['payment_status'],
  orderStatus?: OrderRow['status']
): Promise<void> {
  const db = getPool();
  if (orderStatus) {
    await db.execute(
      'UPDATE orders SET payment_status = ?, status = ? WHERE payment_id = ?',
      [paymentStatus, orderStatus, paymentId]
    );
  } else {
    await db.execute(
      'UPDATE orders SET payment_status = ? WHERE payment_id = ?',
      [paymentStatus, paymentId]
    );
  }
}

export async function getAdminStats(): Promise<{
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
  recentOrders: OrderRow[];
  ordersByStatus: { status: string; count: number }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
}> {
  const db = getPool();

  const [[totals]] = await db.execute<mysql.RowDataPacket[]>(
    `SELECT 
      COUNT(*) as total_orders,
      COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END), 0) as total_revenue,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders
    FROM orders`
  );

  const [[today]] = await db.execute<mysql.RowDataPacket[]>(
    `SELECT 
      COUNT(*) as today_orders,
      COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END), 0) as today_revenue
    FROM orders
    WHERE DATE(created_at) = CURDATE()`
  );

  const [recentRows] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5'
  );

  const [statusRows] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
  );

  const [revenueRows] = await db.execute<mysql.RowDataPacket[]>(
    `SELECT 
      DATE(created_at) as date,
      COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END), 0) as revenue,
      COUNT(*) as orders
    FROM orders
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date ASC`
  );

  return {
    totalOrders: (totals as any).total_orders,
    totalRevenue: parseFloat((totals as any).total_revenue),
    pendingOrders: (totals as any).pending_orders,
    todayOrders: (today as any).today_orders,
    todayRevenue: parseFloat((today as any).today_revenue),
    recentOrders: recentRows as OrderRow[],
    ordersByStatus: (statusRows as any[]).map(r => ({ status: r.status, count: r.count })),
    revenueByDay: (revenueRows as any[]).map(r => ({
      date: r.date instanceof Date ? r.date.toISOString().split('T')[0] : String(r.date),
      revenue: parseFloat(r.revenue),
      orders: r.orders,
    })),
  };
}

export async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const prefix = `ZG${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const db = getPool();
  const [rows] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM orders WHERE order_number LIKE ?',
    [`${prefix}%`]
  );
  const count = ((rows[0] as any).count as number) + 1;
  return `${prefix}${String(count).padStart(4, '0')}`;
}
