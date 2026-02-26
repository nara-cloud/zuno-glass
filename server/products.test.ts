import { describe, it, expect } from 'vitest';
import { productCatalog, getProductById } from '../shared/products';

describe('Product Catalog - New Names & Categories', () => {
  it('should have 21 products total', () => {
    expect(productCatalog.length).toBe(21);
  });

  it('should have 5 performance products', () => {
    const performance = productCatalog.filter(p => p.category === 'performance');
    expect(performance.length).toBe(5);
  });

  it('should have 11 lifestyle products', () => {
    const lifestyle = productCatalog.filter(p => p.category === 'lifestyle');
    expect(lifestyle.length).toBe(11);
  });

  it('should have 5 limited edition products', () => {
    const limited = productCatalog.filter(p => p.category === 'limited');
    expect(limited.length).toBe(5);
  });

  it('should not have old category names (sport, urban, premium)', () => {
    const oldCategories = productCatalog.filter(
      p => p.category === ('sport' as any) || p.category === ('urban' as any) || p.category === ('premium' as any)
    );
    expect(oldCategories.length).toBe(0);
  });

  it('performance products should have correct new names', () => {
    const performanceNames = productCatalog
      .filter(p => p.category === 'performance')
      .map(p => p.name);
    expect(performanceNames).toContain('ZUNO VEYRON');
    expect(performanceNames).toContain('ZUNO STRIX');
    expect(performanceNames).toContain('ZUNO KAIZEN');
    expect(performanceNames).toContain('ZUNO VORTEXA');
    expect(performanceNames).toContain('ZUNO NOXIS');
  });

  it('lifestyle products should have correct new names', () => {
    const lifestyleNames = productCatalog
      .filter(p => p.category === 'lifestyle')
      .map(p => p.name);
    expect(lifestyleNames).toContain('ZUNO ALTIS');
    expect(lifestyleNames).toContain('ZUNO ARVEN');
    expect(lifestyleNames).toContain('ZUNO KAORI');
    expect(lifestyleNames).toContain('ZUNO VENZA');
    expect(lifestyleNames).toContain('ZUNO MISTRAL');
    expect(lifestyleNames).toContain('ZUNO LUMEA');
    expect(lifestyleNames).toContain('ZUNO SAVIK');
    expect(lifestyleNames).toContain('ZUNO NEROZ');
    expect(lifestyleNames).toContain('ZUNO AXIOM');
    expect(lifestyleNames).toContain('ZUNO ORVIK');
  });

  it('limited edition products should have correct new names', () => {
    const limitedNames = productCatalog
      .filter(p => p.category === 'limited')
      .map(p => p.name);
    expect(limitedNames).toContain('ZUNO APEX');
    expect(limitedNames).toContain('ZUNO TITAN');
    expect(limitedNames).toContain('ZUNO SOLARIS');
    expect(limitedNames).toContain('ZUNO OBSIDIAN');
    expect(limitedNames).toContain('ZUNO INFINITY X');
  });

  it('performance products should be priced at R$ 189.90', () => {
    const performance = productCatalog.filter(p => p.category === 'performance');
    performance.forEach(p => {
      expect(p.price).toBe(189.90);
    });
  });

  it('lifestyle and limited products should be priced at R$ 169.90', () => {
    const others = productCatalog.filter(p => p.category !== 'performance');
    others.forEach(p => {
      expect(p.price).toBe(169.90);
    });
  });

  it('should not have old product names', () => {
    const allNames = productCatalog.map(p => p.name);
    const oldNames = [
      'PRIME STEALTH', 'DEVON APEX', 'MADAGASCAR RUSH', 'OREGON BLAZE', 'JIN FLOW',
      'VERONA SHADOW', 'DIAMOND EDGE', 'HARPER VOLT', 'LORENA STRIKE', 'MIA CAMO', 'DUNE TRACKER',
      'ARES TITAN', 'DIAMOND NOIR', 'DUBAI ROYAL', 'KANSAS FORGE', 'SAMBA GOLD',
      'AVIADOR SKY', 'FLORENÇA VITA', 'HAWAI BREEZE', 'HEXAGONAL PRISM',
    ];
    oldNames.forEach(name => {
      expect(allNames).not.toContain(name);
    });
  });

  it('getProductById should find products by new IDs', () => {
    expect(getProductById('zuno-veyron')).toBeDefined();
    expect(getProductById('zuno-strix')).toBeDefined();
    expect(getProductById('zuno-apex')).toBeDefined();
    expect(getProductById('zuno-altis')).toBeDefined();
  });

  it('getProductById should not find old IDs', () => {
    expect(getProductById('zuno-prime-stealth')).toBeUndefined();
    expect(getProductById('zuno-devon-apex')).toBeUndefined();
    expect(getProductById('zuno-ares-titan')).toBeUndefined();
  });

  it('all product IDs should be unique', () => {
    const ids = productCatalog.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
