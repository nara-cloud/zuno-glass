export type ProductCategory = 'sport' | 'urban' | 'premium' | 'lifestyle';

export interface ProductVariant {
  color: string;
  colorName: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  description: string;
  features: string[];
  image: string;
  category: ProductCategory;
  variants: ProductVariant[];
  isNew?: boolean;
}

export const categories: Record<ProductCategory, { label: string; description: string }> = {
  sport: { label: 'SPORT', description: 'Performance máxima para atletas' },
  urban: { label: 'URBAN', description: 'Estilo agressivo para o dia a dia' },
  premium: { label: 'PREMIUM', description: 'Acabamento superior e materiais nobres' },
  lifestyle: { label: 'LIFESTYLE', description: 'Versatilidade com atitude' },
};

export const products: Product[] = [
  // === SPORT LINE ===
  {
    id: 'zuno-prime-stealth',
    name: 'PRIME STEALTH',
    tagline: 'INVISÍVEL. IMPARÁVEL.',
    price: 0,
    description: 'Armação envolvente de perfil baixo para máxima aerodinâmica. Lentes multicolor com contraste aprimorado para treinos de alta intensidade.',
    features: ['Lentes Multicolor', 'Armação Envolvente', 'Grip Antiderrapante', 'Ventilação Lateral'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/APTVjOwFJLyOhAcb.webp',
    category: 'sport',
    variants: [
      { color: '#1a1a1a', colorName: 'Preto Fosco', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/APTVjOwFJLyOhAcb.webp' },
      { color: '#2563eb', colorName: 'Azul Multicolors', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/fCMcvkAETylkQKLl.webp' },
      { color: '#16a34a', colorName: 'Verde Multicolors', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/bkQGhaArWOdyfuGm.webp' },
      { color: '#eab308', colorName: 'Amarelo Multicolors', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/cHRtMuTQetcdzxBx.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-devon-apex',
    name: 'DEVON APEX',
    tagline: 'DOMINE O TERRENO.',
    price: 0,
    description: 'Design angular e agressivo para trilhas e esportes outdoor. Proteção lateral reforçada e campo de visão ampliado.',
    features: ['Proteção Lateral', 'Campo de Visão Ampliado', 'Armação TR90', 'Lentes Intercambiáveis'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/rUnAQaFnVwfpcCZw.webp',
    category: 'sport',
    variants: [
      { color: '#1a1a1a', colorName: 'Preto Fosco', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/rUnAQaFnVwfpcCZw.webp' },
      { color: '#2563eb', colorName: 'Azul Multicolors', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/oaeNwuPidzyFZzDd.webp' },
      { color: '#854d0e', colorName: 'Marrom Verde', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/CyWoxEwiLUACWQXw.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-madagascar-rush',
    name: 'MADAGASCAR RUSH',
    tagline: 'VELOCIDADE SELVAGEM.',
    price: 0,
    description: 'Inspirado na natureza bruta. Lentes de alto contraste para ambientes de luz variável, ideal para corrida e ciclismo.',
    features: ['Alto Contraste', 'Proteção UV400', 'Hastes Flexíveis', 'Peso Ultra-leve'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/trxVpeGMgBkbnyZu.webp',
    category: 'sport',
    variants: [
      { color: '#1e3a5f', colorName: 'Azul Escuro / Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/trxVpeGMgBkbnyZu.webp' },
      { color: '#166534', colorName: 'Verde / Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/mHWYYWwkpbpuwFCf.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-oregon-blaze',
    name: 'OREGON BLAZE',
    tagline: 'FOGO NA TRILHA.',
    price: 0,
    description: 'Atitude e performance em um design ousado. Padrão camuflado exclusivo para quem não se esconde.',
    features: ['Padrão Camuflado Exclusivo', 'Lentes Polarizadas', 'Armação Reforçada', 'Grip Nasal 3D'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IWenDvJdSBlUkfBe.webp',
    category: 'sport',
    variants: [
      { color: '#be185d', colorName: 'Rosa Escuro Camuflado', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IWenDvJdSBlUkfBe.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-jin-flow',
    name: 'JIN FLOW',
    tagline: 'FLUIDEZ EM MOVIMENTO.',
    price: 0,
    description: 'Linhas suaves e aerodinâmicas para quem busca leveza absoluta. Design unissex com opções vibrantes.',
    features: ['Design Unissex', 'Armação Ultra-leve', 'Lentes Anti-reflexo', 'Ventilação Active-Flow'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IIEuNTGVJYVtNhee.webp',
    category: 'sport',
    variants: [
      { color: '#166534', colorName: 'Preto / Verde', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IIEuNTGVJYVtNhee.webp' },
      { color: '#93c5fd', colorName: 'Branco / Azul Claro', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/XOWAvAeUKxjTTITL.webp' },
      { color: '#f472b6', colorName: 'Branco / Rosa', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/CPiDcxzCUZakQxSc.webp' },
    ],
    isNew: true,
  },

  // === URBAN LINE ===
  {
    id: 'zuno-verona-shadow',
    name: 'VERONA SHADOW',
    tagline: 'SOMBRA URBANA.',
    price: 0,
    description: 'Elegância italiana com DNA esportivo. Armação robusta e lentes escuras para dominar a cidade.',
    features: ['Lentes Escuras Premium', 'Armação Acetato', 'Dobradiças Reforçadas', 'Proteção UV400'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/kcwyxMaSdnhTPrbI.webp',
    category: 'urban',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/kcwyxMaSdnhTPrbI.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-diamond-edge',
    name: 'DIAMOND EDGE',
    tagline: 'CORTE PRECISO.',
    price: 0,
    description: 'Geometria angular inspirada no diamante. Presença marcante para quem exige atenção.',
    features: ['Design Geométrico', 'Lentes Polarizadas', 'Armação Leve', 'Acabamento Premium'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/NNTbSxnTvcDFDsSS.webp',
    category: 'urban',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/NNTbSxnTvcDFDsSS.webp' },
    ],
  },
  {
    id: 'zuno-harper-volt',
    name: 'HARPER VOLT',
    tagline: 'ENERGIA PURA.',
    price: 0,
    description: 'Perfil arredondado com personalidade forte. Transição perfeita do treino para a rua.',
    features: ['Transição Treino-Rua', 'Lentes Anti-reflexo', 'Armação Flexível', 'Estojo Incluído'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/aksfQZUeelZUqYTB.webp',
    category: 'urban',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/aksfQZUeelZUqYTB.webp' },
    ],
  },
  {
    id: 'zuno-lorena-strike',
    name: 'LORENA STRIKE',
    tagline: 'GOLPE DE ESTILO.',
    price: 0,
    description: 'Linhas femininas com atitude esportiva. Design oversized para máxima proteção e presença.',
    features: ['Design Oversized', 'Lentes Degradê', 'Armação Acetato', 'Proteção UV400'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/eWxVKgFdRqPppKgV.webp',
    category: 'urban',
    variants: [
      { color: '#2563eb', colorName: 'Azul', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/eWxVKgFdRqPppKgV.webp' },
      { color: '#1a1a1a', colorName: 'Preto Degradê / Branco', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/rMjNHyklnEYtsqXg.webp' },
    ],
  },
  {
    id: 'zuno-mia-camo',
    name: 'MIA CAMO',
    tagline: 'CAMUFLAGEM URBANA.',
    price: 0,
    description: 'Padrão camuflado com toque feminino. Para quem se destaca mesmo tentando se esconder.',
    features: ['Padrão Camuflado', 'Armação Leve', 'Lentes Espelhadas', 'Design Feminino'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/roHIyPaALdrwIJWm.webp',
    category: 'urban',
    variants: [
      { color: '#f472b6', colorName: 'Rosa Camuflado', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/roHIyPaALdrwIJWm.webp' },
    ],
  },
  {
    id: 'zuno-dune-tracker',
    name: 'DUNE TRACKER',
    tagline: 'RASTRO NO DESERTO.',
    price: 0,
    description: 'Tons terrosos e armação robusta. Inspirado em expedições, feito para a aventura do dia a dia.',
    features: ['Tons Terrosos', 'Armação Robusta', 'Lentes Marrom Degradê', 'Grip Antiderrapante'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/PUhJNzxlrMgBqtUw.webp',
    category: 'urban',
    variants: [
      { color: '#854d0e', colorName: 'Marrom', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/PUhJNzxlrMgBqtUw.webp' },
    ],
  },

  // === PREMIUM LINE ===
  {
    id: 'zuno-ares-titan',
    name: 'ARES TITAN',
    tagline: 'FORÇA DOS DEUSES.',
    price: 0,
    description: 'Nomeado em honra ao deus da guerra. Armação premium com acabamento metálico e lentes de alta definição.',
    features: ['Acabamento Metálico', 'Lentes HD', 'Armação Titânio', 'Garantia Estendida'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sRpCcIwVVRMBgNYn.webp',
    category: 'premium',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sRpCcIwVVRMBgNYn.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-diamond-noir',
    name: 'DIAMOND NOIR',
    tagline: 'BRILHO ESCURO.',
    price: 0,
    description: 'Versão premium do Diamond com lentes degradê e acabamento sofisticado. Luxo com atitude.',
    features: ['Lentes Degradê Premium', 'Acabamento Sofisticado', 'Armação Acetato Premium', 'Estojo Rígido'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RrYhGfuyTXhBETvZ.webp',
    category: 'premium',
    variants: [
      { color: '#1a1a1a', colorName: 'Preto Degradê', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RrYhGfuyTXhBETvZ.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-dubai-royal',
    name: 'DUBAI ROYAL',
    tagline: 'LUXO SEM LIMITES.',
    price: 0,
    description: 'Detalhes dourados e presença imponente. Para quem vive no topo e não aceita menos.',
    features: ['Detalhes Dourados', 'Lentes Premium', 'Armação Metal/Acetato', 'Acabamento Exclusivo'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/AyTmNWtwUdkVcPCb.webp',
    category: 'premium',
    variants: [
      { color: '#b8860b', colorName: 'Preto Dourado', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/AyTmNWtwUdkVcPCb.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-kansas-forge',
    name: 'KANSAS FORGE',
    tagline: 'FORJADO PARA DURAR.',
    price: 0,
    description: 'Construção premium com materiais de alta resistência. O companheiro que aguenta qualquer desafio.',
    features: ['Alta Resistência', 'Lentes Polarizadas', 'Armação Reforçada', 'Garantia Vitalícia'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/vWOZIdEYMAwIoqas.webp',
    category: 'premium',
    variants: [
      { color: '#854d0e', colorName: 'Marrom / Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/vWOZIdEYMAwIoqas.webp' },
    ],
  },
  {
    id: 'zuno-samba-gold',
    name: 'SAMBA GOLD',
    tagline: 'RITMO DOURADO.',
    price: 0,
    description: 'O espírito brasileiro em forma de óculos. Acabamento premium com detalhes que brilham.',
    features: ['Detalhes Dourados', 'Lentes Degradê', 'Armação Acetato Premium', 'Design Brasileiro'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sLqDplNhTucIsqbF.webp',
    category: 'premium',
    variants: [
      { color: '#b8860b', colorName: 'Preto Dourado', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sLqDplNhTucIsqbF.webp' },
      { color: '#854d0e', colorName: 'Marrom Degradê / Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/bEXoVbxaSLthStpz.webp' },
      { color: '#f4a6c0', colorName: 'Marrom Degradê / Rosé', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/BpYhqeRqkzblMwLh.webp' },
    ],
    isNew: true,
  },

  // === LIFESTYLE LINE ===
  {
    id: 'zuno-aviador-sky',
    name: 'AVIADOR SKY',
    tagline: 'ACIMA DAS NUVENS.',
    price: 0,
    description: 'O clássico aviador reinventado com DNA ZUNO. Leveza extrema e estilo atemporal.',
    features: ['Design Aviador Clássico', 'Armação Ultra-leve', 'Lentes Polarizadas', 'Proteção UV400'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/LumkVuPKMYjQGpVh.webp',
    category: 'lifestyle',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/LumkVuPKMYjQGpVh.webp' },
    ],
  },
  {
    id: 'zuno-florenca-vita',
    name: 'FLORENÇA VITA',
    tagline: 'VIDA COM ESTILO.',
    price: 0,
    description: 'Inspirado na arte toscana. Armação elegante para quem vive cada momento com intensidade.',
    features: ['Inspiração Toscana', 'Armação Acetato', 'Lentes Anti-reflexo', 'Design Clássico'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/DscTqYwlGTgnPRnr.webp',
    category: 'lifestyle',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/DscTqYwlGTgnPRnr.webp' },
    ],
  },
  {
    id: 'zuno-hawai-breeze',
    name: 'HAWAI BREEZE',
    tagline: 'BRISA DO PARAÍSO.',
    price: 0,
    description: 'Detalhes dourados e estilo descontraído. Perfeito para dias de sol e noites de verão.',
    features: ['Detalhes Dourados', 'Lentes Escuras', 'Armação Metal', 'Estilo Descontraído'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RzkSMwZgKttsoMsK.webp',
    category: 'lifestyle',
    variants: [
      { color: '#b8860b', colorName: 'Preto Dourado', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RzkSMwZgKttsoMsK.webp' },
    ],
  },
  {
    id: 'zuno-hexagonal-prism',
    name: 'HEXAGONAL PRISM',
    tagline: 'GEOMETRIA PERFEITA.',
    price: 0,
    description: 'Formato hexagonal icónico com lentes degradê. Para quem vê o mundo de um ângulo diferente.',
    features: ['Formato Hexagonal', 'Lentes Marrom Degradê', 'Armação Metal', 'Design Icónico'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/OycOdSoWVVpWpNvg.webp',
    category: 'lifestyle',
    variants: [
      { color: '#854d0e', colorName: 'Marrom Degradê', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/OycOdSoWVVpWpNvg.webp' },
    ],
  },
  {
    id: 'zuno-infinity-mirror',
    name: 'INFINITY MIRROR',
    tagline: 'REFLEXO INFINITO.',
    price: 0,
    description: 'Lentes espelhadas que refletem o mundo. Design futurista para quem está sempre à frente.',
    features: ['Lentes Espelhadas', 'Design Futurista', 'Armação Metal', 'Proteção UV400'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/FWbaSISkachUrCBN.webp',
    category: 'lifestyle',
    variants: [
      { color: '#c0c0c0', colorName: 'Prata Espelhado / Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/FWbaSISkachUrCBN.webp' },
    ],
  },
];
