/**
 * Mapping between e-commerce product variants and ZUNO Gestão product IDs.
 * 
 * Each e-commerce product variant (identified by productId + colorName) maps to
 * a specific product in ZUNO Gestão (identified by gestaoProductId / SKU).
 * 
 * This mapping is the single source of truth for stock synchronization.
 */

export interface StockMappingEntry {
  /** E-commerce product ID (e.g., 'zuno-veyron') */
  ecommerceProductId: string;
  /** E-commerce variant color name (e.g., 'Preto Fosco') */
  ecommerceColorName: string;
  /** ZUNO Gestão product ID (numeric) */
  gestaoProductId: number;
  /** ZUNO Gestão SKU */
  gestaoSku: string;
  /** ZUNO Gestão product name (for reference) */
  gestaoName: string;
}

export const stockMapping: StockMappingEntry[] = [
  // === PERFORMANCE LINE ===
  // ZUNO VEYRON → PRIME STEALTH
  { ecommerceProductId: 'zuno-veyron', ecommerceColorName: 'Preto Fosco', gestaoProductId: 60007, gestaoSku: 'ZUNO-ESP-007', gestaoName: 'PRIME STEALTH - Preto Fosco' },
  { ecommerceProductId: 'zuno-veyron', ecommerceColorName: 'Azul Multicolors', gestaoProductId: 60004, gestaoSku: 'ZUNO-ESP-004', gestaoName: 'PRIME STEALTH - Azul Multicolors Preto' },
  { ecommerceProductId: 'zuno-veyron', ecommerceColorName: 'Verde Multicolors', gestaoProductId: 60006, gestaoSku: 'ZUNO-ESP-006', gestaoName: 'PRIME STEALTH - Verde Multicolors Cinza Azul' },
  { ecommerceProductId: 'zuno-veyron', ecommerceColorName: 'Amarelo Multicolors', gestaoProductId: 60005, gestaoSku: 'ZUNO-ESP-005', gestaoName: 'PRIME STEALTH - Amarelo Multicolors Branco Preto' },

  // ZUNO STRIX → DEVON APEX
  { ecommerceProductId: 'zuno-strix', ecommerceColorName: 'Preto Fosco', gestaoProductId: 60001, gestaoSku: 'ZUNO-ESP-001', gestaoName: 'DEVON APEX - Preto Fosco' },
  { ecommerceProductId: 'zuno-strix', ecommerceColorName: 'Azul Multicolors', gestaoProductId: 60002, gestaoSku: 'ZUNO-ESP-002', gestaoName: 'DEVON APEX - Azul Multicolors Transparente Cinza' },
  { ecommerceProductId: 'zuno-strix', ecommerceColorName: 'Marrom Verde', gestaoProductId: 60003, gestaoSku: 'ZUNO-ESP-003', gestaoName: 'DEVON APEX - Marrom Verde' },

  // ZUNO KAIZEN → MADAGASCAR RUSH
  { ecommerceProductId: 'zuno-kaizen', ecommerceColorName: 'Azul Escuro / Preto', gestaoProductId: 60009, gestaoSku: 'ZUNO-ESP-009', gestaoName: 'MADAGASCAR RUSH - Azul Escuro Preto' },
  { ecommerceProductId: 'zuno-kaizen', ecommerceColorName: 'Verde / Preto', gestaoProductId: 60010, gestaoSku: 'ZUNO-ESP-010', gestaoName: 'MADAGASCAR RUSH - Verde Preto' },

  // ZUNO VORTEXA → OREGON BLAZE
  { ecommerceProductId: 'zuno-vortexa', ecommerceColorName: 'Rosa Escuro Camuflado', gestaoProductId: 60016, gestaoSku: 'ZUNO-FEM-003', gestaoName: 'OREGON BLAZE - Rosa Escuro Camuflado' },

  // ZUNO NOXIS → JIN FLOW
  { ecommerceProductId: 'zuno-noxis', ecommerceColorName: 'Preto / Verde', gestaoProductId: 60011, gestaoSku: 'ZUNO-ESP-011', gestaoName: 'JIN FLOW - Preto Verde' },
  { ecommerceProductId: 'zuno-noxis', ecommerceColorName: 'Branco / Azul Claro', gestaoProductId: 60013, gestaoSku: 'ZUNO-ESP-013', gestaoName: 'JIN FLOW - Branco Azul Claro' },
  { ecommerceProductId: 'zuno-noxis', ecommerceColorName: 'Branco / Rosa', gestaoProductId: 60012, gestaoSku: 'ZUNO-ESP-012', gestaoName: 'JIN FLOW - Branco Rosa' },

  // === LIFESTYLE LINE ===
  // ZUNO ALTIS → HARPER VOLT
  { ecommerceProductId: 'zuno-altis', ecommerceColorName: 'Preto', gestaoProductId: 60021, gestaoSku: 'ZUNO-FEM-008', gestaoName: 'HARPER VOLT - Preto' },

  // ZUNO ARVEN → DIAMOND EDGE
  { ecommerceProductId: 'zuno-arven', ecommerceColorName: 'Preto', gestaoProductId: 60032, gestaoSku: 'ZUNO-MASC-009', gestaoName: 'DIAMOND EDGE - Preto' },

  // ZUNO KAORI → ARES TITAN
  { ecommerceProductId: 'zuno-kaori', ecommerceColorName: 'Preto', gestaoProductId: 60017, gestaoSku: 'ZUNO-FEM-004', gestaoName: 'ARES TITAN - Preto' },

  // ZUNO VENZA → LORENA STRIKE
  { ecommerceProductId: 'zuno-venza', ecommerceColorName: 'Azul', gestaoProductId: 60019, gestaoSku: 'ZUNO-FEM-006', gestaoName: 'LORENA STRIKE - Azul' },
  { ecommerceProductId: 'zuno-venza', ecommerceColorName: 'Preto Degradê / Branco', gestaoProductId: 60020, gestaoSku: 'ZUNO-FEM-007', gestaoName: 'LORENA STRIKE - Preto Degradê Branco' },

  // ZUNO MISTRAL → MIA CAMO
  { ecommerceProductId: 'zuno-mistral', ecommerceColorName: 'Rosa Camuflado', gestaoProductId: 60015, gestaoSku: 'ZUNO-FEM-002', gestaoName: 'MIA CAMO - Rosa Camuflado' },

  // ZUNO LUMEA → DUNE TRACKER
  { ecommerceProductId: 'zuno-lumea', ecommerceColorName: 'Marrom', gestaoProductId: 60030, gestaoSku: 'ZUNO-MASC-007', gestaoName: 'DUNE TRACKER - Marrom' },

  // ZUNO SAVIK → AVIADOR SKY
  { ecommerceProductId: 'zuno-savik', ecommerceColorName: 'Preto', gestaoProductId: 60031, gestaoSku: 'ZUNO-MASC-008', gestaoName: 'AVIADOR SKY - Preto' },

  // ZUNO NEROZ → FLORENÇA VITA
  { ecommerceProductId: 'zuno-neroz', ecommerceColorName: 'Preto', gestaoProductId: 60026, gestaoSku: 'ZUNO-MASC-003', gestaoName: 'FLORENÇA VITA - Preto' },

  // ZUNO AXIOM → HAWAI BREEZE
  { ecommerceProductId: 'zuno-axiom', ecommerceColorName: 'Preto Dourado', gestaoProductId: 60022, gestaoSku: 'ZUNO-FEM-009', gestaoName: 'HAWAI BREEZE - Preto Dourado' },

  // ZUNO ORVIK → HEXAGONAL PRISM
  { ecommerceProductId: 'zuno-orvik', ecommerceColorName: 'Marrom Degradê', gestaoProductId: 60025, gestaoSku: 'ZUNO-MASC-002', gestaoName: 'HEXAGONAL PRISM - Marrom Degradê' },

  // ZUNO INFINITY MIRROR → INFINITY MIRROR
  { ecommerceProductId: 'zuno-infinity-mirror', ecommerceColorName: 'Prata Espelhado / Preto', gestaoProductId: 60008, gestaoSku: 'ZUNO-ESP-008', gestaoName: 'INFINITY MIRROR - Prata Espelhado Preto' },

  // === EDIÇÃO LIMITADA LINE ===
  // ZUNO APEX → VERONA SHADOW
  { ecommerceProductId: 'zuno-apex', ecommerceColorName: 'Preto', gestaoProductId: 60018, gestaoSku: 'ZUNO-FEM-005', gestaoName: 'VERONA SHADOW - Preto' },

  // ZUNO TITAN → DIAMOND NOIR
  { ecommerceProductId: 'zuno-titan', ecommerceColorName: 'Preto Degradê', gestaoProductId: 60023, gestaoSku: 'ZUNO-FEM-010', gestaoName: 'DIAMOND NOIR - Preto Degradê' },

  // ZUNO SOLARIS → DUBAI ROYAL
  { ecommerceProductId: 'zuno-solaris', ecommerceColorName: 'Preto Dourado', gestaoProductId: 60024, gestaoSku: 'ZUNO-MASC-001', gestaoName: 'DUBAI ROYAL - Preto Dourado' },

  // ZUNO OBSIDIAN → KANSAS FORGE
  { ecommerceProductId: 'zuno-obsidian', ecommerceColorName: 'Marrom / Preto', gestaoProductId: 60014, gestaoSku: 'ZUNO-FEM-001', gestaoName: 'KANSAS FORGE - Marrom Preto' },

  // ZUNO INFINITY X → SAMBA GOLD
  { ecommerceProductId: 'zuno-infinity-x', ecommerceColorName: 'Preto Dourado', gestaoProductId: 60027, gestaoSku: 'ZUNO-MASC-004', gestaoName: 'SAMBA GOLD - Preto Dourado' },
  { ecommerceProductId: 'zuno-infinity-x', ecommerceColorName: 'Marrom Degradê / Preto', gestaoProductId: 60029, gestaoSku: 'ZUNO-MASC-006', gestaoName: 'SAMBA GOLD - Marrom Degradê Preto' },
  { ecommerceProductId: 'zuno-infinity-x', ecommerceColorName: 'Marrom Degradê / Rosé', gestaoProductId: 60028, gestaoSku: 'ZUNO-MASC-005', gestaoName: 'SAMBA GOLD - Marrom Degradê Rose' },
];

