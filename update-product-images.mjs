import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Mapping: filename -> product slug
const FILE_TO_SLUG = {
  'HarperPreto.webp':                          'zuno-arven',
  'InfinityPrataEspelhadoPreto.webp':          'zuno-infinity-mirror',
  'JinBrancoAzulClaro.webp':                   'zuno-noxis-branco-azul-claro',
  'HawaiPretoDourado.webp':                    'zuno-axiom',
  'JinBrancoRosa.webp':                        'zuno-noxis-branco-rosa',
  'JinPretoVerde.webp':                        'zuno-noxis-preto-verde',
  'KansasPremium3.0MarromPreto.webp':          'zuno-obsidian',
  'LorenaAzul.webp':                           'zuno-venza-azul',
  'DubaiPremiumPretoDouradoPreto.webp':        'zuno-solaris',
  'MadagascarAzulEscuroPreto.webp':            'zuno-kaizen-azul-escuro-preto',
  'MadagascarVerdePreto.webp':                 'zuno-kaizen-verde-preto',
  'MiaRosaCamuflado.webp':                     'zuno-mistral',
  'LorenaPretoDegradêBranco.webp':             'zuno-venza-preto-degrade-branco',
  'Oregon2.0RosaEscuroCamuflado.webp':         'zuno-vortexa',
  'PrimeVerdeMulticolorsCinzaAzul.webp':       'zuno-veyron-verde-multicolors',
  'HexagonalB2.0MarromDegradê.webp':           'zuno-orvik',
  'PrimeAzulMulticolorsPreto.webp':            'zuno-veyron-azul-multicolors-preto',
  'PrimePretoFosco.webp':                      'zuno-veyron-preto-fosco',
  'PrimeAmareloMulticolorsBrancoPreto.webp':   'zuno-veyron-amarelo-multicolors',
  'SambaMarromDegradêRose.webp':               'zuno-infinity-x-marrom-degrade-rose',
  'SambaPretoDourado.webp':                    'zuno-infinity-x-preto-dourado',
  'Florença2.0Preto.webp':                     'zuno-kaori',
  'SambaMarromDegradêPreto.webp':              'zuno-infinity-x-marrom-degrade-preto',
  'AresPremiumPreto.webp':                     'zuno-apex',
  'DevonMarromVerde.webp':                     'zuno-strix-marrom-verde',
  'DevonAzulMulticolorsTransparenteCinza.webp':'zuno-strix-azul-multicolors',
  'DevonPretoFosco.webp':                      'zuno-strix',
  'VeronaPreto.webp':                          'zuno-neroz',
  'AviadorLightPreto.webp':                    'zuno-altis',
  'DiamondPreto.webp':                         'zuno-titan',
  'DuneMarrom.webp':                           'zuno-lumea',
};

// CDN URLs from upload results
const FILE_TO_URL = {
  'HarperPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/YptsnQbODzfyLiuf.webp',
  'InfinityPrataEspelhadoPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/zuvDiGULMnMGSewd.webp',
  'JinBrancoAzulClaro.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/OCKCBZaIEwHTnvsR.webp',
  'HawaiPretoDourado.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/ueELSIwGoNnPmVFT.webp',
  'JinBrancoRosa.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/lhCzJAazeAKoTUoz.webp',
  'JinPretoVerde.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/tkrjXwiOwPLUHSDq.webp',
  'KansasPremium3.0MarromPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RlVRLUEXhvNsBJoW.webp',
  'LorenaAzul.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/aTlkVweaggTVYNAt.webp',
  'DubaiPremiumPretoDouradoPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/jqwhqmiWeuMTlkxf.webp',
  'MadagascarAzulEscuroPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/OYwedCVbIsIKiAyd.webp',
  'MadagascarVerdePreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/MMTrovRVcLzYNbrl.webp',
  'MiaRosaCamuflado.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/HXUdOgjuIWkMLNUo.webp',
  'LorenaPretoDegradêBranco.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/eTiGaAWeKMmbMSzO.webp',
  'Oregon2.0RosaEscuroCamuflado.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/FqDYhqndjFgDwbQX.webp',
  'PrimeVerdeMulticolorsCinzaAzul.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/AGDPXTsOdTIXCRyS.webp',
  'HexagonalB2.0MarromDegradê.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/MalBtfibJcezoRMj.webp',
  'PrimeAzulMulticolorsPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/CXUHfzvxYjdedWmx.webp',
  'PrimePretoFosco.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/leKpfZRRWqJulhNp.webp',
  'PrimeAmareloMulticolorsBrancoPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/eJiQPlcgVbksdyrR.webp',
  'SambaMarromDegradêRose.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/ZfpBmCXvPuBcACYt.webp',
  'SambaPretoDourado.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/dPOZzjqntbrUSZEZ.webp',
  'Florença2.0Preto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/aRCUjpWcpsInxLwY.webp',
  'SambaMarromDegradêPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/uOTAkFLWjrpCBDvz.webp',
  'AresPremiumPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/waisoKJuDBcEtgUJ.webp',
  'DevonMarromVerde.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/lhvvPHoCipIFYCep.webp',
  'DevonAzulMulticolorsTransparenteCinza.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/AabOnglcFvCOomqA.webp',
  'DevonPretoFosco.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/uYQLlQyNuJReIwzd.webp',
  'VeronaPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/OiHsaiAQTqQlutFe.webp',
  'AviadorLightPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/JmEEDHedgJOlPHRW.webp',
  'DiamondPreto.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/wrPCbEZEkyeihXpy.webp',
  'DuneMarrom.webp': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/DhtgkbcLQAMTEEkd.webp',
};

async function main() {
  const pool = mysql.createPool(process.env.DATABASE_URL);
  let updated = 0;

  for (const [file, slug] of Object.entries(FILE_TO_SLUG)) {
    const url = FILE_TO_URL[file];
    if (!url) {
      console.warn(`  ⚠ No URL for: ${file}`);
      continue;
    }
    const [result] = await pool.execute(
      'UPDATE catalog_products SET image_url = ?, images = ? WHERE slug = ?',
      [url, JSON.stringify([url]), slug]
    );
    const affected = result.affectedRows;
    console.log(`  ${affected > 0 ? '✓' : '⚠'} ${slug} ← ${file} (${affected} row)`);
    
    // Also update the first variant's image_url if empty
    await pool.execute(
      `UPDATE catalog_variants SET image_url = ? 
       WHERE product_id = (SELECT id FROM catalog_products WHERE slug = ?) 
       AND (image_url IS NULL OR image_url = '')
       LIMIT 1`,
      [url, slug]
    );
    if (affected > 0) updated++;
  }

  await pool.end();
  console.log(`\n✓ Updated ${updated} products`);
}

main().catch(console.error);
