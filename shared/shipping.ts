/**
 * ZUNO GLASS — Tabela de Frete por Região
 * Baseada nos primeiros dígitos do CEP para determinar a região e calcular frete.
 * Frete grátis apenas para Petrolina (PE) e Juazeiro (BA).
 */

export interface ShippingQuote {
  region: string;
  price: number;
  estimateMin: number; // dias úteis
  estimateMax: number; // dias úteis
  freeShipping: boolean;
  formattedPrice: string;
  estimateText: string;
}

// Cidades com frete grátis (verificadas antes das regiões gerais)
const FREE_SHIPPING_CITIES: { start: number; end: number; city: string }[] = [
  { start: 56300000, end: 56354999, city: "Petrolina — PE" },
  { start: 48900000, end: 48924999, city: "Juazeiro — BA" },
];

const CEP_REGIONS: { start: number; end: number; region: string; price: number; minDays: number; maxDays: number }[] = [
  // São Paulo Capital e Grande SP
  { start: 1000000, end: 9999999, region: "São Paulo — Capital e Grande SP", price: 12.90, minDays: 2, maxDays: 4 },
  // São Paulo Interior
  { start: 11000000, end: 19999999, region: "São Paulo — Interior", price: 12.90, minDays: 3, maxDays: 6 },
  // Rio de Janeiro
  { start: 20000000, end: 28999999, region: "Rio de Janeiro", price: 14.90, minDays: 3, maxDays: 6 },
  // Espírito Santo
  { start: 29000000, end: 29999999, region: "Espírito Santo", price: 16.90, minDays: 4, maxDays: 7 },
  // Minas Gerais
  { start: 30000000, end: 39999999, region: "Minas Gerais", price: 14.90, minDays: 3, maxDays: 7 },
  // Bahia
  { start: 40000000, end: 48999999, region: "Bahia", price: 19.90, minDays: 5, maxDays: 9 },
  // Sergipe
  { start: 49000000, end: 49999999, region: "Sergipe", price: 22.90, minDays: 5, maxDays: 9 },
  // Pernambuco
  { start: 50000000, end: 56999999, region: "Pernambuco", price: 22.90, minDays: 5, maxDays: 10 },
  // Alagoas
  { start: 57000000, end: 57999999, region: "Alagoas", price: 22.90, minDays: 5, maxDays: 10 },
  // Paraíba
  { start: 58000000, end: 58999999, region: "Paraíba", price: 22.90, minDays: 5, maxDays: 10 },
  // Rio Grande do Norte
  { start: 59000000, end: 59999999, region: "Rio Grande do Norte", price: 22.90, minDays: 5, maxDays: 10 },
  // Ceará
  { start: 60000000, end: 63999999, region: "Ceará", price: 24.90, minDays: 6, maxDays: 10 },
  // Piauí
  { start: 64000000, end: 64999999, region: "Piauí", price: 24.90, minDays: 6, maxDays: 10 },
  // Maranhão
  { start: 65000000, end: 65999999, region: "Maranhão", price: 24.90, minDays: 6, maxDays: 12 },
  // Pará
  { start: 66000000, end: 68899999, region: "Pará", price: 29.90, minDays: 7, maxDays: 12 },
  // Amapá
  { start: 68900000, end: 68999999, region: "Amapá", price: 34.90, minDays: 8, maxDays: 14 },
  // Amazonas / Roraima
  { start: 69000000, end: 69399999, region: "Amazonas", price: 34.90, minDays: 8, maxDays: 14 },
  { start: 69300000, end: 69399999, region: "Roraima", price: 34.90, minDays: 8, maxDays: 14 },
  // Acre
  { start: 69900000, end: 69999999, region: "Acre", price: 34.90, minDays: 8, maxDays: 14 },
  // Distrito Federal / Goiás
  { start: 70000000, end: 76799999, region: "Distrito Federal / Goiás", price: 16.90, minDays: 4, maxDays: 8 },
  // Tocantins
  { start: 77000000, end: 77999999, region: "Tocantins", price: 24.90, minDays: 6, maxDays: 10 },
  // Mato Grosso
  { start: 78000000, end: 78899999, region: "Mato Grosso", price: 22.90, minDays: 5, maxDays: 10 },
  // Mato Grosso do Sul
  { start: 79000000, end: 79999999, region: "Mato Grosso do Sul", price: 19.90, minDays: 5, maxDays: 9 },
  // Paraná
  { start: 80000000, end: 87999999, region: "Paraná", price: 14.90, minDays: 3, maxDays: 6 },
  // Santa Catarina
  { start: 88000000, end: 89999999, region: "Santa Catarina", price: 14.90, minDays: 3, maxDays: 7 },
  // Rio Grande do Sul
  { start: 90000000, end: 99999999, region: "Rio Grande do Sul", price: 16.90, minDays: 4, maxDays: 7 },
];

export function calculateShipping(cep: string, _cartTotal?: number): ShippingQuote | null {
  // Limpar CEP (remover traços, espaços)
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) {
    return null;
  }

  const cepNumber = parseInt(cleanCep, 10);

  // Verificar se é cidade com frete grátis (Petrolina ou Juazeiro)
  const freeCity = FREE_SHIPPING_CITIES.find(
    (c) => cepNumber >= c.start && cepNumber <= c.end
  );

  if (freeCity) {
    // Buscar prazo da região correspondente
    const regionInfo = CEP_REGIONS.find(
      (r) => cepNumber >= r.start && cepNumber <= r.end
    );
    const minDays = regionInfo?.minDays ?? 3;
    const maxDays = regionInfo?.maxDays ?? 5;
    return {
      region: freeCity.city,
      price: 0,
      estimateMin: minDays,
      estimateMax: maxDays,
      freeShipping: true,
      formattedPrice: "Grátis",
      estimateText: `${minDays} a ${maxDays} dias úteis`,
    };
  }

  // Encontrar a região
  const regionInfo = CEP_REGIONS.find(
    (r) => cepNumber >= r.start && cepNumber <= r.end
  );

  if (!regionInfo) {
    // CEP não encontrado — usar valor padrão
    return {
      region: "Brasil",
      price: 24.90,
      estimateMin: 5,
      estimateMax: 12,
      freeShipping: false,
      formattedPrice: "R$ 24,90",
      estimateText: "5 a 12 dias úteis",
    };
  }

  return {
    region: regionInfo.region,
    price: regionInfo.price,
    estimateMin: regionInfo.minDays,
    estimateMax: regionInfo.maxDays,
    freeShipping: false,
    formattedPrice: `R$ ${regionInfo.price.toFixed(2).replace(".", ",")}`,
    estimateText: `${regionInfo.minDays} a ${regionInfo.maxDays} dias úteis`,
  };
}

export function isValidCep(cep: string): boolean {
  const cleanCep = cep.replace(/\D/g, "");
  return cleanCep.length === 8 && /^\d{8}$/.test(cleanCep);
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
