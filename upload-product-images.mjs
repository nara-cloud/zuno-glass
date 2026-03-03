import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// S3 config from env (same as server/storage.ts)
const s3 = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
});
const BUCKET = process.env.S3_BUCKET || '';
const CDN_BASE = process.env.S3_CDN_URL || `https://${BUCKET}.s3.amazonaws.com`;

// Mapping: filename (without extension) -> product slug in DB
const FILE_TO_SLUG = {
  'HarperPreto':                          'zuno-arven',
  'InfinityPrataEspelhadoPreto':          'zuno-infinity-mirror',
  'JinBrancoAzulClaro':                   'zuno-noxis-branco-azul-claro',
  'HawaiPretoDourado':                    'zuno-axiom',
  'JinBrancoRosa':                        'zuno-noxis-branco-rosa',
  'JinPretoVerde':                        'zuno-noxis-preto-verde',
  'KansasPremium3.0MarromPreto':          'zuno-obsidian',
  'LorenaAzul':                           'zuno-venza-azul',
  'DubaiPremiumPretoDouradoPreto':        'zuno-solaris',
  'MadagascarAzulEscuroPreto':            'zuno-kaizen-azul-escuro-preto',
  'MadagascarVerdePreto':                 'zuno-kaizen-verde-preto',
  'MiaRosaCamuflado':                     'zuno-mistral',
  'LorenaPretoDegradêBranco':             'zuno-venza-preto-degrade-branco',
  'Oregon2.0RosaEscuroCamuflado':         'zuno-vortexa',
  'PrimeVerdeMulticolorsCinzaAzul':       'zuno-veyron-verde-multicolors',
  'HexagonalB2.0MarromDegradê':           'zuno-orvik',
  'PrimeAzulMulticolorsPreto':            'zuno-veyron-azul-multicolors-preto',
  'PrimePretoFosco':                      'zuno-veyron-preto-fosco',
  'PrimeAmareloMulticolorsBrancoPreto':   'zuno-veyron-amarelo-multicolors',
  'SambaMarromDegradêRose':               'zuno-infinity-x-marrom-degrade-rose',
  'SambaPretoDourado':                    'zuno-infinity-x-preto-dourado',
  'Florença2.0Preto':                     'zuno-kaori',
  'SambaMarromDegradêPreto':              'zuno-infinity-x-marrom-degrade-preto',
  'AresPremiumPreto':                     'zuno-apex',
  'DevonMarromVerde':                     'zuno-strix-marrom-verde',
  'DevonAzulMulticolorsTransparenteCinza': 'zuno-strix-azul-multicolors',
  'DevonPretoFosco':                      'zuno-strix',
  'VeronaPreto':                          'zuno-neroz',
  'AviadorLightPreto':                    'zuno-altis',
  'DiamondPreto':                         'zuno-titan',
  'DiamondPremiumPretoDegradê':           'zuno-titan',
  'DuneMarrom':                           'zuno-lumea',
};

// Special: some products need specific file
const SLUG_OVERRIDES = {
  'zuno-titan': 'DiamondPremiumPretoDegradê', // prefer the premium version
  'zuno-savik': null, // no file provided — skip
};

const UPLOAD_DIR = '/home/ubuntu/upload';

async function uploadToS3(filePath, key) {
  const data = fs.readFileSync(filePath);
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: data,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000',
  }));
  return `${CDN_BASE}/${key}`;
}

async function main() {
  const pool = mysql.createPool(process.env.DATABASE_URL);

  const files = fs.readdirSync(UPLOAD_DIR).filter(f => f.endsWith('.webp'));
  console.log(`Found ${files.length} webp files`);

  // Build slug -> file mapping
  const slugToFile = {};
  for (const file of files) {
    const name = file.replace('.webp', '');
    const slug = FILE_TO_SLUG[name];
    if (slug) {
      // Only override if not already set, or if this file is the preferred one
      if (!slugToFile[slug] || SLUG_OVERRIDES[slug] === name) {
        slugToFile[slug] = file;
      }
    } else {
      console.warn(`  ⚠ No mapping for: ${file}`);
    }
  }

  console.log(`\nUploading ${Object.keys(slugToFile).length} images...\n`);

  for (const [slug, file] of Object.entries(slugToFile)) {
    const filePath = path.join(UPLOAD_DIR, file);
    const key = `products/${slug}-${Date.now().toString(36)}.webp`;
    try {
      const url = await uploadToS3(filePath, key);
      // Update product image_url
      const [result] = await pool.execute(
        'UPDATE catalog_products SET image_url = ? WHERE slug = ?',
        [url, slug]
      );
      const affected = result.affectedRows;
      console.log(`  ✓ ${slug} → ${url.substring(0, 60)}... (${affected} row updated)`);
      
      // Also update the first variant's image_url if it has no image
      await pool.execute(
        `UPDATE catalog_variants SET image_url = ? 
         WHERE product_id = (SELECT id FROM catalog_products WHERE slug = ?) 
         AND (image_url IS NULL OR image_url = '')
         LIMIT 1`,
        [url, slug]
      );
    } catch (e) {
      console.error(`  ✗ ${slug}: ${e.message}`);
    }
  }

  // Also update images JSON column for products that were updated
  for (const [slug] of Object.entries(slugToFile)) {
    const [rows] = await pool.execute(
      'SELECT id, image_url FROM catalog_products WHERE slug = ?',
      [slug]
    );
    if (rows.length > 0 && rows[0].image_url) {
      await pool.execute(
        'UPDATE catalog_products SET images = ? WHERE slug = ?',
        [JSON.stringify([rows[0].image_url]), slug]
      );
    }
  }

  await pool.end();
  console.log('\nDone!');
}

main().catch(console.error);
