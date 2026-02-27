import { describe, it, expect } from "vitest";
import { calculateShipping, isValidCep, formatCep, FREE_SHIPPING_THRESHOLD } from "./shipping";

describe("isValidCep", () => {
  it("should accept valid 8-digit CEPs", () => {
    expect(isValidCep("01001000")).toBe(true);
    expect(isValidCep("01001-000")).toBe(true);
    expect(isValidCep("88000000")).toBe(true);
  });

  it("should reject invalid CEPs", () => {
    expect(isValidCep("")).toBe(false);
    expect(isValidCep("1234")).toBe(false);
    expect(isValidCep("123456789")).toBe(false);
    expect(isValidCep("abcdefgh")).toBe(false);
  });
});

describe("formatCep", () => {
  it("should format CEP with dash", () => {
    expect(formatCep("01001000")).toBe("01001-000");
    expect(formatCep("88000100")).toBe("88000-100");
  });

  it("should handle partial input", () => {
    expect(formatCep("010")).toBe("010");
    expect(formatCep("01001")).toBe("01001");
    expect(formatCep("010010")).toBe("01001-0");
  });

  it("should strip non-digits", () => {
    expect(formatCep("01001-000")).toBe("01001-000");
    expect(formatCep("01.001-000")).toBe("01001-000");
  });

  it("should limit to 8 digits", () => {
    expect(formatCep("0100100099")).toBe("01001-000");
  });
});

describe("calculateShipping", () => {
  it("should return null for invalid CEP", () => {
    expect(calculateShipping("123", 100)).toBeNull();
    expect(calculateShipping("", 100)).toBeNull();
  });

  it("should charge shipping for São Paulo Capital (NOT free anymore)", () => {
    const quote = calculateShipping("01001000", 100);
    expect(quote).not.toBeNull();
    expect(quote!.region).toContain("São Paulo");
    expect(quote!.price).toBe(12.90);
    expect(quote!.freeShipping).toBe(false);
    expect(quote!.formattedPrice).toBe("R$ 12,90");
  });

  it("should give free shipping for São Paulo Capital when cart >= threshold", () => {
    const quote = calculateShipping("01001000", FREE_SHIPPING_THRESHOLD);
    expect(quote).not.toBeNull();
    expect(quote!.region).toContain("São Paulo");
    expect(quote!.price).toBe(0);
    expect(quote!.freeShipping).toBe(true);
    expect(quote!.formattedPrice).toBe("Grátis");
  });

  it("should give free shipping for Petrolina (PE) always", () => {
    const quote = calculateShipping("56304000", 100);
    expect(quote).not.toBeNull();
    expect(quote!.region).toContain("Petrolina");
    expect(quote!.price).toBe(0);
    expect(quote!.freeShipping).toBe(true);
    expect(quote!.formattedPrice).toBe("Grátis");
  });

  it("should give free shipping for Juazeiro (BA) always", () => {
    const quote = calculateShipping("48900000", 100);
    expect(quote).not.toBeNull();
    expect(quote!.region).toContain("Juazeiro");
    expect(quote!.price).toBe(0);
    expect(quote!.freeShipping).toBe(true);
    expect(quote!.formattedPrice).toBe("Grátis");
  });

  it("should calculate shipping for Rio de Janeiro", () => {
    const quote = calculateShipping("20040020", 100);
    expect(quote).not.toBeNull();
    expect(quote!.region).toContain("Rio de Janeiro");
    expect(quote!.price).toBe(14.90);
    expect(quote!.freeShipping).toBe(false);
  });

  it("should calculate shipping for Minas Gerais", () => {
    const quote = calculateShipping("30130000", 100);
    expect(quote).not.toBeNull();
    expect(quote!.region).toContain("Minas Gerais");
    expect(quote!.price).toBe(14.90);
  });

  it("should calculate shipping for Bahia", () => {
    const quote = calculateShipping("40000000", 100);
    expect(quote).not.toBeNull();
    expect(quote!.region).toContain("Bahia");
    expect(quote!.price).toBe(19.90);
  });

  it("should calculate shipping for Paraná", () => {
    const quote = calculateShipping("80000000", 100);
    expect(quote).not.toBeNull();
    expect(quote!.region).toContain("Paraná");
    expect(quote!.price).toBe(14.90);
  });

  it("should calculate shipping for Santa Catarina", () => {
    const quote = calculateShipping("88000000", 100);
    expect(quote).not.toBeNull();
    expect(quote!.region).toContain("Santa Catarina");
    expect(quote!.price).toBe(14.90);
  });

  it("should calculate shipping for Rio Grande do Sul", () => {
    const quote = calculateShipping("90000000", 100);
    expect(quote).not.toBeNull();
    expect(quote!.region).toContain("Rio Grande do Sul");
    expect(quote!.price).toBe(16.90);
  });

  it("should give free shipping when cart total >= threshold", () => {
    const quote = calculateShipping("40000000", FREE_SHIPPING_THRESHOLD);
    expect(quote).not.toBeNull();
    expect(quote!.freeShipping).toBe(true);
    expect(quote!.price).toBe(0);
    expect(quote!.formattedPrice).toBe("Grátis");
  });

  it("should charge shipping when cart total < threshold", () => {
    const quote = calculateShipping("40000000", FREE_SHIPPING_THRESHOLD - 1);
    expect(quote).not.toBeNull();
    expect(quote!.freeShipping).toBe(false);
    expect(quote!.price).toBeGreaterThan(0);
  });

  it("should include estimate text", () => {
    const quote = calculateShipping("01001000", 100);
    expect(quote).not.toBeNull();
    expect(quote!.estimateText).toMatch(/\d+ a \d+ dias úteis/);
    expect(quote!.estimateMin).toBeLessThan(quote!.estimateMax);
  });

  it("should return default for unknown CEP ranges", () => {
    const quote = calculateShipping("00000000", 100);
    expect(quote).not.toBeNull();
  });
});

describe("FREE_SHIPPING_THRESHOLD", () => {
  it("should be R$ 299.90", () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(299.90);
  });
});
