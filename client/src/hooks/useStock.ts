import { useState, useEffect, useCallback } from 'react';

interface StockData {
  [productId: string]: {
    total: number;
    variants: Record<string, number>;
  };
}

interface UseStockReturn {
  stock: StockData;
  loading: boolean;
  error: string | null;
  getProductStock: (productId: string) => number;
  getVariantStock: (productId: string, colorName: string) => number;
  isInStock: (productId: string, colorName?: string) => boolean;
  refresh: () => Promise<void>;
}

let cachedStock: StockData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30_000; // 30 seconds client-side cache

export function useStock(): UseStockReturn {
  const [stock, setStock] = useState<StockData>(cachedStock || {});
  const [loading, setLoading] = useState(!cachedStock);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    const now = Date.now();
    if (cachedStock && (now - cacheTimestamp) < CACHE_TTL) {
      setStock(cachedStock);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/stock');
      if (!res.ok) throw new Error('Erro ao buscar estoque');
      const data = await res.json();
      cachedStock = data.stock;
      cacheTimestamp = Date.now();
      setStock(data.stock);
      setError(null);
    } catch (err: any) {
      console.error('[useStock] Error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const getProductStock = useCallback(
    (productId: string): number => {
      return stock[productId]?.total ?? -1; // -1 means unknown
    },
    [stock]
  );

  const getVariantStock = useCallback(
    (productId: string, colorName: string): number => {
      return stock[productId]?.variants?.[colorName] ?? -1;
    },
    [stock]
  );

  const isInStock = useCallback(
    (productId: string, colorName?: string): boolean => {
      if (colorName) {
        const qty = getVariantStock(productId, colorName);
        return qty === -1 || qty > 0; // if unknown, assume in stock
      }
      const total = getProductStock(productId);
      return total === -1 || total > 0;
    },
    [getProductStock, getVariantStock]
  );

  const refresh = useCallback(async () => {
    cachedStock = null;
    cacheTimestamp = 0;
    await fetchStock();
  }, [fetchStock]);

  return { stock, loading, error, getProductStock, getVariantStock, isInStock, refresh };
}