/**
 * Find the ZUNO Gestão product ID for a given e-commerce product variant.
 */
export function findGestaoProduct(ecommerceProductId: string, colorName: string): StockMappingEntry | undefined {
  return stockMapping.find(
    (m) => m.ecommerceProductId === ecommerceProductId && m.ecommerceColorName === colorName
  );
}

/**
 * Find all ZUNO Gestão product IDs for a given e-commerce product (all variants).
 */
export function findGestaoProductsByEcommerceId(ecommerceProductId: string): StockMappingEntry[] {
  return stockMapping.filter((m) => m.ecommerceProductId === ecommerceProductId);
}

/**
 * Get the total stock for an e-commerce product across all its variants.
 * Requires a map of gestaoProductId → stock quantity.
 */
export function getTotalProductStock(
  ecommerceProductId: string,
  stockMap: Map<number, number>
): number {
  const entries = findGestaoProductsByEcommerceId(ecommerceProductId);
  return entries.reduce((total, entry) => total + (stockMap.get(entry.gestaoProductId) || 0), 0);
}

/**
 * Get the stock for a specific variant.
 * Requires a map of gestaoProductId → stock quantity.
 */
export function getVariantStock(
  ecommerceProductId: string,
  colorName: string,
  stockMap: Map<number, number>
): number {
  const entry = findGestaoProduct(ecommerceProductId, colorName);
  if (!entry) return 0;
  return stockMap.get(entry.gestaoProductId) || 0;
}
