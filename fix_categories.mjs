import mysql from 'mysql2/promise';

// Mapeamento correcto baseado no CSV:
// Esportivo: PRIME STEALTH (veyron), DEVON APEX (strix), MADAGASCAR RUSH (kaizen),
//            OREGON BLAZE (vortexa), JIN FLOW (noxis), INFINITY MIRROR
// Casual: todos os FEM-* e MASC-* que não são esportivos

// Baseado no stockMapping original:
// zuno-veyron = PRIME STEALTH → esportivo (ESP-004,005,006,007)
// zuno-strix = DEVON APEX → esportivo (ESP-001,002,003)
// zuno-kaizen = MADAGASCAR RUSH → esportivo (ESP-009,010)
// zuno-vortexa = OREGON BLAZE → esportivo (FEM-003) ← era FEM mas é esportivo!
// zuno-noxis = JIN FLOW → esportivo (ESP-011,012,013)
// zuno-infinity-mirror = INFINITY MIRROR → esportivo (ESP-008)
// Todos os outros → casual

const categoryFixes = [
  // Esportivos
  { slug: 'zuno-veyron', category: 'esportivo' },
  { slug: 'zuno-strix', category: 'esportivo' },
  { slug: 'zuno-kaizen', category: 'esportivo' },
  { slug: 'zuno-vortexa', category: 'esportivo' },   // OREGON BLAZE - é esportivo
  { slug: 'zuno-noxis', category: 'esportivo' },
  { slug: 'zuno-infinity-mirror', category: 'esportivo' },
  // Casuais
  { slug: 'zuno-altis', category: 'casual_masculino' },      // HARPER VOLT
  { slug: 'zuno-arven', category: 'casual_masculino' },      // DIAMOND EDGE
  { slug: 'zuno-kaori', category: 'casual_masculino' },      // ARES TITAN
  { slug: 'zuno-venza', category: 'casual_masculino' },      // LORENA STRIKE
  { slug: 'zuno-mistral', category: 'casual_masculino' },    // MIA CAMO
  { slug: 'zuno-lumea', category: 'casual_masculino' },      // DUNE TRACKER
  { slug: 'zuno-savik', category: 'casual_masculino' },      // AVIADOR SKY
  { slug: 'zuno-neroz', category: 'casual_masculino' },      // FLORENÇA VITA
  { slug: 'zuno-axiom', category: 'casual_masculino' },      // HAWAI BREEZE
  { slug: 'zuno-orvik', category: 'casual_masculino' },      // HEXAGONAL PRISM
  { slug: 'zuno-apex', category: 'casual_masculino' },       // VERONA SHADOW
  { slug: 'zuno-titan', category: 'casual_masculino' },      // DIAMOND NOIR
  { slug: 'zuno-solaris', category: 'casual_masculino' },    // DUBAI ROYAL
  { slug: 'zuno-obsidian', category: 'casual_masculino' },   // KANSAS FORGE
  { slug: 'zuno-infinity-x', category: 'casual_masculino' }, // SAMBA GOLD
];

async function main() {
  const pool = mysql.createPool(process.env.DATABASE_URL || '');
  
  console.log('=== Corrigindo categorias ===\n');
  
  for (const fix of categoryFixes) {
    const [result] = await pool.execute(
      `UPDATE catalog_products SET category = ? WHERE slug = ?`,
      [fix.category, fix.slug]
    );
    console.log(`✓ ${fix.slug} → ${fix.category}`);
  }
  
  // Verify
  const [products] = await pool.execute(
    `SELECT slug, category, name FROM catalog_products ORDER BY category, id`
  );
  
  console.log('\n=== Categorias finais ===');
  console.log('\nESPORTIVOS (Performance):');
  products.filter(p => p.category === 'esportivo').forEach(p => console.log(`  - ${p.name} (${p.slug})`));
  console.log('\nCASUAIS (Lifestyle):');
  products.filter(p => p.category !== 'esportivo').forEach(p => console.log(`  - ${p.name} (${p.slug})`));
  
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
