/**
 * Product definitions shared between client and server.
 * Server uses this to validate checkout requests and set prices.
 */

export interface ProductInfo {
  id: string;
  name: string;
  price: number; // in BRL
  category: 'performance' | 'lifestyle' | 'limited';
}

export const productCatalog: ProductInfo[] = [
  // PERFORMANCE LINE - R$ 189,90
  { id: 'zuno-veyron', name: 'ZUNO VEYRON', price: 189.90, category: 'performance' },
  { id: 'zuno-strix', name: 'ZUNO STRIX', price: 189.90, category: 'performance' },
  { id: 'zuno-kaizen', name: 'ZUNO KAIZEN', price: 189.90, category: 'performance' },
  { id: 'zuno-vortexa', name: 'ZUNO VORTEXA', price: 189.90, category: 'performance' },
  { id: 'zuno-noxis', name: 'ZUNO NOXIS', price: 189.90, category: 'performance' },

  // LIFESTYLE LINE - R$ 169,90
  { id: 'zuno-altis', name: 'ZUNO ALTIS', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-arven', name: 'ZUNO ARVEN', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-kaori', name: 'ZUNO KAORI', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-venza', name: 'ZUNO VENZA', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-mistral', name: 'ZUNO MISTRAL', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-lumea', name: 'ZUNO LUMEA', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-savik', name: 'ZUNO SAVIK', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-neroz', name: 'ZUNO NEROZ', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-axiom', name: 'ZUNO AXIOM', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-orvik', name: 'ZUNO ORVIK', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-infinity-mirror', name: 'ZUNO INFINITY MIRROR', price: 169.90, category: 'lifestyle' },

  // EDIÇÃO LIMITADA LINE - R$ 169,90
  { id: 'zuno-apex', name: 'ZUNO APEX', price: 169.90, category: 'limited' },
  { id: 'zuno-titan', name: 'ZUNO TITAN', price: 169.90, category: 'limited' },
  { id: 'zuno-solaris', name: 'ZUNO SOLARIS', price: 169.90, category: 'limited' },
  { id: 'zuno-obsidian', name: 'ZUNO OBSIDIAN', price: 169.90, category: 'limited' },
  { id: 'zuno-infinity-x', name: 'ZUNO INFINITY X', price: 169.90, category: 'limited' },
];

export function getProductById(id: string): ProductInfo | undefined {
  return productCatalog.find(p => p.id === id);
}
