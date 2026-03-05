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
      // === LINHA PERFORMANCE === R$ 189,90
      {
        id: "zuno-veyron-preto-fosco",
        name: "ZUNO VEYRON PRETO FOSCO",
        tagline: "INVIS\xCDVEL. IMPAR\xC1VEL.",
        price: 189.9,
        description: "Arma\xE7\xE3o envolvente de perfil baixo para m\xE1xima aerodin\xE2mica. Lentes multicolor com contraste aprimorado para treinos de alta intensidade.",
        features: ["Lentes Multicolor", "Arma\xE7\xE3o Envolvente", "Grip Antiderrapante", "Ventila\xE7\xE3o Lateral"],
        image: `${IMG}Prime  Preto Fosco.webp`,
        category: "performance",
        variants: [
          { color: "#1a1a1a", colorName: "Preto Fosco", image: `${IMG}Prime  Preto Fosco.webp` }
        ],
        isNew: true,
        stock: 15
      },
      {
        id: "zuno-veyron-azul-multicolors-preto",
        name: "ZUNO VEYRON AZUL MULTICOLORS PRETO",
        tagline: "INVIS\xCDVEL. IMPAR\xC1VEL.",
        price: 189.9,
        description: "Arma\xE7\xE3o envolvente de perfil baixo para m\xE1xima aerodin\xE2mica. Lentes azul multicolor com contraste aprimorado.",
        features: ["Lentes Azul Multicolor", "Arma\xE7\xE3o Envolvente", "Grip Antiderrapante", "Ventila\xE7\xE3o Lateral"],
        image: `${IMG}Prime  Azul Multicolors Preto.webp`,
        category: "performance",
        variants: [
          { color: "#2563eb", colorName: "Azul Multicolors Preto", image: `${IMG}Prime  Azul Multicolors Preto.webp` }
        ],
        isNew: true,
        stock: 12
      },
      {
        id: "zuno-veyron-verde-multicolors",
        name: "ZUNO VEYRON VERDE MULTICOLORS",
        tagline: "INVIS\xCDVEL. IMPAR\xC1VEL.",
        price: 189.9,
        description: "Arma\xE7\xE3o envolvente de perfil baixo para m\xE1xima aerodin\xE2mica. Lentes verde multicolor para m\xE1xima visibilidade.",
        features: ["Lentes Verde Multicolor", "Arma\xE7\xE3o Envolvente", "Grip Antiderrapante", "Ventila\xE7\xE3o Lateral"],
        image: `${IMG}Prime   Verde Multicolors Cinza Azul.webp`,
        category: "performance",
        variants: [
          { color: "#16a34a", colorName: "Verde Multicolors", image: `${IMG}Prime   Verde Multicolors Cinza Azul.webp` }
        ],
        isNew: true,
        stock: 10
      },
      {
        id: "zuno-veyron-amarelo-multicolors",
        name: "ZUNO VEYRON AMARELO MULTICOLORS",
        tagline: "INVIS\xCDVEL. IMPAR\xC1VEL.",
        price: 189.9,
        description: "Arma\xE7\xE3o envolvente de perfil baixo para m\xE1xima aerodin\xE2mica. Lentes amarelo multicolor de alto contraste.",
        features: ["Lentes Amarelo Multicolor", "Arma\xE7\xE3o Envolvente", "Grip Antiderrapante", "Ventila\xE7\xE3o Lateral"],
        image: `${IMG}Prime Amarelo Multicolors Branco Preto.webp`,
        category: "performance",
        variants: [
          { color: "#eab308", colorName: "Amarelo Multicolors", image: `${IMG}Prime Amarelo Multicolors Branco Preto.webp` }
        ],
        isNew: true,
        stock: 8
      },
      {
        id: "zuno-strix",
        name: "ZUNO STRIX",
        tagline: "DOMINE O TERRENO.",
        price: 189.9,
        description: "Design agressivo com lentes fotocrom\xE1ticas que se adaptam \xE0 luz ambiente. Para quem n\xE3o para independente do hor\xE1rio.",
        features: ["Lentes Fotocrom\xE1ticas", "Design Agressivo", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Flex\xEDvel"],
        image: `${IMG}Diamond  Preto.webp`,
        category: "performance",
        variants: [
          { color: "#1a1a1a", colorName: "Preto Fosco", image: `${IMG}Diamond  Preto.webp` }
        ],
        isNew: true,
        stock: 5
      },
      {
        id: "zuno-strix-azul-multicolors",
        name: "ZUNO STRIX AZUL MULTICOLORS",
        tagline: "DOMINE O TERRENO.",
        price: 189.9,
        description: "Design agressivo com lentes azul multicolor. Para quem n\xE3o para independente do hor\xE1rio.",
        features: ["Lentes Azul Multicolor", "Design Agressivo", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Flex\xEDvel"],
        image: `${IMG}Prime  Azul Multicolors Preto.webp`,
        category: "performance",
        variants: [
          { color: "#2563eb", colorName: "Azul Multicolors", image: `${IMG}Prime  Azul Multicolors Preto.webp` }
        ],
        isNew: true,
        stock: 5
      },
      {
        id: "zuno-strix-marrom-verde",
        name: "ZUNO STRIX MARROM VERDE",
        tagline: "DOMINE O TERRENO.",
        price: 189.9,
        description: "Design agressivo com lentes marrom degrad\xEA. Para quem n\xE3o para independente do hor\xE1rio.",
        features: ["Lentes Marrom Degrad\xEA", "Design Agressivo", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Flex\xEDvel"],
        image: `${IMG}Samba  Marrom Degrad\xEA Rose.webp`,
        category: "performance",
        variants: [
          { color: "#92400e", colorName: "Marrom Verde", image: `${IMG}Samba  Marrom Degrad\xEA Rose.webp` }
        ],
        isNew: true,
        stock: 5
      },
      {
        id: "zuno-kaizen-azul-escuro-preto",
        name: "ZUNO KAIZEN AZUL ESCURO PRETO",
        tagline: "VELOCIDADE SELVAGEM.",
        price: 189.9,
        description: "Inspirado na filosofia japonesa de melhoria cont\xEDnua. Lentes polarizadas de alta defini\xE7\xE3o para m\xE1xima clareza visual.",
        features: ["Lentes Polarizadas HD", "Arma\xE7\xE3o TR90", "Prote\xE7\xE3o UV400", "Antirreflexo"],
        image: `${IMG}Madagascar Azul Escuro Preto.webp`,
        category: "performance",
        variants: [
          { color: "#1e40af", colorName: "Azul Escuro Preto", image: `${IMG}Madagascar Azul Escuro Preto.webp` }
        ],
        stock: 18
      },
      {
        id: "zuno-kaizen-verde-preto",
        name: "ZUNO KAIZEN VERDE PRETO",
        tagline: "VELOCIDADE SELVAGEM.",
        price: 189.9,
        description: "Inspirado na filosofia japonesa de melhoria cont\xEDnua. Lentes verde polarizadas de alta defini\xE7\xE3o.",
        features: ["Lentes Verde Polarizadas", "Arma\xE7\xE3o TR90", "Prote\xE7\xE3o UV400", "Antirreflexo"],
        image: `${IMG}Madagascar Verde Preto.webp`,
        category: "performance",
        variants: [
          { color: "#16a34a", colorName: "Verde Preto", image: `${IMG}Madagascar Verde Preto.webp` }
        ],
        stock: 14
      },
      {
        id: "zuno-vortexa",
        name: "ZUNO VORTEXA",
        tagline: "FOGO NA TRILHA.",
        price: 189.9,
        description: "Lentes espelhadas com efeito degrad\xEA para quem quer performance com estilo. Ideal para corridas ao ar livre.",
        features: ["Lentes Espelhadas Degrad\xEA", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Leve", "Design Esportivo"],
        image: `${IMG}Oregon 2.0  Rosa Escuro Camuflado.webp`,
        category: "performance",
        variants: [
          { color: "#ea580c", colorName: "Rosa Escuro Camuflado", image: `${IMG}Oregon 2.0  Rosa Escuro Camuflado.webp` }
        ],
        stock: 20
      },
      {
        id: "zuno-noxis-preto-verde",
        name: "ZUNO NOXIS PRETO VERDE",
        tagline: "FLUIDEZ EM MOVIMENTO.",
        price: 189.9,
        description: "Arma\xE7\xE3o ultraleve com sistema de ventila\xE7\xE3o avan\xE7ado. Para treinos longos sem desconforto.",
        features: ["Ultra Leve", "Ventila\xE7\xE3o Avan\xE7ada", "Lentes Claras", "Grip Premium"],
        image: `${IMG}Jin  Preto Verde.webp`,
        category: "performance",
        variants: [
          { color: "#1a1a1a", colorName: "Preto Verde", image: `${IMG}Jin  Preto Verde.webp` }
        ],
        stock: 22
      },
      {
        id: "zuno-noxis-branco-rosa",
        name: "ZUNO NOXIS BRANCO ROSA",
        tagline: "FLUIDEZ EM MOVIMENTO.",
        price: 189.9,
        description: "Arma\xE7\xE3o ultraleve com sistema de ventila\xE7\xE3o avan\xE7ado. Vers\xE3o branco/rosa para quem quer estilo e performance.",
        features: ["Ultra Leve", "Ventila\xE7\xE3o Avan\xE7ada", "Lentes Ros\xEA", "Grip Premium"],
        image: `${IMG}Jin BrancoRosa.webp`,
        category: "performance",
        variants: [
          { color: "#f9a8d4", colorName: "Branco Rosa", image: `${IMG}Jin BrancoRosa.webp` }
        ],
        stock: 16
      },
      {
        id: "zuno-noxis-branco-azul-claro",
        name: "ZUNO NOXIS BRANCO AZUL CLARO",
        tagline: "FLUIDEZ EM MOVIMENTO.",
        price: 189.9,
        description: "Arma\xE7\xE3o ultraleve com sistema de ventila\xE7\xE3o avan\xE7ado. Vers\xE3o branco/azul claro para treinos ao ar livre.",
        features: ["Ultra Leve", "Ventila\xE7\xE3o Avan\xE7ada", "Lentes Azul Claro", "Grip Premium"],
        image: `${IMG}Jin  Branco Azul Claro.webp`,
        category: "performance",
        variants: [
          { color: "#bfdbfe", colorName: "Branco Azul Claro", image: `${IMG}Jin  Branco Azul Claro.webp` }
        ],
        stock: 14
      },
      {
        id: "zuno-apex",
        name: "ZUNO APEX",
        tagline: "FOR\xC7A DOS DEUSES.",
        price: 169.9,
        description: "Nomeado em honra ao deus da guerra. Arma\xE7\xE3o premium com acabamento met\xE1lico e lentes de alta defini\xE7\xE3o.",
        features: ["Acabamento Met\xE1lico", "Lentes HD", "Arma\xE7\xE3o Tit\xE2nio", "Garantia Estendida"],
        image: `${IMG}Kansas Premium 3.0  Marrom Preto.webp`,
        category: "performance",
        variants: [
          { color: "#92400e", colorName: "Marrom Preto", image: `${IMG}Kansas Premium 3.0  Marrom Preto.webp` }
        ],
        isNew: true,
        stock: 5
      },
      // === LINHA LIFESTYLE === R$ 169,90
      {
        id: "zuno-arven",
        name: "ZUNO ARVEN",
        tagline: "CORTE PRECISO.",
        price: 169.9,
        description: "Linhas geom\xE9tricas e design minimalista. Para quem valoriza estilo sem abrir m\xE3o da prote\xE7\xE3o.",
        features: ["Design Minimalista", "Lentes Espelhadas", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Metal"],
        image: `${IMG}Ares Premium  Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto", image: `${IMG}Ares Premium  Preto.webp` }
        ],
        isNew: true,
        stock: 5
      },
      {
        id: "zuno-infinity-mirror",
        name: "ZUNO INFINITY MIRROR",
        tagline: "REFLEXO INFINITO.",
        price: 189.9,
        description: "Lentes espelhadas que refletem o mundo. Design futurista para quem est\xE1 sempre \xE0 frente.",
        features: ["Lentes Espelhadas", "Design Futurista", "Arma\xE7\xE3o Metal", "Prote\xE7\xE3o UV400"],
        image: `${IMG}Infinity  Prata Espelhado Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#c0c0c0", colorName: "Prata Espelhado Preto", image: `${IMG}Infinity  Prata Espelhado Preto.webp` }
        ],
        isNew: true,
        stock: 5
      },
      {
        id: "zuno-axiom",
        name: "ZUNO AXIOM",
        tagline: "BRISA DO PARA\xCDSO.",
        price: 169.9,
        description: "Lentes degrad\xEA azul-verde para quem vive perto do mar. Estilo praiano com prote\xE7\xE3o total.",
        features: ["Lentes Degrad\xEA Azul", "Estilo Praiano", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Leve"],
        image: `${IMG}Hawai   Preto Dourado.webp`,
        category: "lifestyle",
        variants: [
          { color: "#eab308", colorName: "Preto Dourado", image: `${IMG}Hawai   Preto Dourado.webp` }
        ],
        isNew: true,
        stock: 5
      },
      {
        id: "zuno-venza-preto-fosco",
        name: "ZUNO VENZA PRETO DEGRAD\xCA BRANCO",
        tagline: "GOLPE DE ESTILO.",
        price: 169.9,
        description: "Arma\xE7\xE3o oversized com lentes degrad\xEA. Presen\xE7a marcante para qualquer ocasi\xE3o.",
        features: ["Formato Oversized", "Lentes Degrad\xEA", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Acetato Premium"],
        image: `${IMG}Devon  Preto Fosco.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto Fosco", image: `${IMG}Devon  Preto Fosco.webp` }
        ],
        stock: 20
      },
      {
        id: "zuno-venza-azul",
        name: "ZUNO VENZA AZUL",
        tagline: "GOLPE DE ESTILO.",
        price: 169.9,
        description: "Arma\xE7\xE3o oversized com lentes azul multicolor. Presen\xE7a marcante para qualquer ocasi\xE3o.",
        features: ["Formato Oversized", "Lentes Azul Multicolor", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Acetato Premium"],
        image: `${IMG}Devon  Azul Multicolors Transparente Cinza.webp`,
        category: "lifestyle",
        variants: [
          { color: "#bfdbfe", colorName: "Azul Multicolors", image: `${IMG}Devon  Azul Multicolors Transparente Cinza.webp` }
        ],
        stock: 18
      },
      {
        id: "zuno-solaris",
        name: "ZUNO SOLARIS",
        tagline: "LUXO SEM LIMITES.",
        price: 169.9,
        description: "Detalhes dourados e presen\xE7a imponente. Para quem vive no topo e n\xE3o aceita menos.",
        features: ["Detalhes Dourados", "Lentes Premium", "Arma\xE7\xE3o Metal/Acetato", "Acabamento Exclusivo"],
        image: `${IMG}Dubai Premium Preto Dourado Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#b8860b", colorName: "Preto Dourado", image: `${IMG}Dubai Premium Preto Dourado Preto.webp` }
        ],
        isNew: true,
        stock: 5
      },
      {
        id: "zuno-mistral",
        name: "ZUNO MISTRAL",
        tagline: "CAMUFLAGEM URBANA.",
        price: 169.9,
        description: "Estilo militar com lentes verdes. Para quem quer se destacar com atitude.",
        features: ["Lentes Verdes", "Estilo Militar", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Resistente"],
        image: `${IMG}Dune  Marrom.webp`,
        category: "lifestyle",
        variants: [
          { color: "#92400e", colorName: "Marrom", image: `${IMG}Dune  Marrom.webp` }
        ],
        stock: 25
      },
      {
        id: "zuno-orvik",
        name: "ZUNO ORVIK",
        tagline: "GEOMETRIA PERFEITA.",
        price: 169.9,
        description: "Formato hexagonal exclusivo com lentes marrom degrad\xEA. Design ic\xF4nico para personalidades marcantes.",
        features: ["Formato Hexagonal", "Lentes Marrom Degrad\xEA", "Arma\xE7\xE3o Metal", "Design Ic\xF4nico"],
        image: `${IMG}Hexagonal B 2.0  Marrom Degrad\xEA.webp`,
        category: "lifestyle",
        variants: [
          { color: "#854d0e", colorName: "Marrom Degrad\xEA", image: `${IMG}Hexagonal B 2.0  Marrom Degrad\xEA.webp` }
        ],
        stock: 30
      },
      {
        id: "zuno-kaori",
        name: "ZUNO KAORI",
        tagline: "ENERGIA PURA.",
        price: 169.9,
        description: "Cores vibrantes para quem n\xE3o passa despercebido. Lentes coloridas com prote\xE7\xE3o UV400.",
        features: ["Lentes Coloridas", "Design Vibrante", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o TR90"],
        image: `${IMG}Mia  Rosa Camuflado.webp`,
        category: "lifestyle",
        variants: [
          { color: "#ec4899", colorName: "Rosa Camuflado", image: `${IMG}Mia  Rosa Camuflado.webp` }
        ],
        stock: 22
      },
      {
        id: "zuno-lumea",
        name: "ZUNO LUMEA",
        tagline: "RASTRO NO DESERTO.",
        price: 169.9,
        description: "Tons quentes e design arenoso. Para quem carrega o sol aonde vai.",
        features: ["Tons Quentes", "Lentes \xC2mbar", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Leve"],
        image: `${IMG}Lorena  Azul.webp`,
        category: "lifestyle",
        variants: [
          { color: "#2563eb", colorName: "Azul", image: `${IMG}Lorena  Azul.webp` }
        ],
        stock: 28
      },
      {
        id: "zuno-savik",
        name: "ZUNO SAVIK",
        tagline: "ACIMA DAS NUVENS.",
        price: 169.9,
        description: "Lentes azuis espelhadas com arma\xE7\xE3o preta. Vis\xE3o privilegiada em qualquer altitude.",
        features: ["Lentes Azuis Espelhadas", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Preta", "Design Premium"],
        image: `${IMG}Aviador Light  Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto", image: `${IMG}Aviador Light  Preto.webp` }
        ],
        stock: 35
      },
      {
        id: "zuno-neroz",
        name: "ZUNO NEROZ",
        tagline: "VIDA COM ESTILO.",
        price: 169.9,
        description: "Cl\xE1ssico reinventado. Arma\xE7\xE3o redonda com lentes escuras para o lifestyle urbano.",
        features: ["Formato Redondo", "Lentes Escuras", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Metal"],
        image: `${IMG}Harper  Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto", image: `${IMG}Harper  Preto.webp` }
        ],
        stock: 40
      },
      {
        id: "zuno-altis",
        name: "ZUNO ALTIS",
        tagline: "SOMBRA URBANA.",
        price: 169.9,
        description: "Design urbano com lentes fum\xEA para o dia a dia. Estilo discreto com prote\xE7\xE3o total.",
        features: ["Lentes Fum\xEA", "Design Urbano", "Prote\xE7\xE3o UV400", "Arma\xE7\xE3o Acetato"],
        image: `${IMG}Verona Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto Fum\xEA", image: `${IMG}Verona Preto.webp` }
        ],
        stock: 45
      },
      {
        id: "zuno-titan",
        name: "ZUNO TITAN",
        tagline: "BRILHO ESCURO.",
        price: 169.9,
        description: "Vers\xE3o premium com lentes degrad\xEA e acabamento sofisticado. Luxo com atitude.",
        features: ["Lentes Degrad\xEA Premium", "Acabamento Sofisticado", "Arma\xE7\xE3o Acetato Premium", "Estojo R\xEDgido"],
        image: `${IMG}Diamond  Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto", image: `${IMG}Diamond  Preto.webp` }
        ],
        isNew: true,
        stock: 5
      },
      {
        id: "zuno-obsidian",
        name: "ZUNO OBSIDIAN",
        tagline: "FORJADO PARA DURAR.",
        price: 169.9,
        description: "Constru\xE7\xE3o premium com materiais de alta resist\xEAncia. O companheiro que aguenta qualquer desafio.",
        features: ["Alta Resist\xEAncia", "Lentes Polarizadas", "Arma\xE7\xE3o Refor\xE7ada", "Garantia Vital\xEDcia"],
        image: `${IMG}Floren\xE7a 2.0  Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#1a1a1a", colorName: "Preto", image: `${IMG}Floren\xE7a 2.0  Preto.webp` }
        ],
        stock: 30
      },
      {
        id: "zuno-infinity-x-preto-dourado",
        name: "ZUNO INFINITY X PRETO DOURADO",
        tagline: "RITMO DOURADO.",
        price: 169.9,
        description: "O esp\xEDrito brasileiro em forma de \xF3culos. Acabamento premium com detalhes que brilham.",
        features: ["Detalhes Dourados", "Lentes Degrad\xEA", "Arma\xE7\xE3o Acetato Premium", "Design Brasileiro"],
        image: `${IMG}Samba  Preto Dourado.webp`,
        category: "lifestyle",
        variants: [
          { color: "#b8860b", colorName: "Preto Dourado", image: `${IMG}Samba  Preto Dourado.webp` }
        ],
        isNew: true,
        stock: 5
      },
      {
        id: "zuno-infinity-x-marrom-degrad\xEA-preto",
        name: "ZUNO INFINITY X MARROM DEGRAD\xCA PRETO",
        tagline: "RITMO DOURADO.",
        price: 169.9,
        description: "O esp\xEDrito brasileiro em forma de \xF3culos. Acabamento premium com degrad\xEA marrom/preto.",
        features: ["Lentes Marrom Degrad\xEA", "Arma\xE7\xE3o Acetato Premium", "Prote\xE7\xE3o UV400", "Design Exclusivo"],
        image: `${IMG}Samba Marrom Degrad\xEA Preto.webp`,
        category: "lifestyle",
        variants: [
          { color: "#92400e", colorName: "Marrom Degrad\xEA Preto", image: `${IMG}Samba Marrom Degrad\xEA Preto.webp` }
        ],
        isNew: true,
        stock: 5
      },
      {
        id: "zuno-infinity-x-marrom-degrad\xEA-rose",
        name: "ZUNO INFINITY X MARROM DEGRAD\xCA ROSE",
        tagline: "RITMO DOURADO.",
        price: 169.9,
        description: "O esp\xEDrito brasileiro em forma de \xF3culos. Acabamento premium com degrad\xEA marrom/ros\xE9.",
        features: ["Lentes Marrom Degrad\xEA Ros\xE9", "Arma\xE7\xE3o Acetato Premium", "Prote\xE7\xE3o UV400", "Design Exclusivo"],
        image: `${IMG}Samba  Marrom Degrad\xEA Rose.webp`,
        category: "lifestyle",
        variants: [
          { color: "#f4a6c0", colorName: "Marrom Degrad\xEA Rose", image: `${IMG}Samba  Marrom Degrad\xEA Rose.webp` }
        ],
        isNew: true,
        stock: 5
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
var DATA_DIR = path.join(__dirname, "../data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
var ORDERS_FILE = path.join(DATA_DIR, "orders.json");
var WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");
var PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
var STOCK_FILE = path.join(DATA_DIR, "stock.json");
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
var users = [];
(async () => {
  const hash = await bcrypt.hash("admin123", 10);
  users.push({ id: 1, email: "admin@zunoglass.com", passwordHash: hash, name: "Admin ZUNO", roles: ["admin", "ops"], isActive: true });
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
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Nome, e-mail e senha s\xE3o obrigat\xF3rios." });
    if (users.find((u) => u.email === email.toLowerCase())) return res.status(409).json({ error: "E-mail j\xE1 cadastrado." });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, email: email.toLowerCase(), passwordHash, name, roles: ["customer"], isActive: true };
    users.push(user);
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
  const user = users.find((u) => u.id === req.authUser.userId);
  if (!user) return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado." });
  res.json({ user: { id: user.id, name: user.name, email: user.email, roles: user.roles, address: {} } });
});
app.put("/api/auth/profile", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.authUser.userId);
  if (!user) return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado." });
  Object.assign(user, req.body);
  res.json({ success: true, user });
});
var _catalogCache = null;
var _stockCache = null;
function slugify(name) {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
async function getProducts() {
  if (_catalogCache) return _catalogCache;
  if (fs.existsSync(PRODUCTS_FILE)) {
    const saved = readJSON(PRODUCTS_FILE, null);
    if (Array.isArray(saved) && saved.length > 0) {
      _catalogCache = saved;
      return _catalogCache;
    }
  }
  try {
    const { catalog: catalog2 } = await Promise.resolve().then(() => (init_catalog(), catalog_exports));
    _catalogCache = catalog2;
    writeJSON(PRODUCTS_FILE, _catalogCache);
  } catch {
    _catalogCache = [];
  }
  return _catalogCache;
}
async function getStock() {
  if (_stockCache) return _stockCache;
  if (fs.existsSync(STOCK_FILE)) {
    const saved = readJSON(STOCK_FILE, null);
    if (saved && typeof saved === "object" && Object.keys(saved).length > 0) {
      _stockCache = saved;
      return _stockCache;
    }
  }
  const products = await getProducts();
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
    const { items, payer, backUrls, externalReference } = req.body;
    const { MercadoPagoConfig, Preference } = await import("mercadopago");
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: "BRL"
        })),
        payer: payer || {},
        back_urls: backUrls || {
          success: `${req.headers.origin || "http://localhost:3000"}/checkout/success`,
          failure: `${req.headers.origin || "http://localhost:3000"}/checkout`,
          pending: `${req.headers.origin || "http://localhost:3000"}/checkout`
        },
        auto_approve: false,
        external_reference: externalReference || `order-${Date.now()}`,
        payment_methods: { installments: 3 }
      }
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
app.get("/api/admin/orders", requireAuth, (_req, res) => {
  res.json(readJSON(ORDERS_FILE));
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
app.post("/api/webhooks/mercadopago", async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type === "payment" && data?.id) {
      const { MercadoPagoConfig, Payment } = await import("mercadopago");
      const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
      const payment = new Payment(client);
      const result = await payment.get({ id: data.id });
      if (result.status === "approved") {
        const orders = readJSON(ORDERS_FILE);
        const order = orders.find((o) => o.paymentId === data.id);
        if (order) {
          order.status = "paid";
          writeJSON(ORDERS_FILE, orders);
        }
      }
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("[Webhook] Error:", e.message);
    res.sendStatus(200);
  }
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
