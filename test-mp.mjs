import { MercadoPagoConfig, Payment } from 'mercadopago';

const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
console.log('Token:', token);
console.log('Token length:', token?.length);
console.log('Token starts with TEST-:', token?.startsWith('TEST-'));

const client = new MercadoPagoConfig({ accessToken: token });
console.log('Client created:', !!client);

try {
  const payment = new Payment(client);
  const result = await payment.create({
    body: {
      transaction_amount: 10,
      payment_method_id: 'pix',
      payer: { email: 'test@test.com' }
    }
  });
  console.log('Payment result:', JSON.stringify(result).slice(0, 200));
} catch (err) {
  console.error('Payment error:', err.message);
  if (err.cause) console.error('Cause:', JSON.stringify(err.cause));
}
