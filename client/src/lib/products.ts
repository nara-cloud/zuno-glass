export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  description: string;
  features: string[];
  image: string;
  category: 'performance' | 'lifestyle' | 'tech';
  colors: string[];
  isNew?: boolean;
}

export const products: Product[] = [
  {
    id: 'zuno-velocity-x1',
    name: 'VELOCITY X1',
    tagline: 'SPEED DEFINED',
    price: 499.90,
    description: 'Projetado para corredores de elite. O Velocity X1 oferece campo de visão expandido e ventilação aerodinâmica para evitar embaçamento em alta intensidade.',
    features: ['Lentes Fotocromáticas', 'Armação Ultra-leve TR90', 'Ventilação Active-Flow', 'Grip Antiderrapante'],
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/EMXsxYHHvPVwNiQM.webp',
    category: 'performance',
    colors: ['#CCFF00', '#000000', '#FF3333'],
    isNew: true
  },
  {
    id: 'zuno-hyper-vision',
    name: 'HYPER VISION',
    tagline: 'SEE THE UNSEEN',
    price: 549.90,
    description: 'Contraste aprimorado para ambientes de baixa luminosidade. Ideal para ciclismo noturno ou trilhas em florestas densas.',
    features: ['Tecnologia Night-Sight', 'Proteção UV400', 'Lentes Intercambiáveis', 'Ajuste Nasal 3D'],
    image: '/images/002.webp',
    category: 'tech',
    colors: ['#FFFFFF', '#000000'],
    isNew: true
  },
  {
    id: 'zuno-aero-blade',
    name: 'AERO BLADE',
    tagline: 'CUT THROUGH AIR',
    price: 429.90,
    description: 'Design minimalista sem aro inferior para máxima visibilidade e peso mínimo. Sinta-se como se não estivesse usando nada.',
    features: ['Lente Panorâmica', 'Hastes Flexíveis', 'Revestimento Hidrofóbico', 'Peso: 22g'],
    image: '/images/006.webp',
    category: 'performance',
    colors: ['#CCFF00', '#333333'],
  },
  {
    id: 'zuno-urban-drift',
    name: 'URBAN DRIFT',
    tagline: 'STREET READY',
    price: 389.90,
    description: 'Estilo agressivo para a selva de pedra. Proteção total contra reflexos urbanos e luz azul.',
    features: ['Lentes Polarizadas', 'Design Robusto', 'Dobradiças Reforçadas', 'Filtro de Luz Azul'],
    image: '/images/007.webp',
    category: 'lifestyle',
    colors: ['#000000', '#555555'],
  },
  {
    id: 'zuno-quantum-leap',
    name: 'QUANTUM LEAP',
    tagline: 'FUTURE IS NOW',
    price: 599.90,
    description: 'Nossa armação mais avançada. Composto de carbono forjado para durabilidade extrema e leveza incomparável.',
    features: ['Carbono Forjado', 'Lentes de Safira Sintética', 'Garantia Vitalícia', 'Estojo Rígido Premium'],
    image: '/images/008.webp',
    category: 'tech',
    colors: ['#111111'],
    isNew: true
  },
  {
    id: 'zuno-solar-flare',
    name: 'SOLAR FLARE',
    tagline: 'OWN THE SUN',
    price: 459.90,
    description: 'Proteção máxima contra o brilho intenso. Perfeito para esportes aquáticos e de neve.',
    features: ['Polarização Avançada', 'Flutuabilidade Positiva', 'Cordão de Segurança', 'Revestimento Espelhado'],
    image: '/images/009.webp',
    category: 'performance',
    colors: ['#FF9900', '#000000'],
  }
];
