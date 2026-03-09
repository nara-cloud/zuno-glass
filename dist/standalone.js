var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog
});
var IMG, catalog;
var init_catalog = __esm({
  "shared/catalog.ts"() {
    "use strict";
    IMG = "/images/products/";
    catalog = [
      // === LINHA PERFORMANCE ===
      {
        id: "zuno-prime-preto-fosco",
        name: "ZUNO PRIME PRETO FOSCO",
        tagline: "INVIS\xCDVEL. IMPAR\xC1VEL.",
        price: 189.9,
        description: "Arma\xE7\xE3o esportiva m\xE1scara de perfil baixo para m\xE1xima aerodin\xE2mica. Lentes preto fosco com prote\xE7\xE3o UV400 para treinos de alta intensidade.",
        features: ["Lentes Preto Fosco", "Arma\xE7\xE3o M\xE1scara", "Grip Antiderrapante", "Prote\xE7\xE3o UV400"],
        image: `${IMG}Prime  Preto Fosco.webp`,
        category: "performance",
        variants: [
          { color: "#1a1a1a", colorName: "Preto Fosco", image: `${IMG}Prime  Preto Fosco.webp` }
        ],
        isNew: true,
        stock: 8
      },
      {
        id: "zuno-prime-azul-multicolors",
        name: "ZUNO PRIME AZUL MULTICOLORS",
        tagline: "INVIS\xCDVEL. IMPAR\xC1VEL.",
        price: 189.9,
        description: "Arma\xE7\xE3o esportiva m\xE1scara com lentes azul multicolors espelhadas. Alta performance para corridas e treinos ao ar livre.",
        features: ["Lentes Azul Multicolors", "Arma\xE7\xE3o M\xE1scara", "Grip Antiderrapante", "Prote\xE7\xE3o UV400"],
        image: `${IMG}Prime  Azul Multicolors Preto.webp`,
        category: "performance",
        variants: [
          { color: "#2563eb", colorName: "Azul Multicolors Preto", image: `${IMG}Prime  Azul Multicolors Preto.webp` }
        ],
        isNew: true,
        stock: 4
      },
      {
        id: "zuno-prime-verde-multicolors",
        name: "ZUNO PRIME VERDE MULTICOLORS",
        tagline: "INVIS\xCDVEL. IMPAR\xC1VEL.",
        price: 189.9,
        description: "Arma\xE7\xE3o esportiva m\xE1scara com lentes verde multicolors. M\xE1xima visibilidade para treinos de alta intensidade.",
        features: ["Lentes Verde Multicolors", "Arma\xE7\xE3o M\xE1scara", "Grip Antiderrapante", "Prote\xE7\xE3o UV400"],
        image: `${IMG}Prime   Verde Multicolors Cinza Azul.webp`,
        category: "performance",
        variants: [
          { color: "#16a34a", colorName: "Verde Multicolors Cinza Azul", image: `${IMG}Prime   Verde Multicolors Cinza Azul.webp` }
        ],
        isNew: true,
        stock: 4
      },
      {
        id: "zuno-prime-amarelo-multicolors",
        name: "ZUNO PRIME AMARELO MULTICOLORS",
        tagline: "INVIS\xCDVEL. IMPAR\xC1VEL.",
        price: 189.9,
        description: "Arma\xE7\xE3o esportiva m\xE1scara com lentes amarelo multicolors de alto contraste. Ideal para ciclismo e corrida.",
        features: ["Lentes Amarelo Multicolors", "Arma\xE7\xE3o M\xE1scara", "Grip Antiderrapante", "Prote\xE7\xE3o UV400"],
        image: `${IMG}Prime Amarelo Multicolors Branco Preto.webp`,
        category: "performance",
        variants: [
          { color: "#eab308", colorName: "Amarelo Multicolors Branco Preto", image: `${IMG}Prime Amarelo Multicolors Branco Preto.webp` }
        ],
        isNew: true,
        stock: 4
      },
      {
        id: "zuno-devon-preto-fosco",
        name: "ZUNO DEVON PRETO FOSCO",
        tagline: "DOMINE O TERRENO.",
        price: 189.9,
        description: "\xD3culos esportivo m\xE1scara Devon com arma\xE7\xE3o injetada e lentes preto fosco. Design agressivo para quem n\xE3o para.",
        features: ["Lentes Preto Fosco", "Arma\xE7\xE3o Injetada", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Flex\xEDvel"],
        image: `${IMG}Devon  Preto Fosco.webp`,
        category: "performance",
        variants: [
          { color: "#1a1a1a", colorName: "Preto Fosco", image: `${IMG}Devon  Preto Fosco.webp` }
        ],
        isNew: true,
        stock: 2
      },
      {
        id: "zuno-devon-azul-multicolors",
        name: "ZUNO DEVON AZUL MULTICOLORS",
        tagline: "DOMINE O TERRENO.",
        price: 189.9,
        description: "\xD3culos esportivo m\xE1scara Devon com lentes azul multicolors transparente cinza. Estilo e performance em um s\xF3.",
        features: ["Lentes Azul Multicolors", "Arma\xE7\xE3o Injetada", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Flex\xEDvel"],
        image: `${IMG}Devon  Azul Multicolors Transparente Cinza.webp`,
        category: "performance",
        variants: [
          { color: "#2563eb", colorName: "Azul Multicolors Transparente Cinza", image: `${IMG}Devon  Azul Multicolors Transparente Cinza.webp` }
        ],
        isNew: true,
        stock: 4
      },
      {
        id: "zuno-devon-marrom-verde",
        name: "ZUNO DEVON MARROM VERDE",
        tagline: "DOMINE O TERRENO.",
        price: 189.9,
        description: "\xD3culos esportivo m\xE1scara Devon com lentes marrom verde. Para quem busca performance com estilo \xFAnico.",
        features: ["Lentes Marrom Verde", "Arma\xE7\xE3o Injetada", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Flex\xEDvel"],
        image: `${IMG}Devon  Marrom Verde.webp`,
        category: "performance",
        variants: [
          { color: "#92400e", colorName: "Marrom Verde", image: `${IMG}Devon  Marrom Verde.webp` }
        ],
        isNew: true,
        stock: 5
      },
      {
        id: "zuno-madagascar-azul-escuro",
        name: "ZUNO MADAGASCAR AZUL ESCURO",
        tagline: "VELOCIDADE SELVAGEM.",
        price: 189.9,
        description: "\xD3culos esportivo Madagascar com lentes azul escuro preto. Lentes polarizadas de alta defini\xE7\xE3o para m\xE1xima clareza visual.",
        features: ["Lentes Azul Escuro Preto", "Arma\xE7\xE3o Injetada", "Prote\xE7\xE3o UV400", "Antirreflexo"],
        image: `${IMG}Madagascar Azul Escuro Preto.webp`,
        category: "performance",
        variants: [
          { color: "#1e40af", colorName: "Azul Escuro Preto", image: `${IMG}Madagascar Azul Escuro Preto.webp` }
        ],
        stock: 4
      },
      {
        id: "zuno-madagascar-verde-preto",
        name: "ZUNO MADAGASCAR VERDE PRETO",
        tagline: "VELOCIDADE SELVAGEM.",
        price: 189.9,
        description: "\xD3culos esportivo Madagascar com lentes verde preto. Alta performance para treinos ao ar livre.",
        features: ["Lentes Verde Preto", "Arma\xE7\xE3o Injetada", "Prote\xE7\xE3o UV400", "Antirreflexo"],
        image: `${IMG}Madagascar Verde Preto.webp`,
        category: "performance",
        variants: [
          { color: "#16a34a", colorName: "Verde Preto", image: `${IMG}Madagascar Verde Preto.webp` }
        ],
        stock: 3
      },
      {
        id: "zuno-infinity-prata-espelhado",
        name: "ZUNO INFINITY PRATA ESPELHADO",
        tagline: "REFLEXO INFINITO.",
        price: 189.9,
        description: "\xD3culos esportivo Infinity com lentes prata espelhado preto. Design futurista para quem est\xE1 sempre \xE0 frente.",
        features: ["Lentes Prata Espelhado", "Arma\xE7\xE3o Injetada", "Prote\xE7\xE3o UV400", "Design Futurista"],
        image: `${IMG}Infinity  Prata Espelhado Preto.webp`,
        category: "performance",
        variants: [
          { color: "#c0c0c0", colorName: "Prata Espelhado Preto", image: `${IMG}Infinity  Prata Espelhado Preto.webp` }
        ],
        isNew: true,
        stock: 3
      },
      {
        id: "zuno-jin-preto-verde",
        name: "ZUNO JIN PRETO VERDE",
        tagline: "FLUIDEZ EM MOVIMENTO.",
        price: 189.9,
        description: "\xD3culos esportivo m\xE1scara Jin com lentes preto/verde. Arma\xE7\xE3o ultraleve para treinos longos sem desconforto.",
        features: ["Lentes Preto Verde", "Ultra Leve", "Ventila\xE7\xE3o Avan\xE7ada", "Grip Premium"],
        image: `${IMG}Jin  Preto Verde.webp`,
        category: "performance",
        variants: [
          { color: "#1a1a1a", colorName: "Preto Verde", image: `${IMG}Jin  Preto Verde.webp` }
        ],
        stock: 2
      },
      {
        id: "zuno-jin-branco-rosa",
        name: "ZUNO JIN BRANCO ROSA",
        tagline: "FLUIDEZ EM MOVIMENTO.",
        price: 189.9,
        description: "\xD3culos esportivo m\xE1scara Jin com lentes branco/rosa. Estilo e performance para atletas que querem se destacar.",
        features: ["Lentes Branco Rosa", "Ultra Leve", "Ventila\xE7\xE3o Avan\xE7ada", "Grip Premium"],
        image: `${IMG}Jin BrancoRosa.webp`,
        category: "performance",
        variants: [
          { color: "#f9a8d4", colorName: "Branco Rosa", image: `${IMG}Jin BrancoRosa.webp` }
        ],
        stock: 3
      },
      {
        id: "zuno-jin-branco-azul-claro",
        name: "ZUNO JIN BRANCO AZUL CLARO",
        tagline: "FLUIDEZ EM MOVIMENTO.",
        price: 189.9,
        description: "\xD3culos esportivo m\xE1scara Jin com lentes branco/azul claro. Ideal para treinos ao ar livre com prote\xE7\xE3o total.",
        features: ["Lentes Branco Azul Claro", "Ultra Leve", "Ventila\xE7\xE3o Avan\xE7ada", "Grip Premium"],
        image: `${IMG}Jin  Branco Azul Claro.webp`,
        category: "performance",
        variants: [
          { color: "#bfdbfe", colorName: "Branco Azul Claro", image: `${IMG}Jin  Branco Azul Claro.webp` }
        ],
        stock: 2
      },
      {
        id: "zuno-kansas-marrom-preto",
        name: "ZUNO KANSAS MARROM PRETO",
        tagline: "FOR\xC7A DOS DEUSES.",
        price: 169.9,
        description: "\xD3culos retangular Kansas Premium 3.0 com lentes marrom preto em metal. Acabamento premium para quem exige o melhor.",
        features: ["Lentes Marrom Preto", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400", "Acabamento Premium"],
        image: `${IMG}Kansas Premium 3.0  Marrom Preto.webp`,
        category: "performance",
        variants: [
          { color: "#92400e", colorName: "Marrom Preto", image: `${IMG}Kansas Premium 3.0  Marrom Preto.webp` }
        ],
        isNew: true,
        stock: 2
      },
      // === LINHA LIFESTYLE ===
      {
        id: "zuno-ares-preto",
        name: "ZUNO ARES PRETO",
        tagline: "CORTE PRECISO.",
        price: 169.9,
        description: "\xD3culos premium Ares com arma\xE7\xE3o metal preto. Linhas geom\xE9tricas e design minimalista para quem valoriza estilo.",
        features: ["Design Minimalista", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400", "Lentes Escuras"],
        image: `${IMG}Ares Premium  Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto", image: `${IMG}Ares Premium  Preto.webp` }
        ],
        isNew: true,
        stock: 3
      },
      {
        id: "zuno-verona-preto",
        name: "ZUNO VERONA PRETO",
        tagline: "SOMBRA URBANA.",
        price: 169.9,
        description: "\xD3culos redondo blogueira Verona com arma\xE7\xE3o metal preto. Estilo urbano cl\xE1ssico com prote\xE7\xE3o total.",
        features: ["Formato Redondo", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400", "Lentes Escuras"],
        image: `${IMG}Verona Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto", image: `${IMG}Verona Preto.webp` }
        ],
        stock: 3
      },
      {
        id: "zuno-lorena-azul",
        name: "ZUNO LORENA AZUL",
        tagline: "GOLPE DE ESTILO.",
        price: 169.9,
        description: "\xD3culos maxi quadrado blogueira Lorena com lentes azul em acetato. Presen\xE7a marcante para qualquer ocasi\xE3o.",
        features: ["Formato Maxi Quadrado", "Lentes Azul", "Arma\xE7\xE3o Acetato", "Prote\xE7\xE3o UV400"],
        image: `${IMG}Lorena  Azul.webp`,
        category: "lifestyle",
        variants: [
          { color: "#2563eb", colorName: "Azul", image: `${IMG}Lorena  Azul.webp` }
        ],
        stock: 3
      },
      {
        id: "zuno-lorena-preto-degrade",
        name: "ZUNO LORENA PRETO DEGRAD\xCA",
        tagline: "GOLPE DE ESTILO.",
        price: 169.9,
        description: "\xD3culos maxi quadrado blogueira Lorena com lentes preto degrad\xEA branco em acetato. Eleg\xE2ncia e atitude.",
        features: ["Formato Maxi Quadrado", "Lentes Preto Degrad\xEA Branco", "Arma\xE7\xE3o Acetato", "Prote\xE7\xE3o UV400"],
        image: `${IMG}Lorena Preto Degrad\xEA Branco.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto Degrad\xEA Branco", image: `${IMG}Lorena Preto Degrad\xEA Branco.webp` }
        ],
        stock: 3
      },
      {
        id: "zuno-harper-preto",
        name: "ZUNO HARPER PRETO",
        tagline: "VIDA COM ESTILO.",
        price: 169.9,
        description: "\xD3culos maxi hexagonal blogueira Harper com arma\xE7\xE3o metal preto. Cl\xE1ssico reinventado para o lifestyle urbano.",
        features: ["Formato Maxi Hexagonal", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400", "Lentes Escuras"],
        image: `${IMG}Harper  Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto", image: `${IMG}Harper  Preto.webp` }
        ],
        stock: 4
      },
      {
        id: "zuno-hawai-preto-dourado",
        name: "ZUNO HAWAI PRETO DOURADO",
        tagline: "BRISA DO PARA\xCDSO.",
        price: 169.9,
        description: "\xD3culos retangular Hawai com arma\xE7\xE3o metal preto dourado. Detalhes dourados para quem vive com estilo.",
        features: ["Detalhes Dourados", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400", "Lentes Premium"],
        image: `${IMG}Hawai   Preto Dourado.webp`,
        category: "lifestyle",
        variants: [
          { color: "#b8860b", colorName: "Preto Dourado", image: `${IMG}Hawai   Preto Dourado.webp` }
        ],
        isNew: true,
        stock: 3
      },
      {
        id: "zuno-diamond-premium-preto-degrade",
        name: "ZUNO DIAMOND PREMIUM PRETO DEGRAD\xCA",
        tagline: "BRILHO ESCURO.",
        price: 169.9,
        description: "\xD3culos retangular Diamond Premium com lentes preto degrad\xEA injetado. Luxo com atitude para o dia a dia.",
        features: ["Lentes Preto Degrad\xEA", "Arma\xE7\xE3o Injetada", "Prote\xE7\xE3o UV400", "Acabamento Premium"],
        image: `${IMG}Diamond Premium  Preto Degrad\xEA.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto Degrad\xEA", image: `${IMG}Diamond Premium  Preto Degrad\xEA.webp` }
        ],
        isNew: true,
        stock: 3
      },
      {
        id: "zuno-dubai-preto-dourado",
        name: "ZUNO DUBAI PRETO DOURADO",
        tagline: "LUXO SEM LIMITES.",
        price: 169.9,
        description: "\xD3culos blogueira hexagonal Dubai Premium com arma\xE7\xE3o metal preto dourado/preto. Para quem vive no topo.",
        features: ["Detalhes Dourados", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400", "Acabamento Exclusivo"],
        image: `${IMG}Dubai Premium Preto Dourado Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#b8860b", colorName: "Preto Dourado/Preto", image: `${IMG}Dubai Premium Preto Dourado Preto.webp` }
        ],
        isNew: true,
        stock: 2
      },
      {
        id: "zuno-hexagonal-marrom-degrade",
        name: "ZUNO HEXAGONAL MARROM DEGRAD\xCA",
        tagline: "GEOMETRIA PERFEITA.",
        price: 169.9,
        description: "\xD3culos redondo hexagonal B 2.0 com lentes marrom degrad\xEA em metal. Design ic\xF4nico para personalidades marcantes.",
        features: ["Formato Hexagonal", "Lentes Marrom Degrad\xEA", "Arma\xE7\xE3o Metal", "Design Ic\xF4nico"],
        image: `${IMG}Hexagonal B 2.0  Marrom Degrad\xEA.webp`,
        category: "lifestyle",
        variants: [
          { color: "#854d0e", colorName: "Marrom Degrad\xEA", image: `${IMG}Hexagonal B 2.0  Marrom Degrad\xEA.webp` }
        ],
        stock: 2
      },
      {
        id: "zuno-florenca-preto",
        name: "ZUNO FLOREN\xC7A PRETO",
        tagline: "FORJADO PARA DURAR.",
        price: 169.9,
        description: "\xD3culos redondo Floren\xE7a 2.0 com arma\xE7\xE3o metal preto. Constru\xE7\xE3o premium para quem exige qualidade e estilo.",
        features: ["Formato Redondo", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400", "Alta Resist\xEAncia"],
        image: `${IMG}Floren\xE7a 2.0  Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto", image: `${IMG}Floren\xE7a 2.0  Preto.webp` }
        ],
        stock: 2
      },
      {
        id: "zuno-samba-preto-dourado",
        name: "ZUNO SAMBA PRETO DOURADO",
        tagline: "RITMO DOURADO.",
        price: 169.9,
        description: "\xD3culos retangular Samba com arma\xE7\xE3o metal preto/dourado. O esp\xEDrito brasileiro em forma de \xF3culos.",
        features: ["Detalhes Dourados", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400", "Design Brasileiro"],
        image: `${IMG}Samba  Preto Dourado.webp`,
        category: "lifestyle",
        variants: [
          { color: "#b8860b", colorName: "Preto Dourado", image: `${IMG}Samba  Preto Dourado.webp` }
        ],
        isNew: true,
        stock: 2
      },
      {
        id: "zuno-samba-marrom-rose",
        name: "ZUNO SAMBA MARROM ROSE",
        tagline: "RITMO DOURADO.",
        price: 169.9,
        description: "\xD3culos retangular Samba com lentes marrom degrad\xEA rose em metal. Feminilidade e estilo em cada detalhe.",
        features: ["Lentes Marrom Degrad\xEA Rose", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400", "Design Exclusivo"],
        image: `${IMG}Samba  Marrom Degrad\xEA Rose.webp`,
        category: "lifestyle",
        variants: [
          { color: "#f4a6c0", colorName: "Marrom Degrad\xEA Rose", image: `${IMG}Samba  Marrom Degrad\xEA Rose.webp` }
        ],
        isNew: true,
        stock: 2
      },
      {
        id: "zuno-samba-marrom-preto",
        name: "ZUNO SAMBA MARROM PRETO",
        tagline: "RITMO DOURADO.",
        price: 169.9,
        description: "\xD3culos retangular Samba com lentes marrom degrad\xEA preto em metal. Sofistica\xE7\xE3o para o dia a dia.",
        features: ["Lentes Marrom Degrad\xEA Preto", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400", "Design Exclusivo"],
        image: `${IMG}Samba Marrom Degrad\xEA Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#92400e", colorName: "Marrom Degrad\xEA Preto", image: `${IMG}Samba Marrom Degrad\xEA Preto.webp` }
        ],
        isNew: true,
        stock: 2
      },
      {
        id: "zuno-diamond-preto",
        name: "ZUNO DIAMOND PRETO",
        tagline: "ESTILO URBANO.",
        price: 169.9,
        description: "\xD3culos blogueira retangular Diamond com arma\xE7\xE3o injetada preto. Estilo discreto com prote\xE7\xE3o total para o dia a dia.",
        features: ["Arma\xE7\xE3o Injetada", "Lentes Escuras", "Prote\xE7\xE3o UV400", "Design Urbano"],
        image: `${IMG}Diamond  Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto", image: `${IMG}Diamond  Preto.webp` }
        ],
        stock: 3
      },
      {
        id: "zuno-dune-marrom",
        name: "ZUNO DUNE MARROM",
        tagline: "CAMUFLAGEM URBANA.",
        price: 169.9,
        description: "\xD3culos redondo cl\xE1ssico Dune com lentes marrom em metal. Estilo atemporal para qualquer ocasi\xE3o.",
        features: ["Formato Redondo", "Lentes Marrom", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400"],
        image: `${IMG}Dune  Marrom.webp`,
        category: "lifestyle",
        variants: [
          { color: "#92400e", colorName: "Marrom", image: `${IMG}Dune  Marrom.webp` }
        ],
        stock: 3
      },
      {
        id: "zuno-aviador-light-preto",
        name: "ZUNO AVIADOR LIGHT PRETO",
        tagline: "ACIMA DAS NUVENS.",
        price: 169.9,
        description: "\xD3culos cl\xE1ssico aviador Light com arma\xE7\xE3o metal preto. Vis\xE3o privilegiada com o estilo atemporal do aviador.",
        features: ["Formato Aviador", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400", "Design Cl\xE1ssico"],
        image: `${IMG}Aviador Light  Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto", image: `${IMG}Aviador Light  Preto.webp` }
        ],
        stock: 4
      },
      {
        id: "zuno-mia-rosa-camuflado",
        name: "ZUNO MIA ROSA CAMUFLADO",
        tagline: "ENERGIA PURA.",
        price: 169.9,
        description: "\xD3culos oval Mia com lentes rosa camuflado em acetato. Cores vibrantes para quem n\xE3o passa despercebido.",
        features: ["Formato Oval", "Lentes Rosa Camuflado", "Arma\xE7\xE3o Acetato", "Prote\xE7\xE3o UV400"],
        image: `${IMG}Mia  Rosa Camuflado.webp`,
        category: "lifestyle",
        variants: [
          { color: "#ec4899", colorName: "Rosa Camuflado", image: `${IMG}Mia  Rosa Camuflado.webp` }
        ],
        stock: 3
      },
      {
        id: "zuno-oregon-rosa-escuro",
        name: "ZUNO OREGON ROSA ESCURO",
        tagline: "FOGO NA TRILHA.",
        price: 169.9,
        description: "\xD3culos maxi aviador Oregon 2.0 com lentes rosa escuro camuflado em acetato. Para quem quer performance com estilo.",
        features: ["Formato Maxi Aviador", "Lentes Rosa Escuro Camuflado", "Arma\xE7\xE3o Acetato", "Prote\xE7\xE3o UV400"],
        image: `${IMG}Oregon 2.0  Rosa Escuro Camuflado.webp`,
        category: "lifestyle",
        variants: [
          { color: "#be185d", colorName: "Rosa Escuro Camuflado", image: `${IMG}Oregon 2.0  Rosa Escuro Camuflado.webp` }
        ],
        stock: 3
      }
    ];
  }
});

// shared/shipping.ts
var shipping_exports = {};
__export(shipping_exports, {
  calculateShipping: () => calculateShipping,
  formatCep: () => formatCep,
  isValidCep: () => isValidCep
});
function calculateShipping(cep, _cartTotal) {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) {
    return null;
  }
  const cepNumber = parseInt(cleanCep, 10);
  const freeCity = FREE_SHIPPING_CITIES.find(
    (c) => cepNumber >= c.start && cepNumber <= c.end
  );
  if (freeCity) {
    const regionInfo2 = CEP_REGIONS.find(
      (r) => cepNumber >= r.start && cepNumber <= r.end
    );
    const minDays = regionInfo2?.minDays ?? 3;
    const maxDays = regionInfo2?.maxDays ?? 5;
    return {
      region: freeCity.city,
      price: 0,
      estimateMin: minDays,
      estimateMax: maxDays,
      freeShipping: true,
      formattedPrice: "Gr\xE1tis",
      estimateText: `${minDays} a ${maxDays} dias \xFAteis`
    };
  }
  const regionInfo = CEP_REGIONS.find(
    (r) => cepNumber >= r.start && cepNumber <= r.end
  );
  if (!regionInfo) {
    return {
      region: "Brasil",
      price: 24.9,
      estimateMin: 5,
      estimateMax: 12,
      freeShipping: false,
      formattedPrice: "R$ 24,90",
      estimateText: "5 a 12 dias \xFAteis"
    };
  }
  return {
    region: regionInfo.region,
    price: regionInfo.price,
    estimateMin: regionInfo.minDays,
    estimateMax: regionInfo.maxDays,
    freeShipping: false,
    formattedPrice: `R$ ${regionInfo.price.toFixed(2).replace(".", ",")}`,
    estimateText: `${regionInfo.minDays} a ${regionInfo.maxDays} dias \xFAteis`
  };
}
function isValidCep(cep) {
  const cleanCep = cep.replace(/\D/g, "");
  return cleanCep.length === 8 && /^\d{8}$/.test(cleanCep);
}
function formatCep(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
var FREE_SHIPPING_CITIES, CEP_REGIONS;
var init_shipping = __esm({
  "shared/shipping.ts"() {
    "use strict";
    FREE_SHIPPING_CITIES = [
      { start: 563e5, end: 56354999, city: "Petrolina \u2014 PE" },
      { start: 489e5, end: 48924999, city: "Juazeiro \u2014 BA" }
    ];
    CEP_REGIONS = [
      // São Paulo Capital e Grande SP
      { start: 1e6, end: 9999999, region: "S\xE3o Paulo \u2014 Capital e Grande SP", price: 12.9, minDays: 2, maxDays: 4 },
      // São Paulo Interior
      { start: 11e6, end: 19999999, region: "S\xE3o Paulo \u2014 Interior", price: 12.9, minDays: 3, maxDays: 6 },
      // Rio de Janeiro
      { start: 2e7, end: 28999999, region: "Rio de Janeiro", price: 14.9, minDays: 3, maxDays: 6 },
      // Espírito Santo
      { start: 29e6, end: 29999999, region: "Esp\xEDrito Santo", price: 16.9, minDays: 4, maxDays: 7 },
      // Minas Gerais
      { start: 3e7, end: 39999999, region: "Minas Gerais", price: 14.9, minDays: 3, maxDays: 7 },
      // Bahia
      { start: 4e7, end: 48999999, region: "Bahia", price: 19.9, minDays: 5, maxDays: 9 },
      // Sergipe
      { start: 49e6, end: 49999999, region: "Sergipe", price: 22.9, minDays: 5, maxDays: 9 },
      // Pernambuco
      { start: 5e7, end: 56999999, region: "Pernambuco", price: 22.9, minDays: 5, maxDays: 10 },
      // Alagoas
      { start: 57e6, end: 57999999, region: "Alagoas", price: 22.9, minDays: 5, maxDays: 10 },
      // Paraíba
      { start: 58e6, end: 58999999, region: "Para\xEDba", price: 22.9, minDays: 5, maxDays: 10 },
      // Rio Grande do Norte
      { start: 59e6, end: 59999999, region: "Rio Grande do Norte", price: 22.9, minDays: 5, maxDays: 10 },
      // Ceará
      { start: 6e7, end: 63999999, region: "Cear\xE1", price: 24.9, minDays: 6, maxDays: 10 },
      // Piauí
      { start: 64e6, end: 64999999, region: "Piau\xED", price: 24.9, minDays: 6, maxDays: 10 },
      // Maranhão
      { start: 65e6, end: 65999999, region: "Maranh\xE3o", price: 24.9, minDays: 6, maxDays: 12 },
      // Pará
      { start: 66e6, end: 68899999, region: "Par\xE1", price: 29.9, minDays: 7, maxDays: 12 },
      // Amapá
      { start: 689e5, end: 68999999, region: "Amap\xE1", price: 34.9, minDays: 8, maxDays: 14 },
      // Amazonas / Roraima
      { start: 69e6, end: 69399999, region: "Amazonas", price: 34.9, minDays: 8, maxDays: 14 },
      { start: 693e5, end: 69399999, region: "Roraima", price: 34.9, minDays: 8, maxDays: 14 },
      // Acre
      { start: 699e5, end: 69999999, region: "Acre", price: 34.9, minDays: 8, maxDays: 14 },
      // Distrito Federal / Goiás
      { start: 7e7, end: 76799999, region: "Distrito Federal / Goi\xE1s", price: 16.9, minDays: 4, maxDays: 8 },
      // Tocantins
      { start: 77e6, end: 77999999, region: "Tocantins", price: 24.9, minDays: 6, maxDays: 10 },
      // Mato Grosso
      { start: 78e6, end: 78899999, region: "Mato Grosso", price: 22.9, minDays: 5, maxDays: 10 },
      // Mato Grosso do Sul
      { start: 79e6, end: 79999999, region: "Mato Grosso do Sul", price: 19.9, minDays: 5, maxDays: 9 },
      // Paraná
      { start: 8e7, end: 87999999, region: "Paran\xE1", price: 14.9, minDays: 3, maxDays: 6 },
      // Santa Catarina
      { start: 88e6, end: 89999999, region: "Santa Catarina", price: 14.9, minDays: 3, maxDays: 7 },
      // Rio Grande do Sul
      { start: 9e7, end: 99999999, region: "Rio Grande do Sul", price: 16.9, minDays: 4, maxDays: 7 }
    ];
  }
});

// server/standalone.ts
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var JWT_SECRET = process.env.JWT_SECRET || "zuno-glass-secret-2025";
var MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || "APP_USR-7342182629407170-030307-d26fb83cc501bea0f26eb7bd84dfded2-253817435";
var MP_PUBLIC_KEY = process.env.MERCADO_PAGO_PUBLIC_KEY || "APP_USR-f4856d8d-0b95-4520-bdc3-b6a12f5ed7ff";
var ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID || "3EFAF4F0A833A199333B5ED3E77AF5CE";
var ZAPI_TOKEN = process.env.ZAPI_TOKEN || "414F185DAF8C4667856CEF43";
var ZAPI_CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN || "F294e30290d0c4612af8396eab6449577S";
var ZAPI_NOTIFY_PHONE = process.env.ZAPI_NOTIFY_PHONE || "5574981343604";
async function sendWhatsAppNotification(message) {
  try {
    const url = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-text`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Client-Token": ZAPI_CLIENT_TOKEN },
      body: JSON.stringify({ phone: ZAPI_NOTIFY_PHONE, message })
    });
    if (!response.ok) {
      const err = await response.text();
      console.error("[Z-API] Erro ao enviar notifica\xE7\xE3o:", err);
    } else {
      console.log("[Z-API] Notifica\xE7\xE3o WhatsApp enviada com sucesso");
    }
  } catch (e) {
    console.error("[Z-API] Falha na notifica\xE7\xE3o:", e.message);
  }
}
function formatOrderNotification(order, status) {
  const items = (order.items || []).map((i) => `  - ${i.title || i.name} x${i.quantity} = R$${((i.unit_price || i.price || 0) * i.quantity).toFixed(2)}`).join("\n");
  const payer = order.payer || {};
  const name = payer.first_name ? `${payer.first_name} ${payer.last_name || ""}`.trim() : "Cliente";
  const phone = payer.phone || payer.whatsapp || "";
  const total = order.total ? `R$${Number(order.total).toFixed(2)}` : "";
  const method = order.paymentMethod === "pix" ? "PIX" : order.paymentMethod === "card" ? "Cartao" : "";
  return `*ZUNO GLASS - ${status}*

Pedido: ${order.orderNumber || order.id}
Cliente: ${name}
${phone ? `Telefone: ${phone}
` : ""}${payer.email ? `Email: ${payer.email}
` : ""}
Itens:
${items}

Total: ${total}
${method ? `Pagamento: ${method}` : ""}`;
}
var DATA_DIR = path.join(__dirname, "../data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
var ORDERS_FILE = path.join(DATA_DIR, "orders.json");
var WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");
var PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
var STOCK_FILE = path.join(DATA_DIR, "stock.json");
var CUSTOMERS_FILE = path.join(DATA_DIR, "customers.json");
var COUPONS_FILE = path.join(DATA_DIR, "coupons.json");
function readJSON(file, def = []) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return def;
  }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
function loadUsers() {
  try {
    const saved = readJSON(CUSTOMERS_FILE, null);
    if (Array.isArray(saved) && saved.length > 0) return saved;
  } catch {
  }
  return [];
}
function saveUsers(userList) {
  writeJSON(CUSTOMERS_FILE, userList);
}
var users = loadUsers();
(async () => {
  if (!users.find((u) => u.email === "admin@zunoglass.com")) {
    const hash = await bcrypt.hash("admin123", 10);
    users.push({ id: 1, email: "admin@zunoglass.com", passwordHash: hash, name: "Admin ZUNO", roles: ["admin", "ops"], isActive: true });
    saveUsers(users);
  }
})();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token n\xE3o fornecido." });
  try {
    req.authUser = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inv\xE1lido." });
  }
}
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Nome, e-mail e senha s\xE3o obrigat\xF3rios." });
    if (users.find((u) => u.email === email.toLowerCase())) return res.status(409).json({ error: "E-mail j\xE1 cadastrado." });
    const passwordHash = await bcrypt.hash(password, 10);
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id || 0)) + 1 : 1;
    const user = { id: newId, email: email.toLowerCase(), passwordHash, name, roles: ["customer"], isActive: true, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
    if (address) user.address = address;
    users.push(user);
    saveUsers(users);
    const accessToken = jwt.sign({ userId: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ accessToken, user: { id: user.id, name: user.name, email: user.email, roles: user.roles } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email?.toLowerCase());
    if (!user) return res.status(401).json({ error: "E-mail ou senha incorretos." });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "E-mail ou senha incorretos." });
    const accessToken = jwt.sign({ userId: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, roles: user.roles } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/auth/logout", (_req, res) => res.json({ success: true }));
app.post("/api/auth/refresh", (_req, res) => res.status(401).json({ error: "Not supported" }));
app.post("/api/auth/forgot-password", (_req, res) => res.json({ success: true, message: "Se o e-mail existir, voc\xEA receber\xE1 as instru\xE7\xF5es." }));
app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.authUser.userId) || users.find((u) => u.email === req.authUser.email);
  if (!user) return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado." });
  res.json({ user: { id: user.id, name: user.name, email: user.email, roles: user.roles, phone: user.phone, cpf: user.cpf, address: user.address || {} } });
});
app.put("/api/auth/profile", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.authUser.userId);
  if (!user) return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado." });
  Object.assign(user, req.body);
  saveUsers(users);
  res.json({ success: true, user });
});
app.patch("/api/auth/profile", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.authUser.userId);
  if (!user) return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado." });
  Object.assign(user, req.body);
  saveUsers(users);
  res.json({ success: true, user });
});
app.get("/api/auth/my-orders", requireAuth, (req, res) => {
  try {
    const email = req.authUser.email;
    const orders = readJSON(ORDERS_FILE, []);
    const myOrders = orders.filter(
      (o) => o.customerEmail && o.customerEmail.toLowerCase() === email.toLowerCase()
    );
    myOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ orders: myOrders });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/payment/confirm", async (req, res) => {
  try {
    const { paymentId, externalReference, collectionStatus } = req.body;
    console.log(`[PaymentConfirm] paymentId=${paymentId} extRef=${externalReference} status=${collectionStatus}`);
    if (!paymentId && !externalReference) return res.status(400).json({ error: "Dados insuficientes" });
    const orders = readJSON(ORDERS_FILE);
    const order = orders.find(
      (o) => paymentId && o.paymentId === String(paymentId) || externalReference && (o.id === externalReference || o.preferenceId === externalReference)
    );
    if (order && (order.status === "pending" || order.status === "paid")) {
      if (paymentId) {
        try {
          const { MercadoPagoConfig, Payment } = await import("mercadopago");
          const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
          const payment = new Payment(client);
          const result = await payment.get({ id: paymentId });
          if (result.status === "approved") {
            order.status = "em_separacao";
            order.paymentStatus = "paid";
            order.paymentId = String(paymentId);
            order.paidAt = (/* @__PURE__ */ new Date()).toISOString();
            writeJSON(ORDERS_FILE, orders);
            deductStock(order.items || []);
            sendWhatsAppNotification(formatOrderNotification(order, "PAGAMENTO APROVADO - EM SEPARA\xC7\xC3O")).catch(() => {
            });
            console.log(`[PaymentConfirm] Pedido ${order.id} atualizado para em_separacao`);
          }
        } catch (mpErr) {
          console.error("[PaymentConfirm] Erro ao verificar MP:", mpErr.message);
          if (collectionStatus === "approved") {
            order.status = "em_separacao";
            order.paymentStatus = "paid";
            order.paymentId = String(paymentId);
            order.paidAt = (/* @__PURE__ */ new Date()).toISOString();
            writeJSON(ORDERS_FILE, orders);
          }
        }
      } else if (collectionStatus === "approved") {
        order.status = "em_separacao";
        order.paymentStatus = "paid";
        order.paidAt = (/* @__PURE__ */ new Date()).toISOString();
        writeJSON(ORDERS_FILE, orders);
      }
    }
    const updatedOrders = readJSON(ORDERS_FILE);
    const updatedOrder = updatedOrders.find(
      (o) => paymentId && o.paymentId === String(paymentId) || externalReference && (o.id === externalReference || o.preferenceId === externalReference)
    );
    res.json({ success: true, order: updatedOrder || null });
  } catch (e) {
    console.error("[PaymentConfirm] Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});
var _catalogCache = null;
var _stockCache = null;
function slugify(name) {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
async function getProducts() {
  if (_catalogCache) return _catalogCache;
  let baseCatalog = [];
  try {
    const { catalog: catalog2 } = await Promise.resolve().then(() => (init_catalog(), catalog_exports));
    baseCatalog = catalog2;
  } catch {
    baseCatalog = [];
  }
  const catalogIds = new Set(baseCatalog.map((p) => p.id));
  if (fs.existsSync(PRODUCTS_FILE)) {
    const saved = readJSON(PRODUCTS_FILE, null);
    if (Array.isArray(saved) && saved.length > 0) {
      const savedIds = saved.map((p) => p.id);
      const idsValid = savedIds.every((id) => catalogIds.has(id));
      if (idsValid) {
        _catalogCache = saved;
        return _catalogCache;
      }
      console.log("[WARN] products.json com IDs inv\xE1lidos, reinicializando do cat\xE1logo est\xE1tico");
    }
  }
  _catalogCache = baseCatalog;
  writeJSON(PRODUCTS_FILE, _catalogCache);
  return _catalogCache;
}
async function getStock() {
  if (_stockCache) return _stockCache;
  const products = await getProducts();
  const catalogIds = new Set(products.map((p) => p.id));
  if (fs.existsSync(STOCK_FILE)) {
    const saved = readJSON(STOCK_FILE, null);
    if (saved && typeof saved === "object" && Object.keys(saved).length > 0) {
      const stockIds = Object.keys(saved);
      const matchCount = stockIds.filter((id) => catalogIds.has(id)).length;
      const catalogMatchRatio = matchCount / catalogIds.size;
      if (catalogMatchRatio >= 0.5) {
        const stock2 = {};
        for (const p of products) {
          if (saved[p.id]) {
            const entry = saved[p.id];
            if (entry.variants !== void 0) {
              stock2[p.id] = entry;
            } else {
              const variants = entry;
              const total = Object.values(variants).reduce((s, v) => s + Number(v), 0);
              stock2[p.id] = { total, variants };
            }
          } else {
            const variants = {};
            if (p.variants) {
              for (const v of p.variants) {
                variants[v.colorName || v.color] = 99;
              }
            }
            stock2[p.id] = { total: 99, variants };
          }
        }
        _stockCache = stock2;
        writeJSON(STOCK_FILE, _stockCache);
        return _stockCache;
      }
      console.log("[WARN] stock.json com IDs inv\xE1lidos/desatualizados, reinicializando do cat\xE1logo");
    }
  }
  const stock = {};
  for (const p of products) {
    const variants = {};
    if (p.variants) {
      for (const v of p.variants) {
        variants[v.colorName || v.color] = 99;
      }
    }
    stock[p.id] = { total: 99, variants };
  }
  _stockCache = stock;
  writeJSON(STOCK_FILE, _stockCache);
  return _stockCache;
}
app.get("/api/catalog", async (_req, res) => {
  try {
    const products = await getProducts();
    res.setHeader("Cache-Control", "no-cache");
    res.json(products);
  } catch (e) {
    console.error("[Catalog] Error:", e.message);
    res.json([]);
  }
});
app.get("/api/stock", async (_req, res) => {
  try {
    const stock = await getStock();
    res.setHeader("Cache-Control", "no-cache");
    res.json({ stock });
  } catch (e) {
    res.json({ stock: {} });
  }
});
app.get("/api/mercadopago/public-key", (_req, res) => {
  res.json({ publicKey: MP_PUBLIC_KEY });
});
app.get("/api/shipping", async (req, res) => {
  try {
    const { calculateShipping: calculateShipping2, isValidCep: isValidCep2 } = await Promise.resolve().then(() => (init_shipping(), shipping_exports));
    const cep = String(req.query.cep || "").replace(/\D/g, "");
    if (!isValidCep2(cep)) return res.status(400).json({ error: "CEP inv\xE1lido" });
    const options = calculateShipping2(cep);
    res.json(options);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/waitlist", (req, res) => {
  try {
    const { email, name, source } = req.body;
    if (!email) return res.status(400).json({ error: "E-mail \xE9 obrigat\xF3rio." });
    const list = readJSON(WAITLIST_FILE);
    if (!list.find((e) => e.email === email)) {
      list.push({ email, name, source, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      writeJSON(WAITLIST_FILE, list);
    }
    res.json({ success: true, message: "Voc\xEA entrou para o squad!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/checkout", async (req, res) => {
  try {
    const { items, shippingCost } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: "Carrinho vazio" });
    const { catalog: catalog2 } = await Promise.resolve().then(() => (init_catalog(), catalog_exports));
    const { MercadoPagoConfig, Preference } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const preference = new Preference(client);
    const mpItems = items.map((item) => {
      const product = catalog2.find((p) => p.id === item.productId);
      const price = product ? Number(product.price) : 189.9;
      return {
        id: item.productId,
        title: product?.name || item.productId,
        quantity: Number(item.quantity) || 1,
        unit_price: price,
        currency_id: "BRL"
      };
    });
    if (shippingCost && Number(shippingCost) > 0) {
      mpItems.push({ id: "frete", title: "Frete", quantity: 1, unit_price: Number(shippingCost), currency_id: "BRL" });
    }
    const origin = req.headers.origin || "http://localhost:3000";
    const extRef = `order-${Date.now()}`;
    const result = await preference.create({
      body: {
        items: mpItems,
        back_urls: {
          success: `${origin}/checkout/success`,
          failure: `${origin}/products`,
          pending: `${origin}/products`
        },
        auto_approve: false,
        external_reference: extRef,
        payment_methods: { installments: 3 }
      }
    });
    const orders = readJSON(ORDERS_FILE);
    orders.push({ id: extRef, items, shippingCost: shippingCost || 0, status: "pending", preferenceId: result.id, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
    writeJSON(ORDERS_FILE, orders);
    res.json({ url: result.init_point, preferenceId: result.id });
  } catch (e) {
    console.error("[Checkout] Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/checkout/preference", async (req, res) => {
  try {
    const { items, payer, backUrls, externalReference, shippingAddress, coupon } = req.body;
    const stock = await getStock();
    for (const item of items) {
      const productId = item.id;
      const variantColor = item.variantColor || item.variantColorName || null;
      const productStock = stock[productId];
      if (productStock) {
        if (variantColor && productStock.variants && productStock.variants[variantColor] !== void 0) {
          if (productStock.variants[variantColor] <= 0) {
            return res.status(400).json({ error: `Produto "${item.title}" (${variantColor}) est\xE1 esgotado.` });
          }
        } else if (productStock.total !== void 0 && productStock.total <= 0) {
          return res.status(400).json({ error: `Produto "${item.title}" est\xE1 esgotado.` });
        }
      }
    }
    const { MercadoPagoConfig, Preference } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const preference = new Preference(client);
    const orderId = externalReference || `order-${Date.now()}`;
    const origin = req.headers.origin || "https://zuno-glass-production.up.railway.app";
    let mpItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: "BRL"
    }));
    if (coupon && coupon.discount > 0) {
      const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
      const discountRatio = Math.min(coupon.discount / subtotal, 1);
      mpItems = mpItems.map((item) => ({
        ...item,
        unit_price: Math.max(0.01, parseFloat((item.unit_price * (1 - discountRatio)).toFixed(2)))
      }));
    }
    const result = await preference.create({
      body: {
        items: mpItems,
        payer: payer || {},
        back_urls: backUrls || {
          success: `${origin}/minha-conta?tab=pedidos`,
          failure: `${origin}/checkout`,
          pending: `${origin}/minha-conta?tab=pedidos`
        },
        auto_approve: false,
        external_reference: orderId,
        payment_methods: { installments: 3 },
        notification_url: `https://zuno-glass-production.up.railway.app/api/webhooks/mercadopago`
      }
    });
    const orders = readJSON(ORDERS_FILE);
    const fullName = payer ? `${payer.first_name || ""} ${payer.last_name || ""}`.trim() : "";
    const newOrder = {
      id: orderId,
      items: items.map((item) => ({
        productId: item.id,
        name: item.title,
        quantity: item.quantity,
        price: item.unit_price,
        variantColor: item.variantColor || "Padr\xE3o"
      })),
      customerName: fullName,
      customerEmail: payer?.email || "",
      customerPhone: payer?.phone ? `${payer.phone.area_code}${payer.phone.number}` : "",
      customerCpf: payer?.identification?.number || "",
      shippingAddress: shippingAddress || null,
      shippingCost: 0,
      coupon: coupon || null,
      total: mpItems.reduce((s, i) => s + i.unit_price * i.quantity, 0),
      originalTotal: items.reduce((s, i) => s + i.unit_price * i.quantity, 0),
      status: "pending",
      preferenceId: result.id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    orders.push(newOrder);
    writeJSON(ORDERS_FILE, orders);
    sendWhatsAppNotification(formatOrderNotification(newOrder, "NOVO PEDIDO")).catch(() => {
    });
    res.json({ preferenceId: result.id, initPoint: result.init_point, sandboxInitPoint: result.sandbox_init_point });
  } catch (e) {
    console.error("[MP Preference] Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/checkout/pix", async (req, res) => {
  try {
    const { items, payer, externalReference } = req.body;
    const { MercadoPagoConfig, Payment } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const totalAmount = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const result = await payment.create({
      body: {
        transaction_amount: Math.round(totalAmount * 100) / 100,
        description: items.map((i) => i.title).join(", "),
        payment_method_id: "pix",
        payer: { email: payer?.email || "cliente@zunoglass.com", first_name: payer?.first_name, last_name: payer?.last_name },
        external_reference: externalReference || `pix-${Date.now()}`
      }
    });
    const orders = readJSON(ORDERS_FILE);
    const order = {
      id: orders.length + 1,
      orderNumber: `ZG-${Date.now()}`,
      items,
      payer,
      total: totalAmount,
      paymentMethod: "pix",
      paymentId: result.id,
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    orders.push(order);
    writeJSON(ORDERS_FILE, orders);
    sendWhatsAppNotification(formatOrderNotification(order, "NOVO PEDIDO PIX")).catch(() => {
    });
    res.json({
      paymentId: result.id,
      status: result.status,
      pixQrCode: result.point_of_interaction?.transaction_data?.qr_code,
      pixQrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
      orderNumber: order.orderNumber
    });
  } catch (e) {
    console.error("[MP PIX] Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/checkout/card", async (req, res) => {
  try {
    const { items, payer, token, installments, paymentMethodId, externalReference } = req.body;
    const { MercadoPagoConfig, Payment } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const totalAmount = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const result = await payment.create({
      body: {
        transaction_amount: Math.round(totalAmount * 100) / 100,
        token,
        description: items.map((i) => i.title).join(", "),
        installments: installments || 1,
        payment_method_id: paymentMethodId,
        payer: { email: payer?.email, identification: { type: "CPF", number: payer?.cpf || "" } },
        external_reference: externalReference || `card-${Date.now()}`
      }
    });
    const orders = readJSON(ORDERS_FILE);
    const order = {
      id: orders.length + 1,
      orderNumber: `ZG-${Date.now()}`,
      items,
      payer,
      total: totalAmount,
      paymentMethod: "card",
      paymentId: result.id,
      status: result.status,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    orders.push(order);
    writeJSON(ORDERS_FILE, orders);
    sendWhatsAppNotification(formatOrderNotification(order, "NOVO PEDIDO CARTAO")).catch(() => {
    });
    res.json({ paymentId: result.id, status: result.status, statusDetail: result.status_detail, orderNumber: order.orderNumber });
  } catch (e) {
    console.error("[MP Card] Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});
app.get("/api/payment/:id/status", async (req, res) => {
  try {
    const { MercadoPagoConfig, Payment } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const result = await payment.get({ id: req.params.id });
    res.json({ status: result.status, statusDetail: result.status_detail });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.put("/api/admin/products/bulk", async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ error: "Array de produtos esperado" });
    writeJSON(PRODUCTS_FILE, products);
    _catalogCache = products;
    const existingStock = fs.existsSync(STOCK_FILE) ? readJSON(STOCK_FILE, {}) : {};
    const stock = { ...existingStock };
    for (const p of products) {
      if (!stock[p.id]) {
        const variants = {};
        if (p.variants) {
          for (const v of p.variants) {
            variants[v.colorName || v.color || "default"] = 99;
          }
        }
        stock[p.id] = { total: 99, variants };
      }
    }
    _stockCache = stock;
    writeJSON(STOCK_FILE, stock);
    res.json({ success: true, count: products.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get("/api/admin/products", async (_req, res) => {
  try {
    res.json(await getProducts());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/admin/products", async (req, res) => {
  try {
    const products = await getProducts();
    const data = req.body;
    if (!data.name) return res.status(400).json({ error: "Nome obrigat\xF3rio" });
    const id = data.id || slugify(data.name);
    if (products.find((p) => p.id === id)) return res.status(409).json({ error: "ID j\xE1 existe. Use um nome diferente." });
    const product = { id, ...data };
    products.push(product);
    writeJSON(PRODUCTS_FILE, products);
    _catalogCache = products;
    const stock = await getStock();
    const variants = {};
    if (product.variants) {
      for (const v of product.variants) {
        variants[v.colorName || v.color] = 99;
      }
    }
    stock[id] = { total: 99, variants };
    writeJSON(STOCK_FILE, stock);
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.put("/api/admin/products/:id", async (req, res) => {
  try {
    const products = await getProducts();
    const idx = products.findIndex((p2) => p2.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Produto n\xE3o encontrado" });
    products[idx] = { ...products[idx], ...req.body, id: req.params.id };
    writeJSON(PRODUCTS_FILE, products);
    _catalogCache = products;
    const stock = await getStock();
    const p = products[idx];
    if (p.variants && stock[p.id]) {
      const existing = stock[p.id].variants || {};
      const updated = {};
      for (const v of p.variants) {
        const key = v.colorName || v.color;
        updated[key] = existing[key] ?? 99;
      }
      stock[p.id].variants = updated;
      stock[p.id].total = Object.values(updated).reduce((a, b) => a + b, 0);
      writeJSON(STOCK_FILE, stock);
    }
    res.json(products[idx]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.delete("/api/admin/products/:id", async (req, res) => {
  try {
    let products = await getProducts();
    const idx = products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Produto n\xE3o encontrado" });
    products.splice(idx, 1);
    writeJSON(PRODUCTS_FILE, products);
    _catalogCache = products;
    const stock = await getStock();
    delete stock[req.params.id];
    writeJSON(STOCK_FILE, stock);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get("/api/admin/stock", async (_req, res) => {
  try {
    res.json(await getStock());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/admin/stock/reset", requireAuth, async (_req, res) => {
  try {
    _stockCache = null;
    if (fs.existsSync(STOCK_FILE)) fs.unlinkSync(STOCK_FILE);
    const stock = await getStock();
    res.json({ success: true, message: `Estoque reinicializado com 99 unidades para ${Object.keys(stock).length} produtos.` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.put("/api/admin/stock/:productId", async (req, res) => {
  try {
    const stock = await getStock();
    const { variants } = req.body;
    if (!stock[req.params.productId]) stock[req.params.productId] = { total: 0, variants: {} };
    stock[req.params.productId].variants = variants;
    stock[req.params.productId].total = Object.values(variants).reduce((a, b) => a + Number(b), 0);
    writeJSON(STOCK_FILE, stock);
    _stockCache = stock;
    res.json(stock[req.params.productId]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get("/api/admin/orders", requireAuth, (req, res) => {
  try {
    const { page = "1", limit = "50", search = "", status = "" } = req.query;
    let orders = readJSON(ORDERS_FILE, []);
    orders = orders.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    if (status && status !== "all") {
      orders = orders.filter((o) => o.status === status);
    }
    if (search) {
      const s = String(search).toLowerCase();
      orders = orders.filter(
        (o) => o.id && String(o.id).toLowerCase().includes(s) || o.customerEmail && o.customerEmail.toLowerCase().includes(s) || o.customerName && o.customerName.toLowerCase().includes(s) || o.email && o.email.toLowerCase().includes(s) || o.payer && o.payer.email && o.payer.email.toLowerCase().includes(s) || o.payer && o.payer.first_name && (o.payer.first_name + " " + (o.payer.last_name || "")).toLowerCase().includes(s)
      );
    }
    const total = orders.length;
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 50;
    const paginated = orders.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    res.json({ orders: paginated, total });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get("/api/admin/orders/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const orders = readJSON(ORDERS_FILE, []);
    const order = orders.find((o) => o.id === id || String(o.id) === id);
    if (!order) return res.status(404).json({ error: "Pedido n\xE3o encontrado." });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.put("/api/admin/orders/:id/status", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const orders = readJSON(ORDERS_FILE);
    const order = orders.find((o) => o.id === id || String(o.id) === id);
    if (!order) return res.status(404).json({ error: "Pedido n\xE3o encontrado." });
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({ status, changedAt: now, note: note || "" });
    order.status = status;
    order.updatedAt = now;
    writeJSON(ORDERS_FILE, orders);
    const STAGE_LABELS = {
      em_separacao: "APROVADO - EM SEPARA\xC7\xC3O",
      preparando: "EM PREPARA\xC7\xC3O",
      pronto: "PEDIDO PRONTO",
      saiu_entrega: "SAIU PARA ENTREGA",
      entregue: "ENTREGUE",
      cancelado: "CANCELADO"
    };
    if (STAGE_LABELS[status]) {
      sendWhatsAppNotification(formatOrderNotification(order, STAGE_LABELS[status])).catch(() => {
      });
    }
    res.json({ success: true, order });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/admin/migrate/paid-to-em-separacao", requireAuth, (_req, res) => {
  try {
    const orders = readJSON(ORDERS_FILE);
    let count = 0;
    for (const order of orders) {
      if (order.status === "paid") {
        order.status = "em_separacao";
        order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        count++;
      }
    }
    writeJSON(ORDERS_FILE, orders);
    res.json({ success: true, updated: count });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get("/api/admin/waitlist", requireAuth, (_req, res) => {
  res.json(readJSON(WAITLIST_FILE));
});
app.get("/api/admin/stats", requireAuth, (_req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const waitlist = readJSON(WAITLIST_FILE);
  const totalRevenue = orders.filter((o) => o.status === "paid").reduce((s, o) => s + (o.total || 0), 0);
  res.json({ totalOrders: orders.length, totalRevenue, waitlistCount: waitlist.length, pendingOrders: orders.filter((o) => o.status === "pending").length });
});
var ADMIN_PANEL_PASSWORD = process.env.ADMIN_PASSWORD || "zuno2025";
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PANEL_PASSWORD) return res.status(401).json({ error: "Senha incorreta." });
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, success: true });
});
app.get("/api/admin/me", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token n\xE3o fornecido." });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin") return res.status(403).json({ error: "Acesso negado." });
    res.json({ role: "admin", name: "Admin ZUNO" });
  } catch {
    return res.status(401).json({ error: "Token inv\xE1lido." });
  }
});
app.post("/api/admin/logout", (_req, res) => res.json({ success: true }));
var INVESTMENTS_FILE = path.join(DATA_DIR, "investments.json");
var AFFILIATES_FILE = path.join(DATA_DIR, "affiliates.json");
var PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");
var FINANCIAL_FILE = path.join(DATA_DIR, "financial.json");
var SALES_FILE = path.join(DATA_DIR, "sales.json");
var SCENARIOS_FILE = path.join(DATA_DIR, "scenarios.json");
var SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
app.get("/api/admin/gestao/investments", requireAuth, (_req, res) => {
  res.json(readJSON(INVESTMENTS_FILE, []));
});
app.post("/api/admin/gestao/investments", requireAuth, (req, res) => {
  const items = readJSON(INVESTMENTS_FILE, []);
  const item = { id: Date.now(), created_at: (/* @__PURE__ */ new Date()).toISOString(), ...req.body };
  items.push(item);
  writeJSON(INVESTMENTS_FILE, items);
  res.json(item);
});
app.delete("/api/admin/gestao/investments/:id", requireAuth, (req, res) => {
  const items = readJSON(INVESTMENTS_FILE, []);
  const filtered = items.filter((i) => String(i.id) !== req.params.id);
  writeJSON(INVESTMENTS_FILE, filtered);
  res.json({ success: true });
});
app.get("/api/admin/gestao/affiliates", requireAuth, (_req, res) => {
  res.json(readJSON(AFFILIATES_FILE, []));
});
app.post("/api/admin/gestao/affiliates", requireAuth, (req, res) => {
  const items = readJSON(AFFILIATES_FILE, []);
  const item = { id: Date.now(), created_at: (/* @__PURE__ */ new Date()).toISOString(), active: true, sales: 0, commission: 0, ...req.body };
  items.push(item);
  writeJSON(AFFILIATES_FILE, items);
  res.json(item);
});
app.put("/api/admin/gestao/affiliates/:id", requireAuth, (req, res) => {
  const items = readJSON(AFFILIATES_FILE, []);
  const idx = items.findIndex((i) => String(i.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  items[idx] = { ...items[idx], ...req.body };
  writeJSON(AFFILIATES_FILE, items);
  res.json(items[idx]);
});
app.delete("/api/admin/gestao/affiliates/:id", requireAuth, (req, res) => {
  const items = readJSON(AFFILIATES_FILE, []);
  writeJSON(AFFILIATES_FILE, items.filter((i) => String(i.id) !== req.params.id));
  res.json({ success: true });
});
app.get("/api/admin/gestao/payments", requireAuth, (_req, res) => {
  const orders = readJSON(ORDERS_FILE, []);
  const payments = orders.map((o) => ({
    id: o.id,
    date: o.createdAt,
    amount: o.items?.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0) + (o.shippingCost || 0),
    method: o.paymentMethod || "credit_card",
    status: o.status,
    customer: o.customerName || o.customer?.name || "Cliente",
    orderId: o.id
  }));
  res.json(payments);
});
app.get("/api/admin/gestao/financial", requireAuth, (_req, res) => {
  res.json(readJSON(FINANCIAL_FILE, { revenue: 0, expenses: 0, profit: 0, records: [] }));
});
app.get("/api/admin/gestao/sales", requireAuth, (_req, res) => {
  const orders = readJSON(ORDERS_FILE, []);
  const approved = orders.filter((o) => o.status === "approved" || o.status === "paid");
  const total = approved.reduce((s, o) => {
    return s + (o.items?.reduce((ss, i) => ss + (i.price || 0) * (i.quantity || 1), 0) || 0) + (o.shippingCost || 0);
  }, 0);
  res.json({ total, count: approved.length, orders: approved });
});
app.get("/api/admin/gestao/scenarios", requireAuth, (_req, res) => {
  res.json(readJSON(SCENARIOS_FILE, []));
});
app.post("/api/admin/gestao/scenarios", requireAuth, (req, res) => {
  const items = readJSON(SCENARIOS_FILE, []);
  const item = { id: Date.now(), created_at: (/* @__PURE__ */ new Date()).toISOString(), ...req.body };
  items.push(item);
  writeJSON(SCENARIOS_FILE, items);
  res.json(item);
});
app.get("/api/admin/settings", requireAuth, (_req, res) => {
  res.json(readJSON(SETTINGS_FILE, { storeName: "ZUNO GLASS", adminPassword: "zuno2025", freeShippingThreshold: 299, shippingCost: 19.9 }));
});
app.put("/api/admin/settings", requireAuth, (req, res) => {
  const current = readJSON(SETTINGS_FILE, {});
  const updated = { ...current, ...req.body };
  writeJSON(SETTINGS_FILE, updated);
  if (req.body.adminPassword) {
    process.env.ADMIN_PASSWORD = req.body.adminPassword;
  }
  res.json(updated);
});
app.get("/api/admin/gestao/partners", requireAuth, (_req, res) => {
  res.json(readJSON(path.join(DATA_DIR, "partners.json"), []));
});
app.post("/api/admin/gestao/partners", requireAuth, (req, res) => {
  const items = readJSON(path.join(DATA_DIR, "partners.json"), []);
  const item = { id: Date.now(), created_at: (/* @__PURE__ */ new Date()).toISOString(), ...req.body };
  items.push(item);
  writeJSON(path.join(DATA_DIR, "partners.json"), items);
  res.json(item);
});
function deductStock(orderItems) {
  try {
    const stock = readJSON(STOCK_FILE, {});
    let changed = false;
    for (const item of orderItems) {
      const productId = item.productId || item.id;
      const variantColor = item.variantColor || "default";
      const qty = Number(item.quantity) || 1;
      if (!productId || !stock[productId]) continue;
      const productStock = stock[productId];
      if (productStock.variants && productStock.variants[variantColor] !== void 0) {
        productStock.variants[variantColor] = Math.max(0, (productStock.variants[variantColor] || 0) - qty);
      } else if (productStock.variants && productStock.variants["default"] !== void 0) {
        productStock.variants["default"] = Math.max(0, (productStock.variants["default"] || 0) - qty);
      }
      if (productStock.variants) {
        productStock.total = Object.values(productStock.variants).reduce((sum, v) => sum + Number(v), 0);
      } else {
        productStock.total = Math.max(0, (productStock.total || 0) - qty);
      }
      changed = true;
    }
    if (changed) {
      writeJSON(STOCK_FILE, stock);
      _stockCache = stock;
      console.log("[Stock] Estoque atualizado ap\xF3s pagamento aprovado");
    }
  } catch (e) {
    console.error("[Stock] Erro ao dar baixa no estoque:", e.message);
  }
}
app.post("/api/webhooks/mercadopago", async (req, res) => {
  try {
    console.log(`[Webhook MP] Recebido: type=${req.body?.type} id=${req.body?.data?.id}`);
    const { type, data } = req.body;
    const paymentId = data?.id || req.query["data.id"];
    const eventType = type || req.query["type"];
    if ((eventType === "payment" || eventType === "payment.updated") && paymentId) {
      const { MercadoPagoConfig, Payment } = await import("mercadopago");
      const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
      const payment = new Payment(client);
      const result = await payment.get({ id: paymentId });
      if (result.status === "approved") {
        const orders = readJSON(ORDERS_FILE);
        const extRef = result.external_reference;
        const order = orders.find(
          (o) => o.paymentId === paymentId || o.paymentId === String(paymentId) || extRef && (o.id === extRef || o.preferenceId === extRef)
        );
        console.log(`[Webhook MP] extRef=${extRef} order encontrado=${!!order} status=${order?.status}`);
        if (order) {
          order.status = "em_separacao";
          order.paymentStatus = "paid";
          order.paymentId = String(paymentId);
          order.paidAt = (/* @__PURE__ */ new Date()).toISOString();
          writeJSON(ORDERS_FILE, orders);
          deductStock(order.items || []);
          sendWhatsAppNotification(formatOrderNotification(order, "PAGAMENTO APROVADO - EM SEPARA\xC7\xC3O")).catch(() => {
          });
        } else {
          const fallbackOrder = {
            id: extRef || `order-mp-${data.id}`,
            items: [],
            customerName: result.payer?.first_name ? `${result.payer.first_name} ${result.payer.last_name || ""}`.trim() : "Cliente",
            customerEmail: result.payer?.email || "",
            total: result.transaction_amount || 0,
            status: "em_separacao",
            paymentStatus: "paid",
            paymentId: String(paymentId),
            preferenceId: extRef || "",
            paidAt: (/* @__PURE__ */ new Date()).toISOString(),
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          orders.push(fallbackOrder);
          writeJSON(ORDERS_FILE, orders);
          sendWhatsAppNotification(formatOrderNotification(fallbackOrder, "PAGAMENTO APROVADO - EM SEPARA\xC7\xC3O")).catch(() => {
          });
        }
      }
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("[Webhook] Error:", e.message);
    res.sendStatus(200);
  }
});
app.get("/api/admin/gestao/coupons", requireAuth, (_req, res) => {
  res.json(readJSON(COUPONS_FILE, []));
});
app.post("/api/admin/gestao/coupons", requireAuth, (req, res) => {
  const coupons = readJSON(COUPONS_FILE, []);
  const { code, discountType, discountValue, minOrderValue, maxUses, expiresAt } = req.body;
  if (!code || !discountType || discountValue === void 0) {
    return res.status(400).json({ error: "Campos obrigat\xF3rios: code, discountType, discountValue" });
  }
  const existing = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (existing) return res.status(400).json({ error: "Cupom com este c\xF3digo j\xE1 existe" });
  const coupon = {
    id: Date.now(),
    code: code.toUpperCase(),
    discount_type: discountType,
    discount_value: parseFloat(discountValue),
    min_order_value: minOrderValue ? parseFloat(minOrderValue) : null,
    max_uses: maxUses ? parseInt(maxUses) : null,
    used_count: 0,
    is_active: true,
    expires_at: expiresAt || null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  coupons.push(coupon);
  writeJSON(COUPONS_FILE, coupons);
  res.json(coupon);
});
app.patch("/api/admin/gestao/coupons/:id/toggle", requireAuth, (req, res) => {
  const coupons = readJSON(COUPONS_FILE, []);
  const idx = coupons.findIndex((c) => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Cupom n\xE3o encontrado" });
  coupons[idx].is_active = !coupons[idx].is_active;
  writeJSON(COUPONS_FILE, coupons);
  res.json(coupons[idx]);
});
app.delete("/api/admin/gestao/coupons/:id", requireAuth, (req, res) => {
  let coupons = readJSON(COUPONS_FILE, []);
  const before = coupons.length;
  coupons = coupons.filter((c) => c.id !== parseInt(req.params.id));
  if (coupons.length === before) return res.status(404).json({ error: "Cupom n\xE3o encontrado" });
  writeJSON(COUPONS_FILE, coupons);
  res.json({ success: true });
});
app.post("/api/coupons/validate", (req, res) => {
  const { code, orderTotal } = req.body;
  if (!code) return res.status(400).json({ error: "C\xF3digo obrigat\xF3rio" });
  const coupons = readJSON(COUPONS_FILE, []);
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (!coupon) return res.status(404).json({ error: "Cupom n\xE3o encontrado" });
  if (!coupon.is_active) return res.status(400).json({ error: "Cupom inativo" });
  if (coupon.expires_at && new Date(coupon.expires_at) < /* @__PURE__ */ new Date()) return res.status(400).json({ error: "Cupom expirado" });
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return res.status(400).json({ error: "Cupom esgotado" });
  if (coupon.min_order_value && orderTotal < coupon.min_order_value) {
    return res.status(400).json({ error: `Pedido m\xEDnimo de R$ ${coupon.min_order_value.toFixed(2)} para este cupom` });
  }
  const discount = coupon.discount_type === "percentual" ? orderTotal * coupon.discount_value / 100 : coupon.discount_value;
  res.json({ valid: true, coupon, discount: Math.min(discount, orderTotal) });
});
var distPath = path.join(__dirname, "../dist/public");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
var PORT = parseInt(process.env.PORT || "3001");
var httpServer = createServer(app);
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}/`);
  console.log(`Mercado Pago configured with Public Key: ${MP_PUBLIC_KEY.substring(0, 20)}...`);
});
var standalone_default = app;
export {
  standalone_default as default
};
