import { describe, it, expect } from 'vitest';

describe('Mercado Pago Credentials', () => {
  it('should have MERCADO_PAGO_ACCESS_TOKEN set', () => {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    expect(token).toBeDefined();
    expect(token).not.toBe('');
    expect(token).toMatch(/^(TEST|APP_USR)-/);
  });

  it('should have VITE_MERCADO_PAGO_PUBLIC_KEY set', () => {
    const pubKey = process.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
    expect(pubKey).toBeDefined();
    expect(pubKey).not.toBe('');
    expect(pubKey).toMatch(/^(TEST|APP_USR)-/);
  });

  it('should be able to initialize MercadoPago SDK', async () => {
    const { MercadoPagoConfig } = await import('mercadopago');
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    });
    expect(client).toBeDefined();
  });
});
