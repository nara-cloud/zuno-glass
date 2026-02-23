/**
 * Product definitions shared between client and server.
 * Server uses this to validate checkout requests and set prices.
 */

export interface ProductInfo {
  id: string;
  name: string;
  price: number; // in BRL
  category: 'sport' | 'urban' | 'premium' | 'lifestyle';
}

export const productCatalog: ProductInfo[] = [
  // SPORT LINE - R$ 189,90
  { id: 'zuno-prime-stealth', name: 'PRIME STEALTH', price: 189.90, category: 'sport' },
  { id: 'zuno-devon-apex', name: 'DEVON APEX', price: 189.90, category: 'sport' },
  { id: 'zuno-madagascar-rush', name: 'MADAGASCAR RUSH', price: 189.90, category: 'sport' },
  { id: 'zuno-oregon-blaze', name: 'OREGON BLAZE', price: 189.90, category: 'sport' },
  { id: 'zuno-jin-flow', name: 'JIN FLOW', price: 189.90, category: 'sport' },

  // URBAN LINE - R$ 169,90
  { id: 'zuno-verona-shadow', name: 'VERONA SHADOW', price: 169.90, category: 'urban' },
  { id: 'zuno-diamond-edge', name: 'DIAMOND EDGE', price: 169.90, category: 'urban' },
  { id: 'zuno-harper-volt', name: 'HARPER VOLT', price: 169.90, category: 'urban' },
  { id: 'zuno-lorena-strike', name: 'LORENA STRIKE', price: 169.90, category: 'urban' },
  { id: 'zuno-mia-camo', name: 'MIA CAMO', price: 169.90, category: 'urban' },
  { id: 'zuno-dune-tracker', name: 'DUNE TRACKER', price: 169.90, category: 'urban' },

  // PREMIUM LINE - R$ 169,90
  { id: 'zuno-ares-titan', name: 'ARES TITAN', price: 169.90, category: 'premium' },
  { id: 'zuno-diamond-noir', name: 'DIAMOND NOIR', price: 169.90, category: 'premium' },
  { id: 'zuno-dubai-royal', name: 'DUBAI ROYAL', price: 169.90, category: 'premium' },
  { id: 'zuno-kansas-forge', name: 'KANSAS FORGE', price: 169.90, category: 'premium' },
  { id: 'zuno-samba-gold', name: 'SAMBA GOLD', price: 169.90, category: 'premium' },

  // LIFESTYLE LINE - R$ 169,90
  { id: 'zuno-aviador-sky', name: 'AVIADOR SKY', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-florenca-vita', name: 'FLORENÇA VITA', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-hawai-breeze', name: 'HAWAI BREEZE', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-hexagonal-prism', name: 'HEXAGONAL PRISM', price: 169.90, category: 'lifestyle' },
  { id: 'zuno-infinity-mirror', name: 'INFINITY MIRROR', price: 169.90, category: 'lifestyle' },
];

export function getProductById(id: string): ProductInfo | undefined {
  return productCatalog.find(p => p.id === id);
}
