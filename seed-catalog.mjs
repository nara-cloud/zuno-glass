// seed-catalog.mjs — popula a BD com todos os 32 produtos e variantes ZUNO GLASS
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db = await mysql.createConnection(process.env.DATABASE_URL);

// Mapeamento: nome do e-commerce → dados reais do ZUNO Gestão
const products = [
  // === LINHA PERFORMANCE === R$ 189,90
  {
    slug: 'zuno-veyron',
    name: 'ZUNO VEYRON',
    category: 'esportivo',
    price: 189.90,
    tagline: 'INVISÍVEL. IMPARÁVEL.',
    description: 'Armação envolvente de perfil baixo para máxima aerodinâmica. Lentes multicolor com contraste aprimorado para treinos de alta intensidade.',
    features: JSON.stringify(['Lentes Multicolor', 'Armação Envolvente', 'Grip Antiderrapante', 'Ventilação Lateral']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/APTVjOwFJLyOhAcb.webp',
    variants: [
      { colorName: 'Azul Multicolors Preto', color: '#2563eb', sku: 'ZUNO-ESP-004', supplierCode: 'PRIME-AZUL-MULTI', cost: 39.90, stock: 4, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/APTVjOwFJLyOhAcb.webp' },
      { colorName: 'Amarelo Multicolors Branco Preto', color: '#eab308', sku: 'ZUNO-ESP-005', supplierCode: 'PRIME-AMARELO-MULTI', cost: 39.90, stock: 4, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/cHRtMuTQetcdzxBx.webp' },
      { colorName: 'Verde Multicolors Cinza Azul', color: '#16a34a', sku: 'ZUNO-ESP-006', supplierCode: 'PRIME-VERDE-MULTI', cost: 39.90, stock: 4, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/bkQGhaArWOdyfuGm.webp' },
      { colorName: 'Preto Fosco', color: '#1a1a1a', sku: 'ZUNO-ESP-007', supplierCode: 'PRIME-PRETO-FOSCO', cost: 39.90, stock: 8, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/fCMcvkAETylkQKLl.webp' },
    ]
  },
  {
    slug: 'zuno-strix',
    name: 'ZUNO STRIX',
    category: 'esportivo',
    price: 189.90,
    tagline: 'DOMINE O TERRENO.',
    description: 'Design angular e agressivo para trilhas e esportes outdoor. Proteção lateral reforçada e campo de visão ampliado.',
    features: JSON.stringify(['Proteção Lateral', 'Campo de Visão Ampliado', 'Armação TR90', 'Lentes Intercambiáveis']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/rUnAQaFnVwfpcCZw.webp',
    variants: [
      { colorName: 'Preto Fosco', color: '#1a1a1a', sku: 'ZUNO-ESP-001', supplierCode: 'DEVON-PRETO-FOSCO', cost: 39.90, stock: 1, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/rUnAQaFnVwfpcCZw.webp' },
      { colorName: 'Azul Multicolors Transparente Cinza', color: '#2563eb', sku: 'ZUNO-ESP-002', supplierCode: 'DEVON-AZUL-MULTI', cost: 39.90, stock: 4, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/oaeNwuPidzyFZzDd.webp' },
      { colorName: 'Marrom Verde', color: '#854d0e', sku: 'ZUNO-ESP-003', supplierCode: 'DEVON-MARROM-VERDE', cost: 39.90, stock: 5, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/CyWoxEwiLUACWQXw.webp' },
    ]
  },
  {
    slug: 'zuno-kaizen',
    name: 'ZUNO KAIZEN',
    category: 'esportivo',
    price: 189.90,
    tagline: 'VELOCIDADE SELVAGEM.',
    description: 'Inspirado na natureza bruta. Lentes de alto contraste para ambientes de luz variável, ideal para corrida e ciclismo.',
    features: JSON.stringify(['Alto Contraste', 'Proteção UV400', 'Hastes Flexíveis', 'Peso Ultra-leve']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/trxVpeGMgBkbnyZu.webp',
    variants: [
      { colorName: 'Azul Escuro / Preto', color: '#1e3a5f', sku: 'ZUNO-ESP-009', supplierCode: 'MADAGASCAR-AZUL', cost: 39.90, stock: 4, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/trxVpeGMgBkbnyZu.webp' },
      { colorName: 'Verde / Preto', color: '#166534', sku: 'ZUNO-ESP-010', supplierCode: 'MADAGASCAR-VERDE', cost: 39.90, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/mHWYYWwkpbpuwFCf.webp' },
    ]
  },
  {
    slug: 'zuno-vortexa',
    name: 'ZUNO VORTEXA',
    category: 'esportivo',
    price: 189.90,
    tagline: 'FOGO NA TRILHA.',
    description: 'Atitude e performance em um design ousado. Padrão camuflado exclusivo para quem não se esconde.',
    features: JSON.stringify(['Padrão Camuflado Exclusivo', 'Lentes Polarizadas', 'Armação Reforçada', 'Grip Nasal 3D']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IWenDvJdSBlUkfBe.webp',
    variants: [
      { colorName: 'Rosa Escuro Camuflado', color: '#be185d', sku: 'ZUNO-FEM-003', supplierCode: 'OREGON-ROSA-CAMU', cost: 39.90, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IWenDvJdSBlUkfBe.webp' },
    ]
  },
  {
    slug: 'zuno-noxis',
    name: 'ZUNO NOXIS',
    category: 'esportivo',
    price: 189.90,
    tagline: 'FLUIDEZ EM MOVIMENTO.',
    description: 'Linhas suaves e aerodinâmicas para quem busca leveza absoluta. Design unissex com opções vibrantes.',
    features: JSON.stringify(['Design Unissex', 'Armação Ultra-leve', 'Lentes Anti-reflexo', 'Ventilação Active-Flow']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IIEuNTGVJYVtNhee.webp',
    variants: [
      { colorName: 'Preto / Verde', color: '#166534', sku: 'ZUNO-ESP-011', supplierCode: 'JIN-PRETO-VERDE', cost: 39.90, stock: 2, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IIEuNTGVJYVtNhee.webp' },
      { colorName: 'Branco / Azul Claro', color: '#93c5fd', sku: 'ZUNO-ESP-013', supplierCode: 'JIN-BRANCO-AZUL', cost: 39.90, stock: 2, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/XOWAvAeUKxjTTITL.webp' },
      { colorName: 'Branco / Rosa', color: '#f472b6', sku: 'ZUNO-ESP-012', supplierCode: 'JIN-BRANCO-ROSA', cost: 39.90, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/CPiDcxzCUZakQxSc.webp' },
    ]
  },

  // === LINHA LIFESTYLE === R$ 169,90
  {
    slug: 'zuno-altis',
    name: 'ZUNO ALTIS',
    category: 'casual_masculino',
    price: 169.90,
    tagline: 'SOMBRA URBANA.',
    description: 'Elegância italiana com DNA esportivo. Armação robusta e lentes escuras para dominar a cidade.',
    features: JSON.stringify(['Lentes Escuras Premium', 'Armação Acetato', 'Dobradiças Reforçadas', 'Proteção UV400']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/kcwyxMaSdnhTPrbI.webp',
    variants: [
      { colorName: 'Preto', color: '#000000', sku: 'ZUNO-FEM-008', supplierCode: 'HARPER-PRETO', cost: 35.00, stock: 4, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/kcwyxMaSdnhTPrbI.webp' },
    ]
  },
  {
    slug: 'zuno-arven',
    name: 'ZUNO ARVEN',
    category: 'casual_masculino',
    price: 169.90,
    tagline: 'CORTE PRECISO.',
    description: 'Geometria angular inspirada no diamante. Presença marcante para quem exige atenção.',
    features: JSON.stringify(['Design Geométrico', 'Lentes Polarizadas', 'Armação Leve', 'Acabamento Premium']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/NNTbSxnTvcDFDsSS.webp',
    variants: [
      { colorName: 'Preto', color: '#000000', sku: 'ZUNO-MASC-009', supplierCode: 'DIAMOND-PRETO', cost: 25.00, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/NNTbSxnTvcDFDsSS.webp' },
    ]
  },
  {
    slug: 'zuno-kaori',
    name: 'ZUNO KAORI',
    category: 'casual_masculino',
    price: 169.90,
    tagline: 'ENERGIA PURA.',
    description: 'Perfil arredondado com personalidade forte. Transição perfeita do treino para a rua.',
    features: JSON.stringify(['Transição Treino-Rua', 'Lentes Anti-reflexo', 'Armação Flexível', 'Estojo Incluído']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/aksfQZUeelZUqYTB.webp',
    variants: [
      { colorName: 'Preto', color: '#000000', sku: 'ZUNO-FEM-004', supplierCode: 'ARES-PRETO', cost: 35.00, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/aksfQZUeelZUqYTB.webp' },
    ]
  },
  {
    slug: 'zuno-venza',
    name: 'ZUNO VENZA',
    category: 'casual_masculino',
    price: 169.90,
    tagline: 'GOLPE DE ESTILO.',
    description: 'Linhas femininas com atitude esportiva. Design oversized para máxima proteção e presença.',
    features: JSON.stringify(['Design Oversized', 'Lentes Degradê', 'Armação Acetato', 'Proteção UV400']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/eWxVKgFdRqPppKgV.webp',
    variants: [
      { colorName: 'Azul', color: '#2563eb', sku: 'ZUNO-FEM-006', supplierCode: 'LORENA-AZUL', cost: 35.00, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/eWxVKgFdRqPppKgV.webp' },
      { colorName: 'Preto Degradê / Branco', color: '#1a1a1a', sku: 'ZUNO-FEM-007', supplierCode: 'LORENA-PRETO-DEG', cost: 35.00, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/rMjNHyklnEYtsqXg.webp' },
    ]
  },
  {
    slug: 'zuno-mistral',
    name: 'ZUNO MISTRAL',
    category: 'casual_masculino',
    price: 169.90,
    tagline: 'CAMUFLAGEM URBANA.',
    description: 'Padrão camuflado com toque feminino. Para quem se destaca mesmo tentando se esconder.',
    features: JSON.stringify(['Padrão Camuflado', 'Armação Leve', 'Lentes Espelhadas', 'Design Feminino']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/roHIyPaALdrwIJWm.webp',
    variants: [
      { colorName: 'Rosa Camuflado', color: '#f472b6', sku: 'ZUNO-FEM-002', supplierCode: 'MIA-ROSA-CAMU', cost: 39.00, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/roHIyPaALdrwIJWm.webp' },
    ]
  },
  {
    slug: 'zuno-lumea',
    name: 'ZUNO LUMEA',
    category: 'casual_masculino',
    price: 169.90,
    tagline: 'RASTRO NO DESERTO.',
    description: 'Tons terrosos e armação robusta. Inspirado em expedições, feito para a aventura do dia a dia.',
    features: JSON.stringify(['Tons Terrosos', 'Armação Robusta', 'Lentes Marrom Degradê', 'Grip Antiderrapante']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/PUhJNzxlrMgBqtUw.webp',
    variants: [
      { colorName: 'Marrom', color: '#854d0e', sku: 'ZUNO-MASC-007', supplierCode: 'DUNE-MARROM', cost: 29.90, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/PUhJNzxlrMgBqtUw.webp' },
    ]
  },
  {
    slug: 'zuno-savik',
    name: 'ZUNO SAVIK',
    category: 'casual_masculino',
    price: 169.90,
    tagline: 'ACIMA DAS NUVENS.',
    description: 'O clássico aviador reinventado com DNA ZUNO. Leveza extrema e estilo atemporal.',
    features: JSON.stringify(['Design Aviador Clássico', 'Armação Ultra-leve', 'Lentes Polarizadas', 'Proteção UV400']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/LumkVuPKMYjQGpVh.webp',
    variants: [
      { colorName: 'Preto', color: '#000000', sku: 'ZUNO-MASC-008', supplierCode: 'AVIADOR-LIGHT-PRETO', cost: 29.90, stock: 4, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/LumkVuPKMYjQGpVh.webp' },
    ]
  },
  {
    slug: 'zuno-neroz',
    name: 'ZUNO NEROZ',
    category: 'casual_masculino',
    price: 169.90,
    tagline: 'VIDA COM ESTILO.',
    description: 'Inspirado na arte toscana. Armação elegante para quem vive cada momento com intensidade.',
    features: JSON.stringify(['Inspiração Toscana', 'Armação Acetato', 'Lentes Anti-reflexo', 'Design Clássico']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/DscTqYwlGTgnPRnr.webp',
    variants: [
      { colorName: 'Preto', color: '#000000', sku: 'ZUNO-MASC-003', supplierCode: 'FLORENCA-PRETO', cost: 35.00, stock: 2, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/DscTqYwlGTgnPRnr.webp' },
    ]
  },
  {
    slug: 'zuno-axiom',
    name: 'ZUNO AXIOM',
    category: 'casual_masculino',
    price: 169.90,
    tagline: 'BRISA DO PARAÍSO.',
    description: 'Detalhes dourados e estilo descontraído. Perfeito para dias de sol e noites de verão.',
    features: JSON.stringify(['Detalhes Dourados', 'Lentes Escuras', 'Armação Metal', 'Estilo Descontraído']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RzkSMwZgKttsoMsK.webp',
    variants: [
      { colorName: 'Preto Dourado', color: '#b8860b', sku: 'ZUNO-FEM-009', supplierCode: 'HAWAI-PRETO-DOURADO', cost: 35.00, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RzkSMwZgKttsoMsK.webp' },
    ]
  },
  {
    slug: 'zuno-orvik',
    name: 'ZUNO ORVIK',
    category: 'casual_masculino',
    price: 169.90,
    tagline: 'GEOMETRIA PERFEITA.',
    description: 'Formato hexagonal icónico com lentes degradê. Para quem vê o mundo de um ângulo diferente.',
    features: JSON.stringify(['Formato Hexagonal', 'Lentes Marrom Degradê', 'Armação Metal', 'Design Icónico']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/OycOdSoWVVpWpNvg.webp',
    variants: [
      { colorName: 'Marrom Degradê', color: '#854d0e', sku: 'ZUNO-MASC-002', supplierCode: 'HEX-B-MARROM-DEG', cost: 35.00, stock: 2, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/OycOdSoWVVpWpNvg.webp' },
    ]
  },
  {
    slug: 'zuno-infinity-mirror',
    name: 'ZUNO INFINITY MIRROR',
    category: 'casual_masculino',
    price: 169.90,
    tagline: 'REFLEXO INFINITO.',
    description: 'Lentes espelhadas que refletem o mundo. Design futurista para quem está sempre à frente.',
    features: JSON.stringify(['Lentes Espelhadas', 'Design Futurista', 'Armação Metal', 'Proteção UV400']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/FWbaSISkachUrCBN.webp',
    variants: [
      { colorName: 'Prata Espelhado / Preto', color: '#c0c0c0', sku: 'ZUNO-ESP-008', supplierCode: 'INFINITY-PRATA-ESP', cost: 39.90, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/FWbaSISkachUrCBN.webp' },
    ]
  },

  // === LINHA EDIÇÃO LIMITADA === R$ 169,90
  {
    slug: 'zuno-apex',
    name: 'ZUNO APEX',
    category: 'edicao_limitada',
    price: 169.90,
    tagline: 'FORÇA DOS DEUSES.',
    description: 'Nomeado em honra ao deus da guerra. Armação premium com acabamento metálico e lentes de alta definição.',
    features: JSON.stringify(['Acabamento Metálico', 'Lentes HD', 'Armação Titânio', 'Garantia Estendida']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sRpCcIwVVRMBgNYn.webp',
    variants: [
      { colorName: 'Preto', color: '#000000', sku: 'ZUNO-FEM-005', supplierCode: 'VERONA-PRETO', cost: 35.00, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sRpCcIwVVRMBgNYn.webp' },
    ]
  },
  {
    slug: 'zuno-titan',
    name: 'ZUNO TITAN',
    category: 'edicao_limitada',
    price: 169.90,
    tagline: 'BRILHO ESCURO.',
    description: 'Versão premium com lentes degradê e acabamento sofisticado. Luxo com atitude.',
    features: JSON.stringify(['Lentes Degradê Premium', 'Acabamento Sofisticado', 'Armação Acetato Premium', 'Estojo Rígido']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RrYhGfuyTXhBETvZ.webp',
    variants: [
      { colorName: 'Preto Degradê', color: '#1a1a1a', sku: 'ZUNO-FEM-010', supplierCode: 'DIAMOND-PREM-PRETO', cost: 25.00, stock: 3, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RrYhGfuyTXhBETvZ.webp' },
    ]
  },
  {
    slug: 'zuno-solaris',
    name: 'ZUNO SOLARIS',
    category: 'edicao_limitada',
    price: 169.90,
    tagline: 'LUXO SEM LIMITES.',
    description: 'Detalhes dourados e presença imponente. Para quem vive no topo e não aceita menos.',
    features: JSON.stringify(['Detalhes Dourados', 'Lentes Premium', 'Armação Metal/Acetato', 'Acabamento Exclusivo']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/AyTmNWtwUdkVcPCb.webp',
    variants: [
      { colorName: 'Preto Dourado', color: '#b8860b', sku: 'ZUNO-MASC-001', supplierCode: 'DUBAI-PRETO-DOURADO', cost: 35.00, stock: 2, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/AyTmNWtwUdkVcPCb.webp' },
    ]
  },
  {
    slug: 'zuno-obsidian',
    name: 'ZUNO OBSIDIAN',
    category: 'edicao_limitada',
    price: 169.90,
    tagline: 'FORJADO PARA DURAR.',
    description: 'Construção premium com materiais de alta resistência. O companheiro que aguenta qualquer desafio.',
    features: JSON.stringify(['Alta Resistência', 'Lentes Polarizadas', 'Armação Reforçada', 'Garantia Vitalícia']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/vWOZIdEYMAwIoqas.webp',
    variants: [
      { colorName: 'Marrom / Preto', color: '#854d0e', sku: 'ZUNO-FEM-001', supplierCode: 'KANSAS-MARROM', cost: 19.90, stock: 2, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/vWOZIdEYMAwIoqas.webp' },
    ]
  },
  {
    slug: 'zuno-infinity-x',
    name: 'ZUNO INFINITY X',
    category: 'edicao_limitada',
    price: 169.90,
    tagline: 'RITMO DOURADO.',
    description: 'O espírito brasileiro em forma de óculos. Acabamento premium com detalhes que brilham.',
    features: JSON.stringify(['Detalhes Dourados', 'Lentes Degradê', 'Armação Acetato Premium', 'Design Brasileiro']),
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sLqDplNhTucIsqbF.webp',
    variants: [
      { colorName: 'Preto Dourado', color: '#b8860b', sku: 'ZUNO-MASC-004', supplierCode: 'SAMBA-PRETO-DOURADO', cost: 35.00, stock: 2, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sLqDplNhTucIsqbF.webp' },
      { colorName: 'Marrom Degradê / Preto', color: '#854d0e', sku: 'ZUNO-MASC-006', supplierCode: 'SAMBA-MARROM-PRETO', cost: 35.00, stock: 2, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/bEXoVbxaSLthStpz.webp' },
      { colorName: 'Marrom Degradê / Rosé', color: '#f4a6c0', sku: 'ZUNO-MASC-005', supplierCode: 'SAMBA-MARROM-ROSE', cost: 35.00, stock: 2, image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/BpYhqeRqkzblMwLh.webp' },
    ]
  },
];

console.log('🌱 Iniciando seed do catálogo...');

// Limpar tabelas existentes
await db.execute('DELETE FROM catalog_variants');
await db.execute('DELETE FROM catalog_products');
console.log('✅ Tabelas limpas');

let totalVariants = 0;

for (const product of products) {
  // Inserir produto
  const [result] = await db.execute(
    `INSERT INTO catalog_products (slug, name, category, price, tagline, description, features, image_url, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
    [product.slug, product.name, product.category, product.price, product.tagline, product.description, product.features, product.image]
  );
  const productId = result.insertId;

  // Inserir variantes
  for (const v of product.variants) {
    await db.execute(
      `INSERT INTO catalog_variants (product_id, color_name, color_hex, sku, supplier_code, cost, stock, image_url, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [productId, v.colorName, v.color, v.sku, v.supplierCode, v.cost, v.stock, v.image]
    );
    totalVariants++;
  }
  console.log(`  ✅ ${product.name} (${product.variants.length} variantes)`);
}

console.log(`\n🎉 Seed concluído! ${products.length} produtos e ${totalVariants} variantes inseridos.`);
await db.end();
