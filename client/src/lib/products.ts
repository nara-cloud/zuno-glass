export type ProductCategory = 'performance' | 'lifestyle' | 'limited';

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
  performance: { label: 'PERFORMANCE', description: 'Performance máxima para atletas' },
  lifestyle: { label: 'LIFESTYLE', description: 'Estilo e versatilidade para o dia a dia' },
  limited: { label: 'EDIÇÃO LIMITADA', description: 'Acabamento superior e materiais exclusivos' },
};

export const products: Product[] = [
  // === LINHA PERFORMANCE === R$ 189,90
  {
    id: 'zuno-veyron',
    name: 'ZUNO VEYRON',
    tagline: 'INVISÍVEL. IMPARÁVEL.',
    price: 189.90,
    description: 'Armação envolvente de perfil baixo para máxima aerodinâmica. Lentes multicolor com contraste aprimorado para treinos de alta intensidade.',
    features: ['Lentes Multicolor', 'Armação Envolvente', 'Grip Antiderrapante', 'Ventilação Lateral'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/APTVjOwFJLyOhAcb.webp',
    category: 'performance',
    variants: [
      { color: '#1a1a1a', colorName: 'Preto Fosco', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/APTVjOwFJLyOhAcb.webp' },
      { color: '#2563eb', colorName: 'Azul Multicolors', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/fCMcvkAETylkQKLl.webp' },
      { color: '#16a34a', colorName: 'Verde Multicolors', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/bkQGhaArWOdyfuGm.webp' },
      { color: '#eab308', colorName: 'Amarelo Multicolors', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/cHRtMuTQetcdzxBx.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-strix',
    name: 'ZUNO STRIX',
    tagline: 'DOMINE O TERRENO.',
    price: 189.90,
    description: 'Design angular e agressivo para trilhas e esportes outdoor. Proteção lateral reforçada e campo de visão ampliado.',
    features: ['Proteção Lateral', 'Campo de Visão Ampliado', 'Armação TR90', 'Lentes Intercambiáveis'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/rUnAQaFnVwfpcCZw.webp',
    category: 'performance',
    variants: [
      { color: '#1a1a1a', colorName: 'Preto Fosco', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/rUnAQaFnVwfpcCZw.webp' },
      { color: '#2563eb', colorName: 'Azul Multicolors', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/oaeNwuPidzyFZzDd.webp' },
      { color: '#854d0e', colorName: 'Marrom Verde', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/CyWoxEwiLUACWQXw.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-kaizen',
    name: 'ZUNO KAIZEN',
    tagline: 'VELOCIDADE SELVAGEM.',
    price: 189.90,
    description: 'Inspirado na natureza bruta. Lentes de alto contraste para ambientes de luz variável, ideal para corrida e ciclismo.',
    features: ['Alto Contraste', 'Proteção UV400', 'Hastes Flexíveis', 'Peso Ultra-leve'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/trxVpeGMgBkbnyZu.webp',
    category: 'performance',
    variants: [
      { color: '#1e3a5f', colorName: 'Azul Escuro / Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/trxVpeGMgBkbnyZu.webp' },
      { color: '#166534', colorName: 'Verde / Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/mHWYYWwkpbpuwFCf.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-vortexa',
    name: 'ZUNO VORTEXA',
    tagline: 'FOGO NA TRILHA.',
    price: 189.90,
    description: 'Atitude e performance em um design ousado. Padrão camuflado exclusivo para quem não se esconde.',
    features: ['Padrão Camuflado Exclusivo', 'Lentes Polarizadas', 'Armação Reforçada', 'Grip Nasal 3D'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IWenDvJdSBlUkfBe.webp',
    category: 'performance',
    variants: [
      { color: '#be185d', colorName: 'Rosa Escuro Camuflado', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IWenDvJdSBlUkfBe.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-noxis',
    name: 'ZUNO NOXIS',
    tagline: 'FLUIDEZ EM MOVIMENTO.',
    price: 189.90,
    description: 'Linhas suaves e aerodinâmicas para quem busca leveza absoluta. Design unissex com opções vibrantes.',
    features: ['Design Unissex', 'Armação Ultra-leve', 'Lentes Anti-reflexo', 'Ventilação Active-Flow'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IIEuNTGVJYVtNhee.webp',
    category: 'performance',
    variants: [
      { color: '#166534', colorName: 'Preto / Verde', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/IIEuNTGVJYVtNhee.webp' },
      { color: '#93c5fd', colorName: 'Branco / Azul Claro', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/XOWAvAeUKxjTTITL.webp' },
      { color: '#f472b6', colorName: 'Branco / Rosa', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/CPiDcxzCUZakQxSc.webp' },
    ],
    isNew: true,
  },

  // === LINHA LIFESTYLE === R$ 169,90
  {
    id: 'zuno-altis',
    name: 'ZUNO ALTIS',
    tagline: 'SOMBRA URBANA.',
    price: 169.90,
    description: 'Elegância italiana com DNA esportivo. Armação robusta e lentes escuras para dominar a cidade.',
    features: ['Lentes Escuras Premium', 'Armação Acetato', 'Dobradiças Reforçadas', 'Proteção UV400'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/kcwyxMaSdnhTPrbI.webp',
    category: 'lifestyle',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/kcwyxMaSdnhTPrbI.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-arven',
    name: 'ZUNO ARVEN',
    tagline: 'CORTE PRECISO.',
    price: 169.90,
    description: 'Geometria angular inspirada no diamante. Presença marcante para quem exige atenção.',
    features: ['Design Geométrico', 'Lentes Polarizadas', 'Armação Leve', 'Acabamento Premium'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/NNTbSxnTvcDFDsSS.webp',
    category: 'lifestyle',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/NNTbSxnTvcDFDsSS.webp' },
    ],
  },
  {
    id: 'zuno-kaori',
    name: 'ZUNO KAORI',
    tagline: 'ENERGIA PURA.',
    price: 169.90,
    description: 'Perfil arredondado com personalidade forte. Transição perfeita do treino para a rua.',
    features: ['Transição Treino-Rua', 'Lentes Anti-reflexo', 'Armação Flexível', 'Estojo Incluído'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/aksfQZUeelZUqYTB.webp',
    category: 'lifestyle',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/aksfQZUeelZUqYTB.webp' },
    ],
  },
  {
    id: 'zuno-venza',
    name: 'ZUNO VENZA',
    tagline: 'GOLPE DE ESTILO.',
    price: 169.90,
    description: 'Linhas femininas com atitude esportiva. Design oversized para máxima proteção e presença.',
    features: ['Design Oversized', 'Lentes Degradê', 'Armação Acetato', 'Proteção UV400'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/eWxVKgFdRqPppKgV.webp',
    category: 'lifestyle',
    variants: [
      { color: '#2563eb', colorName: 'Azul', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/eWxVKgFdRqPppKgV.webp' },
      { color: '#1a1a1a', colorName: 'Preto Degradê / Branco', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/rMjNHyklnEYtsqXg.webp' },
    ],
  },
  {
    id: 'zuno-mistral',
    name: 'ZUNO MISTRAL',
    tagline: 'CAMUFLAGEM URBANA.',
    price: 169.90,
    description: 'Padrão camuflado com toque feminino. Para quem se destaca mesmo tentando se esconder.',
    features: ['Padrão Camuflado', 'Armação Leve', 'Lentes Espelhadas', 'Design Feminino'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/roHIyPaALdrwIJWm.webp',
    category: 'lifestyle',
    variants: [
      { color: '#f472b6', colorName: 'Rosa Camuflado', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/roHIyPaALdrwIJWm.webp' },
    ],
  },
  {
    id: 'zuno-lumea',
    name: 'ZUNO LUMEA',
    tagline: 'RASTRO NO DESERTO.',
    price: 169.90,
    description: 'Tons terrosos e armação robusta. Inspirado em expedições, feito para a aventura do dia a dia.',
    features: ['Tons Terrosos', 'Armação Robusta', 'Lentes Marrom Degradê', 'Grip Antiderrapante'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/PUhJNzxlrMgBqtUw.webp',
    category: 'lifestyle',
    variants: [
      { color: '#854d0e', colorName: 'Marrom', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/PUhJNzxlrMgBqtUw.webp' },
    ],
  },
  {
    id: 'zuno-savik',
    name: 'ZUNO SAVIK',
    tagline: 'ACIMA DAS NUVENS.',
    price: 169.90,
    description: 'O clássico aviador reinventado com DNA ZUNO. Leveza extrema e estilo atemporal.',
    features: ['Design Aviador Clássico', 'Armação Ultra-leve', 'Lentes Polarizadas', 'Proteção UV400'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/LumkVuPKMYjQGpVh.webp',
    category: 'lifestyle',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/LumkVuPKMYjQGpVh.webp' },
    ],
  },
  {
    id: 'zuno-neroz',
    name: 'ZUNO NEROZ',
    tagline: 'VIDA COM ESTILO.',
    price: 169.90,
    description: 'Inspirado na arte toscana. Armação elegante para quem vive cada momento com intensidade.',
    features: ['Inspiração Toscana', 'Armação Acetato', 'Lentes Anti-reflexo', 'Design Clássico'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/DscTqYwlGTgnPRnr.webp',
    category: 'lifestyle',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/DscTqYwlGTgnPRnr.webp' },
    ],
  },
  {
    id: 'zuno-axiom',
    name: 'ZUNO AXIOM',
    tagline: 'BRISA DO PARAÍSO.',
    price: 169.90,
    description: 'Detalhes dourados e estilo descontraído. Perfeito para dias de sol e noites de verão.',
    features: ['Detalhes Dourados', 'Lentes Escuras', 'Armação Metal', 'Estilo Descontraído'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RzkSMwZgKttsoMsK.webp',
    category: 'lifestyle',
    variants: [
      { color: '#b8860b', colorName: 'Preto Dourado', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RzkSMwZgKttsoMsK.webp' },
    ],
  },
  {
    id: 'zuno-orvik',
    name: 'ZUNO ORVIK',
    tagline: 'GEOMETRIA PERFEITA.',
    price: 169.90,
    description: 'Formato hexagonal icónico com lentes degradê. Para quem vê o mundo de um ângulo diferente.',
    features: ['Formato Hexagonal', 'Lentes Marrom Degradê', 'Armação Metal', 'Design Icónico'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/OycOdSoWVVpWpNvg.webp',
    category: 'lifestyle',
    variants: [
      { color: '#854d0e', colorName: 'Marrom Degradê', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/OycOdSoWVVpWpNvg.webp' },
    ],
  },

  // === LINHA EDIÇÃO LIMITADA === R$ 169,90
  {
    id: 'zuno-apex',
    name: 'ZUNO APEX',
    tagline: 'FORÇA DOS DEUSES.',
    price: 169.90,
    description: 'Nomeado em honra ao deus da guerra. Armação premium com acabamento metálico e lentes de alta definição.',
    features: ['Acabamento Metálico', 'Lentes HD', 'Armação Titânio', 'Garantia Estendida'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sRpCcIwVVRMBgNYn.webp',
    category: 'limited',
    variants: [
      { color: '#000000', colorName: 'Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sRpCcIwVVRMBgNYn.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-titan',
    name: 'ZUNO TITAN',
    tagline: 'BRILHO ESCURO.',
    price: 169.90,
    description: 'Versão premium com lentes degradê e acabamento sofisticado. Luxo com atitude.',
    features: ['Lentes Degradê Premium', 'Acabamento Sofisticado', 'Armação Acetato Premium', 'Estojo Rígido'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RrYhGfuyTXhBETvZ.webp',
    category: 'limited',
    variants: [
      { color: '#1a1a1a', colorName: 'Preto Degradê', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RrYhGfuyTXhBETvZ.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-solaris',
    name: 'ZUNO SOLARIS',
    tagline: 'LUXO SEM LIMITES.',
    price: 169.90,
    description: 'Detalhes dourados e presença imponente. Para quem vive no topo e não aceita menos.',
    features: ['Detalhes Dourados', 'Lentes Premium', 'Armação Metal/Acetato', 'Acabamento Exclusivo'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/AyTmNWtwUdkVcPCb.webp',
    category: 'limited',
    variants: [
      { color: '#b8860b', colorName: 'Preto Dourado', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/AyTmNWtwUdkVcPCb.webp' },
    ],
    isNew: true,
  },
  {
    id: 'zuno-obsidian',
    name: 'ZUNO OBSIDIAN',
    tagline: 'FORJADO PARA DURAR.',
    price: 169.90,
    description: 'Construção premium com materiais de alta resistência. O companheiro que aguenta qualquer desafio.',
    features: ['Alta Resistência', 'Lentes Polarizadas', 'Armação Reforçada', 'Garantia Vitalícia'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/vWOZIdEYMAwIoqas.webp',
    category: 'limited',
    variants: [
      { color: '#854d0e', colorName: 'Marrom / Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/vWOZIdEYMAwIoqas.webp' },
    ],
  },
  {
    id: 'zuno-infinity-x',
    name: 'ZUNO INFINITY X',
    tagline: 'RITMO DOURADO.',
    price: 169.90,
    description: 'O espírito brasileiro em forma de óculos. Acabamento premium com detalhes que brilham.',
    features: ['Detalhes Dourados', 'Lentes Degradê', 'Armação Acetato Premium', 'Design Brasileiro'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sLqDplNhTucIsqbF.webp',
    category: 'limited',
    variants: [
      { color: '#b8860b', colorName: 'Preto Dourado', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/sLqDplNhTucIsqbF.webp' },
      { color: '#854d0e', colorName: 'Marrom Degradê / Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/bEXoVbxaSLthStpz.webp' },
      { color: '#f4a6c0', colorName: 'Marrom Degradê / Rosé', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/BpYhqeRqkzblMwLh.webp' },
    ],
    isNew: true,
  },

  // === LIFESTYLE (continuação) === Modelo removido: INFINITY MIRROR → substituído pelo ORVIK acima
  {
    id: 'zuno-infinity-mirror',
    name: 'ZUNO INFINITY MIRROR',
    tagline: 'REFLEXO INFINITO.',
    price: 169.90,
    description: 'Lentes espelhadas que refletem o mundo. Design futurista para quem está sempre à frente.',
    features: ['Lentes Espelhadas', 'Design Futurista', 'Armação Metal', 'Proteção UV400'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/FWbaSISkachUrCBN.webp',
    category: 'lifestyle',
    variants: [
      { color: '#c0c0c0', colorName: 'Prata Espelhado / Preto', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/FWbaSISkachUrCBN.webp' },
    ],
  },
];
