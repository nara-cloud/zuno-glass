import { MercadoPagoConfig, Payment } from "mercadopago";

// Initialize Mercado Pago client
let mpClient: MercadoPagoConfig | null = null;

export function getMercadoPagoClient(): MercadoPagoConfig {
  if (!mpClient) {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("MERCADO_PAGO_ACCESS_TOKEN not configured");
    }
    mpClient = new MercadoPagoConfig({ accessToken });
  }
  return mpClient;
}

export interface MPPaymentItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

export interface MPPayerInfo {
  email: string;
  first_name?: string;
  last_name?: string;
  cpf?: string;
}

export interface MPAddressInfo {
  zip_code?: string;
  street_name?: string;
  street_number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

// ─── Create PIX Payment ───
export async function createPixPayment(params: {
  items: MPPaymentItem[];
  payer: MPPayerInfo;
  address?: MPAddressInfo;
  externalReference?: string;
  notificationUrl?: string;
}) {
  const client = getMercadoPagoClient();
  const payment = new Payment(client);

  const totalAmount = params.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const result = await payment.create({
    body: {
      transaction_amount: Math.round(totalAmount * 100) / 100,
      description: params.items.map((i) => i.title).join(", "),
      payment_method_id: "pix",
      payer: {
        email: params.payer.email,
        first_name: params.payer.first_name,
        last_name: params.payer.last_name,
        identification: params.payer.cpf
          ? { type: "CPF", number: params.payer.cpf }
          : undefined,
        address: params.address
          ? {
              zip_code: params.address.zip_code,
              street_name: params.address.street_name,
              street_number: params.address.street_number,
              neighborhood: params.address.neighborhood,
              city: params.address.city,
              federal_unit: params.address.state,
            }
          : undefined,
      },
      external_reference: params.externalReference,
      notification_url: params.notificationUrl,
      additional_info: {
        items: params.items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      },
    },
  });

  return {
    id: result.id,
    status: result.status,
    qr_code: result.point_of_interaction?.transaction_data?.qr_code,
    qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
    ticket_url: result.point_of_interaction?.transaction_data?.ticket_url,
    expiration: result.date_of_expiration,
  };
}

// ─── Create Boleto Payment ───
export async function createBoletoPayment(params: {
  items: MPPaymentItem[];
  payer: MPPayerInfo & { cpf: string };
  address: MPAddressInfo;
  externalReference?: string;
  notificationUrl?: string;
}) {
  const client = getMercadoPagoClient();
  const payment = new Payment(client);

  const totalAmount = params.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const result = await payment.create({
    body: {
      transaction_amount: Math.round(totalAmount * 100) / 100,
      description: params.items.map((i) => i.title).join(", "),
      payment_method_id: "bolbradesco",
      payer: {
        email: params.payer.email,
        first_name: params.payer.first_name,
        last_name: params.payer.last_name,
        identification: { type: "CPF", number: params.payer.cpf },
        address: {
          zip_code: params.address.zip_code,
          street_name: params.address.street_name,
          street_number: params.address.street_number,
          neighborhood: params.address.neighborhood,
          city: params.address.city,
          federal_unit: params.address.state,
        },
      },
      external_reference: params.externalReference,
      notification_url: params.notificationUrl,
      additional_info: {
        items: params.items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      },
    },
  });

  return {
    id: result.id,
    status: result.status,
    barcode: (result as any).barcode?.content,
    ticket_url: result.transaction_details?.external_resource_url,
    expiration: result.date_of_expiration,
  };
}

// ─── Create Credit Card Payment ───
export async function createCardPayment(params: {
  items: MPPaymentItem[];
  payer: MPPayerInfo & { cpf: string };
  token: string;
  installments: number;
  issuerId?: string;
  paymentMethodId: string;
  externalReference?: string;
  notificationUrl?: string;
}) {
  const client = getMercadoPagoClient();
  const payment = new Payment(client);

  const totalAmount = params.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const result = await payment.create({
    body: {
      transaction_amount: Math.round(totalAmount * 100) / 100,
      description: params.items.map((i) => i.title).join(", "),
      payment_method_id: params.paymentMethodId,
      token: params.token,
      installments: params.installments,
      issuer_id: params.issuerId ? parseInt(params.issuerId) : undefined,
      payer: {
        email: params.payer.email,
        identification: { type: "CPF", number: params.payer.cpf },
      },
      external_reference: params.externalReference,
      notification_url: params.notificationUrl,
      additional_info: {
        items: params.items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      },
    },
  });

  return {
    id: result.id,
    status: result.status,
    status_detail: result.status_detail,
    last_four_digits: (result as any).card?.last_four_digits,
    installments: result.installments,
    installment_amount: result.transaction_details?.installment_amount,
  };
}

// ─── Get Payment Status ───
export async function getPaymentStatus(paymentId: number) {
  const client = getMercadoPagoClient();
  const payment = new Payment(client);
  const result = await payment.get({ id: paymentId });
  return {
    id: result.id,
    status: result.status,
    status_detail: result.status_detail,
    amount: result.transaction_amount,
    currency: result.currency_id,
    payment_method: result.payment_method_id,
    payer_email: result.payer?.email,
    external_reference: result.external_reference,
    created: result.date_created,
    approved: result.date_approved,
  };
}

// ─── Create Checkout Pro Preference ───
export async function createPreference(params: {
  items: MPPaymentItem[];
  externalReference?: string;
  notificationUrl?: string;
  successUrl: string;
  failureUrl: string;
  pendingUrl: string;
  payerEmail?: string;
  shippingCost?: number;
}) {
  const { Preference } = await import("mercadopago");
  const client = getMercadoPagoClient();
  const preference = new Preference(client);

  const body: any = {
    items: params.items.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: Math.round(item.unit_price * 100) / 100,
      currency_id: "BRL",
    })),
    back_urls: {
      success: params.successUrl,
      failure: params.failureUrl,
      pending: params.pendingUrl,
    },
    auto_return: "approved",
    external_reference: params.externalReference,
    notification_url: params.notificationUrl,
    payment_methods: {
      installments: 3,
    },
  };

  if (params.payerEmail) {
    body.payer = { email: params.payerEmail };
  }

  if (params.shippingCost && params.shippingCost > 0) {
    body.shipments = {
      cost: Math.round(params.shippingCost * 100) / 100,
      mode: "not_specified",
    };
  }

  const result = await preference.create({ body });

  return {
    id: result.id,
    init_point: result.init_point,
    sandbox_init_point: result.sandbox_init_point,
  };
}
