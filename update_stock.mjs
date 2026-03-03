import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';

// CSV data from the uploaded file
const csvData = [
  { produto: 'ZUNO STRIX - Preto Fosco', sku: 'ZUNO-ESP-001', linha: 'Esportivo', estoque: 1 },
  { produto: 'DEVON APEX - Azul Multicolors Transparente Cinza', sku: 'ZUNO-ESP-002', linha: 'Esportivo', estoque: 4 },
  { produto: 'DEVON APEX - Marrom Verde', sku: 'ZUNO-ESP-003', linha: 'Esportivo', estoque: 5 },
  { produto: 'PRIME STEALTH - Azul Multicolors Preto', sku: 'ZUNO-ESP-004', linha: 'Esportivo', estoque: 4 },
  { produto: 'PRIME STEALTH - Amarelo Multicolors Branco Preto', sku: 'ZUNO-ESP-005', linha: 'Esportivo', estoque: 4 },
  { produto: 'PRIME STEALTH - Verde Multicolors Cinza Azul', sku: 'ZUNO-ESP-006', linha: 'Esportivo', estoque: 4 },
  { produto: 'PRIME STEALTH - Preto Fosco', sku: 'ZUNO-ESP-007', linha: 'Esportivo', estoque: 8 },
  { produto: 'INFINITY MIRROR - Prata Espelhado Preto', sku: 'ZUNO-ESP-008', linha: 'Esportivo', estoque: 3 },
  { produto: 'MADAGASCAR RUSH - Azul Escuro Preto', sku: 'ZUNO-ESP-009', linha: 'Esportivo', estoque: 4 },
  { produto: 'MADAGASCAR RUSH - Verde Preto', sku: 'ZUNO-ESP-010', linha: 'Esportivo', estoque: 3 },
  { produto: 'JIN FLOW - Preto Verde', sku: 'ZUNO-ESP-011', linha: 'Esportivo', estoque: 2 },
  { produto: 'JIN FLOW - Branco Rosa', sku: 'ZUNO-ESP-012', linha: 'Esportivo', estoque: 3 },
  { produto: 'JIN FLOW - Branco Azul Claro', sku: 'ZUNO-ESP-013', linha: 'Esportivo', estoque: 2 },
  { produto: 'KANSAS FORGE - Marrom Preto', sku: 'ZUNO-FEM-001', linha: 'Casual', estoque: 2 },
  { produto: 'MIA CAMO - Rosa Camuflado', sku: 'ZUNO-FEM-002', linha: 'Casual', estoque: 3 },
  { produto: 'OREGON BLAZE - Rosa Escuro Camuflado', sku: 'ZUNO-FEM-003', linha: 'Casual', estoque: 3 },
  { produto: 'ARES TITAN - Preto', sku: 'ZUNO-FEM-004', linha: 'Casual', estoque: 3 },
  { produto: 'VERONA SHADOW - Preto', sku: 'ZUNO-FEM-005', linha: 'Casual', estoque: 3 },
  { produto: 'LORENA STRIKE - Azul', sku: 'ZUNO-FEM-006', linha: 'Casual', estoque: 3 },
  { produto: 'LORENA STRIKE - Preto Degradê Branco', sku: 'ZUNO-FEM-007', linha: 'Casual', estoque: 3 },
  { produto: 'HARPER VOLT - Preto', sku: 'ZUNO-FEM-008', linha: 'Casual', estoque: 4 },
  { produto: 'HAWAI BREEZE - Preto Dourado', sku: 'ZUNO-FEM-009', linha: 'Casual', estoque: 3 },
  { produto: 'DIAMOND NOIR - Preto Degradê', sku: 'ZUNO-FEM-010', linha: 'Casual', estoque: 3 },
  { produto: 'DUBAI ROYAL - Preto Dourado', sku: 'ZUNO-MASC-001', linha: 'Casual', estoque: 2 },
  { produto: 'HEXAGONAL PRISM - Marrom Degradê', sku: 'ZUNO-MASC-002', linha: 'Casual', estoque: 2 },
  { produto: 'FLORENÇA VITA - Preto', sku: 'ZUNO-MASC-003', linha: 'Casual', estoque: 2 },
  { produto: 'SAMBA GOLD - Preto Dourado', sku: 'ZUNO-MASC-004', linha: 'Casual', estoque: 2 },
  { produto: 'SAMBA GOLD - Marrom Degradê Rose', sku: 'ZUNO-MASC-005', linha: 'Casual', estoque: 2 },
  { produto: 'SAMBA GOLD - Marrom Degradê Preto', sku: 'ZUNO-MASC-006', linha: 'Casual', estoque: 2 },
  { produto: 'DUNE TRACKER - Marrom', sku: 'ZUNO-MASC-007', linha: 'Casual', estoque: 3 },
  { produto: 'AVIADOR SKY - Preto', sku: 'ZUNO-MASC-008', linha: 'Casual', estoque: 4 },
  { produto: 'DIAMOND EDGE - Preto', sku: 'ZUNO-MASC-009', linha: 'Casual', estoque: 3 },
];

