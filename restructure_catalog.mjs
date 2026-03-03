import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Mapeamento CSV → BD: nome original → nome ZUNO
// Baseado no CSV e na BD actual
const csvToZuno = {
  'ZUNO STRIX': 'ZUNO STRIX',
  'DEVON APEX': 'ZUNO STRIX',       // DEVON APEX = ZUNO STRIX (variantes 2 e 3)
  'PRIME STEALTH': 'ZUNO VEYRON',   // PRIME STEALTH = ZUNO VEYRON
  'INFINITY MIRROR': 'ZUNO INFINITY MIRROR',
  'MADAGASCAR RUSH': 'ZUNO KAIZEN',
  'JIN FLOW': 'ZUNO NOXIS',
  'KANSAS FORGE': 'ZUNO OBSIDIAN',
  'MIA CAMO': 'ZUNO MISTRAL',
  'OREGON BLAZE': 'ZUNO VORTEXA',
  'ARES TITAN': 'ZUNO KAORI',
  'VERONA SHADOW': 'ZUNO APEX',
  'LORENA STRIKE': 'ZUNO VENZA',
  'HARPER VOLT': 'ZUNO ALTIS',
  'HAWAI BREEZE': 'ZUNO AXIOM',
  'DIAMOND NOIR': 'ZUNO TITAN',
  'DUBAI ROYAL': 'ZUNO SOLARIS',
  'HEXAGONAL PRISM': 'ZUNO ORVIK',
  'FLORENÇA VITA': 'ZUNO NEROZ',
  'SAMBA GOLD': 'ZUNO INFINITY X',
  'DUNE TRACKER': 'ZUNO LUMEA',
  'AVIADOR SKY': 'ZUNO SAVIK',
  'DIAMOND EDGE': 'ZUNO ARVEN',
};

// CSV completo com os 32 SKUs
const csvData = [
  { produto: 'ZUNO STRIX', sku: 'ZUNO-ESP-001', linha: 'Esportivo', cor: 'Preto Fosco', estoque: 1 },
  { produto: 'DEVON APEX', sku: 'ZUNO-ESP-002', linha: 'Esportivo', cor: 'Azul Multicolors Transparente Cinza', estoque: 4 },
  { produto: 'DEVON APEX', sku: 'ZUNO-ESP-003', linha: 'Esportivo', cor: 'Marrom Verde', estoque: 5 },
  { produto: 'PRIME STEALTH', sku: 'ZUNO-ESP-004', linha: 'Esportivo', cor: 'Azul Multicolors Preto', estoque: 4 },
  { produto: 'PRIME STEALTH', sku: 'ZUNO-ESP-005', linha: 'Esportivo', cor: 'Amarelo Multicolors Branco Preto', estoque: 4 },
  { produto: 'PRIME STEALTH', sku: 'ZUNO-ESP-006', linha: 'Esportivo', cor: 'Verde Multicolors Cinza Azul', estoque: 4 },
  { produto: 'PRIME STEALTH', sku: 'ZUNO-ESP-007', linha: 'Esportivo', cor: 'Preto Fosco', estoque: 8 },
  { produto: 'INFINITY MIRROR', sku: 'ZUNO-ESP-008', linha: 'Esportivo', cor: 'Prata Espelhado Preto', estoque: 3 },
  { produto: 'MADAGASCAR RUSH', sku: 'ZUNO-ESP-009', linha: 'Esportivo', cor: 'Azul Escuro Preto', estoque: 4 },
  { produto: 'MADAGASCAR RUSH', sku: 'ZUNO-ESP-010', linha: 'Esportivo', cor: 'Verde Preto', estoque: 3 },
  { produto: 'JIN FLOW', sku: 'ZUNO-ESP-011', linha: 'Esportivo', cor: 'Preto Verde', estoque: 2 },
  { produto: 'JIN FLOW', sku: 'ZUNO-ESP-012', linha: 'Esportivo', cor: 'Branco Rosa', estoque: 3 },
  { produto: 'JIN FLOW', sku: 'ZUNO-ESP-013', linha: 'Esportivo', cor: 'Branco Azul Claro', estoque: 2 },
  { produto: 'KANSAS FORGE', sku: 'ZUNO-FEM-001', linha: 'Casual', cor: 'Marrom Preto', estoque: 2 },
  { produto: 'MIA CAMO', sku: 'ZUNO-FEM-002', linha: 'Casual', cor: 'Rosa Camuflado', estoque: 3 },
  { produto: 'OREGON BLAZE', sku: 'ZUNO-FEM-003', linha: 'Casual', cor: 'Rosa Escuro Camuflado', estoque: 3 },
  { produto: 'ARES TITAN', sku: 'ZUNO-FEM-004', linha: 'Casual', cor: 'Preto', estoque: 3 },
  { produto: 'VERONA SHADOW', sku: 'ZUNO-FEM-005', linha: 'Casual', cor: 'Preto', estoque: 3 },
  { produto: 'LORENA STRIKE', sku: 'ZUNO-FEM-006', linha: 'Casual', cor: 'Azul', estoque: 3 },
  { produto: 'LORENA STRIKE', sku: 'ZUNO-FEM-007', linha: 'Casual', cor: 'Preto Degradê Branco', estoque: 3 },
  { produto: 'HARPER VOLT', sku: 'ZUNO-FEM-008', linha: 'Casual', cor: 'Preto', estoque: 4 },
  { produto: 'HAWAI BREEZE', sku: 'ZUNO-FEM-009', linha: 'Casual', cor: 'Preto Dourado', estoque: 3 },
  { produto: 'DIAMOND NOIR', sku: 'ZUNO-FEM-010', linha: 'Casual', cor: 'Preto Degradê', estoque: 3 },
  { produto: 'DUBAI ROYAL', sku: 'ZUNO-MASC-001', linha: 'Casual', cor: 'Preto Dourado', estoque: 2 },
  { produto: 'HEXAGONAL PRISM', sku: 'ZUNO-MASC-002', linha: 'Casual', cor: 'Marrom Degradê', estoque: 2 },
  { produto: 'FLORENÇA VITA', sku: 'ZUNO-MASC-003', linha: 'Casual', cor: 'Preto', estoque: 2 },
  { produto: 'SAMBA GOLD', sku: 'ZUNO-MASC-004', linha: 'Casual', cor: 'Preto Dourado', estoque: 2 },
  { produto: 'SAMBA GOLD', sku: 'ZUNO-MASC-005', linha: 'Casual', cor: 'Marrom Degradê Rose', estoque: 2 },
  { produto: 'SAMBA GOLD', sku: 'ZUNO-MASC-006', linha: 'Casual', cor: 'Marrom Degradê Preto', estoque: 2 },
  { produto: 'DUNE TRACKER', sku: 'ZUNO-MASC-007', linha: 'Casual', cor: 'Marrom', estoque: 3 },
  { produto: 'AVIADOR SKY', sku: 'ZUNO-MASC-008', linha: 'Casual', cor: 'Preto', estoque: 4 },
  { produto: 'DIAMOND EDGE', sku: 'ZUNO-MASC-009', linha: 'Casual', cor: 'Preto', estoque: 3 },
];

