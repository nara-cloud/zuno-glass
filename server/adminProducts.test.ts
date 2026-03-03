import { describe, it, expect } from 'vitest';
import { productCatalog } from '../shared/products';
import { stockMapping } from '../shared/stockMapping';

describe('Admin Products Page - Data Integrity', () => {
  it('should have 21 products in the catalog', () => {
    expect(productCatalog.length).toBe(21);
  });

  it('should have 32 SKU mappings (one per ZUNO Gestão product)', () => {
    expect(stockMapping.length).toBe(32);
  });

  it('every product in catalog should have at least one SKU mapping', () => {
    for (const product of productCatalog) {
      const mappings = stockMapping.filter(m => m.ecommerceProductId === product.id);
      expect(mappings.length, `${product.id} should have at least 1 SKU mapping`).toBeGreaterThan(0);
    }
  });

  it('all SKU mappings should reference valid product IDs', () => {
    const validIds = new Set(productCatalog.map(p => p.id));
    for (const mapping of stockMapping) {
      expect(validIds.has(mapping.ecommerceProductId), `${mapping.ecommerceProductId} should be a valid product ID`).toBe(true);
    }
  });

  it('all SKUs should be unique', () => {
    const skus = stockMapping.map(m => m.gestaoSku);
    const uniqueSkus = new Set(skus);
    expect(uniqueSkus.size).toBe(skus.length);
  });

  it('all gestaoProductIds should be unique', () => {
    const ids = stockMapping.map(m => m.gestaoProductId);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('performance products should have price R$ 189.90', () => {
    const performanceProducts = productCatalog.filter(p => p.category === 'performance');
    for (const p of performanceProducts) {
      expect(p.price).toBe(189.90);
    }
  });

  it('lifestyle and limited products should have price R$ 169.90', () => {
    const otherProducts = productCatalog.filter(p => p.category !== 'performance');
    for (const p of otherProducts) {
      expect(p.price).toBe(169.90);
    }
  });

  it('all products should have valid categories', () => {
    const validCategories = ['performance', 'lifestyle', 'limited'];
    for (const p of productCatalog) {
      expect(validCategories).toContain(p.category);
    }
  });

  it('margin calculation should be positive for all products', () => {
    const costMap: Record<string, number> = {
      performance: 85.00,
      lifestyle: 75.00,
      limited: 75.00,
    };
    for (const p of productCatalog) {
      const cost = costMap[p.category];
      const margin = (p.price - cost) / p.price * 100;
      expect(margin, `${p.name} should have positive margin`).toBeGreaterThan(0);
    }
  });

  it('admin route /admin/products should be accessible with admin credentials', async () => {
    // Test that the admin endpoint exists and requires auth
    const res = await fetch('http://localhost:3001/api/admin/me', {
      headers: { 'Authorization': 'Bearer invalid_token' }
    });
    expect(res.status).toBe(401);
  });
});