// Extract color name from "PRODUCT NAME - Color Name" format
function extractColor(produto) {
  const parts = produto.split(' - ');
  return parts.length > 1 ? parts.slice(1).join(' - ') : produto;
}

async function main() {
  const pool = mysql.createPool(process.env.DATABASE_URL || '');
  
  console.log('=== Actualizando estoque e cores das variantes ===\n');
  
  let updated = 0;
  let notFound = [];
  
  for (const item of csvData) {
    const colorName = extractColor(item.produto);
    
    // Update stock and color name by SKU
    const [result] = await pool.execute(
      `UPDATE catalog_variants SET stock = ?, color_name = ? WHERE sku = ?`,
      [item.estoque, colorName, item.sku]
    );
    
    if (result.affectedRows > 0) {
      console.log(`✓ ${item.sku} → "${colorName}" stock=${item.estoque}`);
      updated++;
    } else {
      console.log(`✗ NÃO ENCONTRADO: ${item.sku} (${item.produto})`);
      notFound.push(item);
    }
  }
  
  console.log(`\n=== ${updated} variantes actualizadas, ${notFound.length} não encontradas ===`);
  
  // Now update product categories: esportivo for ESP skus, casual for FEM/MASC
  // Map SKUs to product IDs and set correct categories
  console.log('\n=== Actualizando categorias dos produtos ===\n');
  
  // Get all variants with their product IDs
  const [variants] = await pool.execute(
    `SELECT cv.sku, cv.product_id, cp.name, cp.category 
     FROM catalog_variants cv 
     JOIN catalog_products cp ON cv.product_id = cp.id`
  );
  
  const productCategories = {};
  for (const v of variants) {
    const isEsportivo = v.sku.startsWith('ZUNO-ESP-');
    const newCategory = isEsportivo ? 'esportivo' : 'casual_masculino';
    if (!productCategories[v.product_id]) {
      productCategories[v.product_id] = { name: v.name, category: newCategory, sku: v.sku };
    }
  }
  
  for (const [productId, info] of Object.entries(productCategories)) {
    const [res] = await pool.execute(
      `UPDATE catalog_products SET category = ? WHERE id = ?`,
      [info.category, productId]
    );
    console.log(`✓ Produto ${productId} (${info.name}) → categoria: ${info.category}`);
  }
  
  // Verify final state
  console.log('\n=== Estado final da BD ===\n');
  const [products] = await pool.execute(
    `SELECT cp.id, cp.name, cp.slug, cp.category, 
            GROUP_CONCAT(CONCAT(cv.sku, ':', cv.color_name, '=', cv.stock) ORDER BY cv.sku SEPARATOR ' | ') as variants
     FROM catalog_products cp
     LEFT JOIN catalog_variants cv ON cv.product_id = cp.id
     GROUP BY cp.id
     ORDER BY cp.category, cp.id`
  );
  
  for (const p of products) {
    console.log(`[${p.category}] ${p.name} (${p.slug})`);
    if (p.variants) {
      p.variants.split(' | ').forEach(v => console.log(`   ${v}`));
    }
  }
  
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