// Contar quantas cores cada produto tem
const produtoCores = {};
for (const row of csvData) {
  if (!produtoCores[row.produto]) produtoCores[row.produto] = 0;
  produtoCores[row.produto]++;
}

// Buscar dados actuais dos produtos na BD (para herdar imagens, preços, etc.)
const [existingProducts] = await conn.execute('SELECT * FROM catalog_products');
const [existingVariants] = await conn.execute('SELECT * FROM catalog_variants');

// Criar mapa de produto ZUNO → dados da BD
const zunoProductMap = {};
for (const p of existingProducts) {
  zunoProductMap[p.name] = p;
}

// Criar mapa de SKU → variante BD
const skuVariantMap = {};
for (const v of existingVariants) {
  skuVariantMap[v.sku] = v;
}

console.log('Iniciando reestruturação...');
console.log('Produtos a criar:', csvData.length);

// Limpar tabelas
await conn.execute('DELETE FROM catalog_variants');
await conn.execute('DELETE FROM catalog_products');
console.log('Tabelas limpas.');

// Criar 32 produtos individuais
let created = 0;
for (const row of csvData) {
  const zunoName = csvToZuno[row.produto] || ('ZUNO ' + row.produto);
  const zunoProduct = zunoProductMap[zunoName];
  
  // Determinar nome do produto na loja
  const temMultiplasCores = produtoCores[row.produto] > 1;
  // Simplificar nome da cor para o título
  const corSimplificada = row.cor
    .replace(' Transparente Cinza', '')
    .replace(' Branco Preto', '')
    .replace(' Cinza Azul', '')
    .toUpperCase();
  
  const nomeProduto = temMultiplasCores
    ? `${zunoName} ${corSimplificada}`
    : zunoName;
  
  // Gerar slug único
  const slug = nomeProduto
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Categoria
  const category = row.linha === 'Esportivo' ? 'esportivo' : 'casual_feminino';
  
  // Preço baseado na linha
  const price = row.linha === 'Esportivo' ? 189.90 : 169.90;
  
  // Herdar imagem e tagline do produto ZUNO original
  const imageUrl = zunoProduct?.image_url || '';
  const tagline = zunoProduct?.tagline || '';
  const description = zunoProduct?.description || '';
  
  // Inserir produto
  const [result] = await conn.execute(
    `INSERT INTO catalog_products (name, slug, category, price, image_url, tagline, description, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
    [nomeProduto, slug, category, price, imageUrl, tagline, description]
  );
  
  const productId = result.insertId;
  
  // Determinar cor hex baseada na cor
  let colorHex = '#000000';
  const corLower = row.cor.toLowerCase();
  if (corLower.includes('azul')) colorHex = '#1a4a8a';
  else if (corLower.includes('verde')) colorHex = '#2d6a2d';
  else if (corLower.includes('amarelo')) colorHex = '#d4a017';
  else if (corLower.includes('rosa')) colorHex = '#e75480';
  else if (corLower.includes('marrom')) colorHex = '#8B4513';
  else if (corLower.includes('prata') || corLower.includes('cinza')) colorHex = '#808080';
  else if (corLower.includes('branco')) colorHex = '#f5f5f5';
  else if (corLower.includes('dourado')) colorHex = '#FFD700';
  
  // Herdar imagem da variante original se existir
  const originalVariant = skuVariantMap[row.sku];
  const variantImageUrl = originalVariant?.image_url || imageUrl;
  
  // Inserir variante única
  await conn.execute(
    `INSERT INTO catalog_variants (product_id, sku, color_name, color_hex, image_url, stock, price, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
    [productId, row.sku, row.cor, colorHex, variantImageUrl, row.estoque, price]
  );
  
  created++;
  console.log(`✓ ${nomeProduto} (${row.sku}) - stock: ${row.estoque}`);
}

console.log(`\n✅ ${created} produtos criados com sucesso!`);

// Verificar resultado
const [finalProducts] = await conn.execute('SELECT COUNT(*) as total FROM catalog_products');
const [finalVariants] = await conn.execute('SELECT COUNT(*) as total FROM catalog_variants');
console.log(`BD: ${finalProducts[0].total} produtos, ${finalVariants[0].total} variantes`);

await conn.end();
