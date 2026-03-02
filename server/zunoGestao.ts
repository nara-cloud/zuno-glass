/**
 * ZUNO Gestão API Integration Service
 * 
 * Handles communication with the ZUNO Gestão platform for:
 * - Fetching product stock levels
 * - Updating stock after sales
 * - Caching stock data to reduce API calls
 */

const ZUNO_GESTAO_API_URL = process.env.ZUNO_GESTAO_API_URL || 'https://zunogestao-gh3xjvgt.manus.space';
const ZUNO_GESTAO_API_KEY = process.env.ZUNO_GESTAO_API_KEY || '';

/** In-memory cache for stock data */
interface StockCache {
  data: Map<number, number>; // gestaoProductId → stock quantity
  lastFetched: number; // timestamp
}

const CACHE_TTL_MS = 60_000; // 1 minute cache
let stockCache: StockCache = {
  data: new Map(),
  lastFetched: 0,
};

/**
 * Raw product data from ZUNO Gestão API
 */
interface GestaoProduct {
  id: number;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  salePrice: number;
  category: string;
  supplierCode: string;
  collectionId: number;
  imageUrl: string;
}

/**
 * Fetch all products from ZUNO Gestão API
 */
export async function fetchGestaoProducts(): Promise<GestaoProduct[]> {
  if (!ZUNO_GESTAO_API_KEY) {
    console.warn('[ZunoGestao] API key not configured');
    return [];
  }

  try {
    const response = await fetch(`${ZUNO_GESTAO_API_URL}/api/trpc/products.list`, {
      method: 'GET',
      headers: {
        'X-API-Key': ZUNO_GESTAO_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`[ZunoGestao] API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data?.result?.data?.json || [];
  } catch (error: any) {
    console.error(`[ZunoGestao] Failed to fetch products: ${error.message}`);
    return [];
  }
}

/**
 * Get stock map from ZUNO Gestão (with caching)
 * Returns a Map of gestaoProductId → stock quantity
 */
export async function getStockMap(forceRefresh = false): Promise<Map<number, number>> {
  const now = Date.now();

  if (!forceRefresh && stockCache.data.size > 0 && (now - stockCache.lastFetched) < CACHE_TTL_MS) {
    return stockCache.data;
  }

  const products = await fetchGestaoProducts();
  const newMap = new Map<number, number>();

  for (const product of products) {
    newMap.set(product.id, product.stock);
  }

  if (newMap.size > 0) {
    stockCache = { data: newMap, lastFetched: now };
  }

  return stockCache.data.size > 0 ? stockCache.data : newMap;
}

/**
 * Update stock for a specific product in ZUNO Gestão
 */
export async function updateGestaoStock(gestaoProductId: number, newStock: number): Promise<boolean> {
  if (!ZUNO_GESTAO_API_KEY) {
    console.warn('[ZunoGestao] API key not configured');
    return false;
  }

  try {
    const response = await fetch(`${ZUNO_GESTAO_API_URL}/api/trpc/products.update`, {
      method: 'POST',
      headers: {
        'X-API-Key': ZUNO_GESTAO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: { id: gestaoProductId, stock: newStock },
      }),
    });

    if (!response.ok) {
      console.error(`[ZunoGestao] Update stock error: ${response.status}`);
      return false;
    }

    const data = await response.json();
    const success = data?.result?.data?.json?.success === true;

    if (success) {
      // Update cache
      stockCache.data.set(gestaoProductId, newStock);
      console.log(`[ZunoGestao] Stock updated: product ${gestaoProductId} → ${newStock}`);
    }

    return success;
  } catch (error: any) {
    console.error(`[ZunoGestao] Failed to update stock: ${error.message}`);
    return false;
  }
}

/**
 * Decrement stock for a specific product in ZUNO Gestão after a sale.
 * Fetches current stock first, then decrements by the given quantity.
 */
export async function decrementGestaoStock(gestaoProductId: number, quantity: number = 1): Promise<boolean> {
  const stockMap = await getStockMap(true); // force refresh to get latest
  const currentStock = stockMap.get(gestaoProductId);

  if (currentStock === undefined) {
    console.error(`[ZunoGestao] Product ${gestaoProductId} not found in stock map`);
    return false;
  }

  const newStock = Math.max(0, currentStock - quantity);
  return updateGestaoStock(gestaoProductId, newStock);
}

/**
 * Invalidate the stock cache (force next call to fetch fresh data)
 */
export function invalidateStockCache(): void {
  stockCache.lastFetched = 0;
}
