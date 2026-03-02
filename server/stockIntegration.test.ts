import { describe, it, expect } from 'vitest';
import { 
  stockMapping, 
  findGestaoProduct, 
  findGestaoProductsByEcommerceId, 
  getTotalProductStock, 
  getVariantStock 
} from '../shared/stockMapping';
import { productCatalog } from '../shared/products';

describe('Stock Mapping', () => {
  it('should have 32 mapping entries (one per ZUNO Gestão product)', () => {
    expect(stockMapping.length).toBe(32);
  });

  it('should map all e-commerce products', () => {
    const mappedProductIds = new Set(stockMapping.map(m => m.ecommerceProductId));
    for (const product of productCatalog) {
      expect(mappedProductIds.has(product.id)).toBe(true);
    }
  });

  it('should have unique gestaoProductId for each entry', () => {
    const gestaoIds = stockMapping.map(m => m.gestaoProductId);
    const uniqueIds = new Set(gestaoIds);
    expect(uniqueIds.size).toBe(gestaoIds.length);
  });

  it('should have unique gestaoSku for each entry', () => {
    const skus = stockMapping.map(m => m.gestaoSku);
    const uniqueSkus = new Set(skus);
    expect(uniqueSkus.size).toBe(skus.length);
  });

  it('all gestaoProductIds should be in the 60000 range', () => {
    for (const entry of stockMapping) {
      expect(entry.gestaoProductId).toBeGreaterThanOrEqual(60001);
      expect(entry.gestaoProductId).toBeLessThanOrEqual(60032);
    }
  });

  it('all gestaoSkus should follow ZUNO-XXX-NNN pattern', () => {
    const skuPattern = /^ZUNO-(ESP|FEM|MASC)-\d{3}$/;
    for (const entry of stockMapping) {
      expect(entry.gestaoSku).toMatch(skuPattern);
    }
  });
});

describe('findGestaoProduct', () => {
  it('should find ZUNO VEYRON - Preto Fosco', () => {
    const result = findGestaoProduct('zuno-veyron', 'Preto Fosco');
    expect(result).toBeDefined();
    expect(result?.gestaoProductId).toBe(60007);
    expect(result?.gestaoSku).toBe('ZUNO-ESP-007');
  });

  it('should find ZUNO INFINITY X - Preto Dourado', () => {
    const result = findGestaoProduct('zuno-infinity-x', 'Preto Dourado');
    expect(result).toBeDefined();
    expect(result?.gestaoProductId).toBe(60027);
  });

  it('should return undefined for non-existent product', () => {
    const result = findGestaoProduct('non-existent', 'Preto');
    expect(result).toBeUndefined();
  });

  it('should return undefined for non-existent color', () => {
    const result = findGestaoProduct('zuno-veyron', 'Roxo Inexistente');
    expect(result).toBeUndefined();
  });
});

describe('findGestaoProductsByEcommerceId', () => {
  it('should find 4 variants for ZUNO VEYRON', () => {
    const results = findGestaoProductsByEcommerceId('zuno-veyron');
    expect(results.length).toBe(4);
  });

  it('should find 3 variants for ZUNO INFINITY X', () => {
    const results = findGestaoProductsByEcommerceId('zuno-infinity-x');
    expect(results.length).toBe(3);
  });

  it('should find 1 variant for ZUNO VORTEXA', () => {
    const results = findGestaoProductsByEcommerceId('zuno-vortexa');
    expect(results.length).toBe(1);
  });

  it('should return empty array for non-existent product', () => {
    const results = findGestaoProductsByEcommerceId('non-existent');
    expect(results.length).toBe(0);
  });
});

describe('Stock calculation helpers', () => {
  const mockStockMap = new Map<number, number>([
    [60007, 8],  // VEYRON Preto Fosco
    [60004, 4],  // VEYRON Azul
    [60006, 4],  // VEYRON Verde
    [60005, 4],  // VEYRON Amarelo
    [60001, 0],  // STRIX Preto Fosco (out of stock)
    [60002, 4],  // STRIX Azul
    [60003, 5],  // STRIX Marrom Verde
  ]);

  it('getTotalProductStock should sum all variants', () => {
    const total = getTotalProductStock('zuno-veyron', mockStockMap);
    expect(total).toBe(20); // 8 + 4 + 4 + 4
  });

  it('getTotalProductStock should handle partial stock data', () => {
    const total = getTotalProductStock('zuno-strix', mockStockMap);
    expect(total).toBe(9); // 0 + 4 + 5
  });

  it('getTotalProductStock should return 0 for unmapped product', () => {
    const total = getTotalProductStock('non-existent', mockStockMap);
    expect(total).toBe(0);
  });

  it('getVariantStock should return correct stock for specific variant', () => {
    const stock = getVariantStock('zuno-veyron', 'Preto Fosco', mockStockMap);
    expect(stock).toBe(8);
  });

  it('getVariantStock should return 0 for out-of-stock variant', () => {
    const stock = getVariantStock('zuno-strix', 'Preto Fosco', mockStockMap);
    expect(stock).toBe(0);
  });

  it('getVariantStock should return 0 for unmapped variant', () => {
    const stock = getVariantStock('zuno-veyron', 'Cor Inexistente', mockStockMap);
    expect(stock).toBe(0);
  });

  it('getVariantStock should return 0 for unmapped product', () => {
    const stock = getVariantStock('non-existent', 'Preto', mockStockMap);
    expect(stock).toBe(0);
  });
});

describe('Mapping consistency with product catalog', () => {
  it('every e-commerce product should have at least one mapping entry', () => {
    for (const product of productCatalog) {
      const entries = findGestaoProductsByEcommerceId(product.id);
      expect(entries.length).toBeGreaterThan(0);
    }
  });

  it('all mapped product IDs should exist in the catalog', () => {
    const catalogIds = new Set(productCatalog.map(p => p.id));
    const mappedIds = new Set(stockMapping.map(m => m.ecommerceProductId));
    for (const id of Array.from(mappedIds)) {
      expect(catalogIds.has(id)).toBe(true);
    }
  });

  it('should cover all 21 e-commerce products', () => {
    const mappedProductIds = new Set(stockMapping.map(m => m.ecommerceProductId));
    expect(mappedProductIds.size).toBe(21);
  });
});
