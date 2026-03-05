import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Loader2, ArrowLeft, CreditCard, QrCode, FileText,
  CheckCircle2, Copy, ExternalLink, ChevronDown, ChevronUp,
  Lock, Truck, ShieldCheck
} from 'lucide-react';
import { formatCep, calculateShipping } from '@shared/shipping';

type PaymentMethod = 'pix' | 'boleto' | 'card';

interface PayerInfo {
  email: string;
  firstName: string;
  lastName: string;
  cpf: string;
  phone: string;
}

interface AddressInfo {
  zip_code: string;
  street_name: string;
  street_number: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface PixResult {
  id: number;
  status: string;
  qr_code: string;
  qr_code_base64: string;
  ticket_url: string;
  expiration: string;
}

interface BoletoResult {
  id: number;
  status: string;
  barcode: string;
  ticket_url: string;
  expiration: string;
}

function formatCPF(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixResult, setPixResult] = useState<PixResult | null>(null);
  const [boletoResult, setBoletoResult] = useState<BoletoResult | null>(null);
  const [cardSuccess, setCardSuccess] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Shipping
  const [cep, setCep] = useState('');
  const shippingQuote = cep.replace(/\D/g, '').length === 8
    ? calculateShipping(cep.replace(/\D/g, ''), totalPrice)
    : null;
  const shippingCost = shippingQuote?.price || 0;

  // Payer info
  const [payer, setPayer] = useState<PayerInfo>({ email: '', firstName: '', lastName: '', cpf: '', phone: '' });
  const [address, setAddress] = useState<AddressInfo>({
    zip_code: '', street_name: '', street_number: '', neighborhood: '', city: '', state: ''
  });

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [installments, setInstallments] = useState(1);

  // Cupom
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0); // valor absoluto de desconto
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setIsCheckingCoupon(true);
    try {
      const res = await fetch(`/api/mp/coupon?code=${encodeURIComponent(code)}&total=${grandTotal}`);
      const data = await res.json();
      if (!res.ok || !data.valid) {
        toast.error(data.error || 'Cupom inválido ou expirado.');
        setCouponDiscount(0);
        setCouponApplied(null);
      } else {
        setCouponDiscount(data.discountAmount);
        setCouponApplied(code);
        toast.success(`Cupom ${code} aplicado! Desconto de R$ ${data.discountAmount.toFixed(2).replace('.', ',')}`);
      }
    } catch {
      toast.error('Erro ao validar cupom.');
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponApplied(null);
  };

  const grandTotal = Math.max(0, totalPrice + shippingCost - couponDiscount);
  const pixTotal = grandTotal * 0.95;

  useEffect(() => {
    const savedCep = localStorage.getItem('zuno_shipping_cep');
    if (savedCep) setCep(formatCep(savedCep));
  }, []);

  useEffect(() => {
    if (items.length === 0 && !pixResult && !boletoResult && !cardSuccess) {
      navigate('/products');
    }
  }, [items.length]);

  const buildItems = () => items.map(item => ({
    productId: item.productId,
    variantColor: item.variantColorName || item.variantColor,
    quantity: item.quantity,
  }));

  const buildExternalRef = () =>
    items.map(i => `${i.productId}|${i.variantColorName || 'default'}|${i.quantity}`).join(';');

  const handlePixPayment = async () => {
    const cpfClean = payer.cpf.replace(/\D/g, '');
    if (!payer.firstName || !payer.lastName) { toast.error('Informe seu nome completo.'); return; }
    if (cpfClean.length !== 11) { toast.error('CPF inválido.'); return; }
    if (!payer.phone || payer.phone.replace(/\D/g, '').length < 10) { toast.error('Informe seu telefone.'); return; }
    if (!payer.email) { toast.error('Informe seu e-mail.'); return; }
    if (!address.zip_code || !address.street_name || !address.city || !address.state) { toast.error('Preencha o endereço de entrega.'); return; }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/mp/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            variantColor: item.variantColorName || item.variantColor,
            quantity: item.quantity,
            unit_price: paymentMethod === 'pix' ? item.price * 0.95 : item.price,
          })),
          payer: {
            email: payer.email,
            first_name: payer.firstName || undefined,
            last_name: payer.lastName || undefined,
            cpf: payer.cpf ? payer.cpf.replace(/\D/g, '') : undefined,
          },
          externalReference: buildExternalRef(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar PIX');
      setPixResult(data);
      clearCart();
    } catch (err: any) {
      toast.error('Erro ao gerar PIX', { description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBoletoPayment = async () => {
    const cpfClean = payer.cpf.replace(/\D/g, '');
    if (!payer.email || cpfClean.length !== 11) {
      toast.error('E-mail e CPF são obrigatórios para boleto.');
      return;
    }
    if (!address.zip_code || !address.street_name || !address.city || !address.state) {
      toast.error('Preencha o endereço completo para boleto.');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/mp/boleto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: buildItems(),
          payer: {
            email: payer.email,
            first_name: payer.firstName,
            last_name: payer.lastName,
            cpf: cpfClean,
          },
          address: {
            zip_code: address.zip_code.replace(/\D/g, ''),
            street_name: address.street_name,
            street_number: address.street_number,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
          },
          externalReference: buildExternalRef(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar boleto');
      setBoletoResult(data);
      clearCart();
    } catch (err: any) {
      toast.error('Erro ao gerar boleto', { description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    const cpfClean = payer.cpf.replace(/\D/g, '');
    if (!payer.firstName || !payer.lastName) { toast.error('Informe seu nome completo.'); return; }
    if (cpfClean.length !== 11) { toast.error('CPF inválido.'); return; }
    if (!payer.phone || payer.phone.replace(/\D/g, '').length < 10) { toast.error('Informe seu telefone.'); return; }
    if (!payer.email) { toast.error('Informe seu e-mail.'); return; }
    if (!address.zip_code || !address.street_name || !address.city || !address.state) { toast.error('Preencha o endereço de entrega.'); return; }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: buildItems(),
          payerEmail: payer.email,
          shippingCost: shippingCost || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar sessão de pagamento');
      if (data.url) {
        toast.info('Redirecionando para o Mercado Pago...');
        window.open(data.url, '_blank');
      } else {
        throw new Error('URL de pagamento não retornada');
      }
    } catch (err: any) {
      toast.error('Erro no pagamento', { description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  // ─── PIX Success Screen ───
  if (pixResult) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container max-w-lg mx-auto px-4 py-24 text-center">
          <div className="bg-white/5 border border-white/10 p-8 space-y-6">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <h1 className="font-display font-bold text-2xl text-white tracking-wider">PIX GERADO!</h1>
            </div>
            <p className="font-body text-gray-400 text-sm">
              Escaneie o QR Code ou copie o código PIX para finalizar o pagamento.
            </p>

            {pixResult.qr_code_base64 && (
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${pixResult.qr_code_base64}`}
                  alt="QR Code PIX"
                  className="w-48 h-48 border-4 border-primary/30"
                />
              </div>
            )}

            {pixResult.qr_code && (
              <div className="space-y-2">
                <p className="font-body text-xs text-gray-500">Código PIX Copia e Cola:</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={pixResult.qr_code}
                    className="flex-1 bg-black/50 border border-white/10 px-3 py-2 font-body text-xs text-gray-300 truncate"
                  />
                  <Button
                    onClick={() => copyToClipboard(pixResult.qr_code)}
                    className="bg-primary text-black hover:bg-white font-display font-bold text-xs px-3"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-primary/10 border border-primary/20 p-3">
              <p className="font-body text-xs text-primary">
                Valor com 5% de desconto PIX: <strong>R$ {pixTotal.toFixed(2).replace('.', ',')}</strong>
              </p>
            </div>

            <p className="font-body text-xs text-gray-600">
              Após o pagamento, você receberá a confirmação por e-mail. O pedido será processado automaticamente.
            </p>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-white/20 text-white font-display font-bold tracking-wider"
            >
              VOLTAR À LOJA
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Boleto Success Screen ───
  if (boletoResult) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container max-w-lg mx-auto px-4 py-24 text-center">
          <div className="bg-white/5 border border-white/10 p-8 space-y-6">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <h1 className="font-display font-bold text-2xl text-white tracking-wider">BOLETO GERADO!</h1>
            </div>
            <p className="font-body text-gray-400 text-sm">
              Seu boleto foi gerado com sucesso. Pague até a data de vencimento.
            </p>

            {boletoResult.barcode && (
              <div className="space-y-2">
                <p className="font-body text-xs text-gray-500">Código de barras:</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={boletoResult.barcode}
                    className="flex-1 bg-black/50 border border-white/10 px-3 py-2 font-body text-xs text-gray-300 truncate"
                  />
                  <Button
                    onClick={() => copyToClipboard(boletoResult.barcode)}
                    className="bg-primary text-black hover:bg-white font-display font-bold text-xs px-3"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {boletoResult.ticket_url && (
              <a
                href={boletoResult.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-primary text-black hover:bg-white font-display font-bold tracking-wider">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ABRIR BOLETO
                </Button>
              </a>
            )}

            <p className="font-body text-xs text-gray-600">
              O pedido será confirmado após a compensação do boleto (até 3 dias úteis).
            </p>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-white/20 text-white font-display font-bold tracking-wider"
            >
              VOLTAR À LOJA
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container max-w-5xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/products')} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-3xl text-white tracking-wider">FINALIZAR COMPRA</h1>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-primary" />
              <span className="font-body text-xs text-gray-400">Pagamento seguro</span>
            </div>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/mercadopago-logo_72baea45.png"
              alt="Mercado Pago"
              className="h-6 object-contain opacity-80"
            />
          </div>
        </div>

        {/* Bandeiras dos cartões */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="font-body text-xs text-gray-500">Aceito:</span>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/bandeiras-cartoes_f4c4174b.png"
            alt="Bandeiras aceitas: Elo, Visa, Mastercard, Hipercard, American Express"
            className="h-6 object-contain"
          />
          <span className="font-body text-xs text-gray-600 ml-1">PIX · Boleto</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Payment Form */}
          <div className="lg:col-span-3 space-y-6">

            {/* Payment Method Selector */}
            <div className="bg-white/5 border border-white/10 p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-white tracking-wider">MÉTODO DE PAGAMENTO</h2>

              <div className="grid grid-cols-3 gap-3">
                {/* PIX */}
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 border transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'pix'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <QrCode className="w-6 h-6" />
                  <span className="font-display font-bold text-xs tracking-wider">PIX</span>
                  <span className="font-body text-[10px] text-green-400">5% OFF</span>
                </button>

                {/* Boleto */}
                <button
                  onClick={() => setPaymentMethod('boleto')}
                  className={`p-4 border transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'boleto'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <FileText className="w-6 h-6" />
                  <span className="font-display font-bold text-xs tracking-wider">BOLETO</span>
                  <span className="font-body text-[10px] text-gray-500">3 dias úteis</span>
                </button>

                {/* Cartão */}
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="font-display font-bold text-xs tracking-wider">CARTÃO</span>
                  <span className="font-body text-[10px] text-gray-500">até 3x s/ juros</span>
                </button>
              </div>
            </div>

            {/* Payer Info */}
            <div className="bg-white/5 border border-white/10 p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-white tracking-wider">DADOS PESSOAIS</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-body text-xs text-gray-400">Nome *</Label>
                  <Input
                    value={payer.firstName}
                    onChange={e => setPayer(p => ({ ...p, firstName: e.target.value }))}
                    placeholder="João"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="font-body text-xs text-gray-400">Sobrenome *</Label>
                  <Input
                    value={payer.lastName}
                    onChange={e => setPayer(p => ({ ...p, lastName: e.target.value }))}
                    placeholder="Silva"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-body text-xs text-gray-400">CPF *</Label>
                  <Input
                    value={payer.cpf}
                    onChange={e => setPayer(p => ({ ...p, cpf: formatCPF(e.target.value) }))}
                    placeholder="000.000.000-00"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="font-body text-xs text-gray-400">Telefone *</Label>
                  <Input
                    value={payer.phone}
                    onChange={e => setPayer(p => ({ ...p, phone: formatPhone(e.target.value) }))}
                    placeholder="(11) 99999-9999"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="font-body text-xs text-gray-400">E-mail *</Label>
                <Input
                  type="email"
                  value={payer.email}
                  onChange={e => setPayer(p => ({ ...p, email: e.target.value }))}
                  placeholder="joao@email.com"
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Address - always shown */}
            <div className="bg-white/5 border border-white/10 p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-white tracking-wider">ENDEREÇO DE ENTREGA</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="font-body text-xs text-gray-400">CEP *</Label>
                    <Input
                      value={address.zip_code}
                      onChange={e => setAddress(a => ({ ...a, zip_code: formatCep(e.target.value) }))}
                      placeholder="00000-000"
                      maxLength={9}
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-body text-xs text-gray-400">Número *</Label>
                    <Input
                      value={address.street_number}
                      onChange={e => setAddress(a => ({ ...a, street_number: e.target.value }))}
                      placeholder="123"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="font-body text-xs text-gray-400">Rua *</Label>
                  <Input
                    value={address.street_name}
                    onChange={e => setAddress(a => ({ ...a, street_name: e.target.value }))}
                    placeholder="Rua das Flores"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="font-body text-xs text-gray-400">Bairro</Label>
                    <Input
                      value={address.neighborhood}
                      onChange={e => setAddress(a => ({ ...a, neighborhood: e.target.value }))}
                      placeholder="Centro"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-body text-xs text-gray-400">Cidade *</Label>
                    <Input
                      value={address.city}
                      onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                      placeholder="São Paulo"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="font-body text-xs text-gray-400">Estado (sigla) *</Label>
                  <Input
                    value={address.state}
                    onChange={e => setAddress(a => ({ ...a, state: e.target.value.toUpperCase().slice(0, 2) }))}
                    placeholder="SP"
                    maxLength={2}
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 w-24"
                  />
                </div>
            </div>

            {/* Card Fields */}
            {paymentMethod === 'card' && (
              <div className="bg-white/5 border border-white/10 p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-white tracking-wider">DADOS DO CARTÃO</h2>
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 p-3">
                  <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-body text-xs text-primary">
                    Pagamento 100% seguro via Mercado Pago. Seus dados são criptografados.
                  </span>
                </div>

                {/* Número do cartão */}
                <div className="space-y-1">
                  <Label className="font-body text-xs text-gray-400">Número do Cartão *</Label>
                  <Input
                    value={cardNumber}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
                      setCardNumber(formatted);
                    }}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 font-mono tracking-widest"
                  />
                </div>

                {/* Nome no cartão */}
                <div className="space-y-1">
                  <Label className="font-body text-xs text-gray-400">Nome no Cartão *</Label>
                  <Input
                    value={cardName}
                    onChange={e => setCardName(e.target.value.toUpperCase())}
                    placeholder="NOME COMO NO CARTÃO"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 uppercase tracking-wider"
                  />
                </div>

                {/* Validade e CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="font-body text-xs text-gray-400">Validade *</Label>
                    <Input
                      value={cardExpiry}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                        const formatted = digits.length > 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits;
                        setCardExpiry(formatted);
                      }}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-body text-xs text-gray-400">CVV *</Label>
                    <Input
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      type="password"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 font-mono"
                    />
                  </div>
                </div>

                {/* Parcelamento */}
                <div className="space-y-1">
                  <Label className="font-body text-xs text-gray-400">Parcelamento</Label>
                  <select
                    value={installments}
                    onChange={e => setInstallments(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 px-3 py-2 font-body text-sm text-white"
                  >
                    <option value={1}>1x de R$ {grandTotal.toFixed(2).replace('.', ',')} (sem juros)</option>
                    <option value={2}>2x de R$ {(grandTotal / 2).toFixed(2).replace('.', ',')} (sem juros)</option>
                    <option value={3}>3x de R$ {(grandTotal / 3).toFixed(2).replace('.', ',')} (sem juros)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Shipping CEP */}
            <div className="bg-white/5 border border-white/10 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <h2 className="font-display font-bold text-sm text-white tracking-wider">CALCULAR FRETE</h2>
              </div>
              <div className="flex gap-2">
                <Input
                  value={cep}
                  onChange={e => setCep(formatCep(e.target.value))}
                  placeholder="00000-000"
                  maxLength={9}
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                />
              </div>
              {shippingQuote && (
                <div className="flex items-center justify-between bg-black/30 border border-white/5 p-3">
                  <span className="font-body text-xs text-gray-400">{shippingQuote.region} · {shippingQuote.estimateText}</span>
                  <span className={`font-display font-bold text-sm ${shippingQuote.freeShipping ? 'text-primary' : 'text-white'}`}>
                    {shippingQuote.formattedPrice}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={
                paymentMethod === 'pix' ? handlePixPayment :
                paymentMethod === 'boleto' ? handleBoletoPayment :
                handleCardPayment
              }
              disabled={isProcessing || items.length === 0}
              className="w-full bg-primary text-black hover:bg-white font-display font-bold text-lg h-14 clip-corner tracking-wider disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  PROCESSANDO...
                </>
              ) : paymentMethod === 'pix' ? (
                <>
                  <QrCode className="w-5 h-5 mr-2" />
                  GERAR PIX — R$ {pixTotal.toFixed(2).replace('.', ',')}
                </>
              ) : paymentMethod === 'boleto' ? (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  GERAR BOLETO — R$ {grandTotal.toFixed(2).replace('.', ',')}
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  PAGAR COM CARTÃO — R$ {grandTotal.toFixed(2).replace('.', ',')}
                </>
              )}
            </Button>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 sticky top-24">
              <button
                className="w-full flex items-center justify-between p-6 lg:cursor-default"
                onClick={() => setShowOrderSummary(v => !v)}
              >
                <h2 className="font-display font-bold text-lg text-white tracking-wider">RESUMO DO PEDIDO</h2>
                <span className="lg:hidden">
                  {showOrderSummary ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </span>
              </button>

              <div className={`px-6 pb-6 space-y-4 ${showOrderSummary ? 'block' : 'hidden lg:block'}`}>
                {/* Items */}
                <div className="space-y-3 border-b border-white/10 pb-4">
                  {items.map(item => (
                    <div key={`${item.productId}-${item.variantColor}`} className="flex gap-3">
                      <div className="w-14 h-14 bg-white/5 flex-shrink-0 flex items-center justify-center p-1">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-xs text-white truncate">{item.name}</p>
                        <p className="font-body text-[10px] text-gray-500">{item.variantColorName} × {item.quantity}</p>
                        <p className="font-display font-bold text-xs text-primary mt-1">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Campo de Cupom */}
                <div className="space-y-2 border-b border-white/10 pb-4">
                  <p className="font-display font-bold text-xs text-white tracking-wider">CUPOM DE DESCONTO</p>
                  {couponApplied ? (
                    <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-3 py-2">
                      <span className="font-display font-bold text-xs text-primary tracking-wider">{couponApplied}</span>
                      <button onClick={removeCoupon} className="text-gray-400 hover:text-white text-xs font-body transition-colors">remover</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="SEU CUPOM"
                        className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 font-display tracking-wider text-xs h-9"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={isCheckingCoupon || !couponCode.trim()}
                        size="sm"
                        className="bg-primary text-black hover:bg-white font-display font-bold text-xs tracking-wider h-9 px-3 flex-shrink-0"
                      >
                        {isCheckingCoupon ? <Loader2 className="w-3 h-3 animate-spin" /> : 'APLICAR'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-gray-400">Subtotal</span>
                    <span className="font-display font-bold text-sm text-white">
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-gray-400">Frete</span>
                    <span className={`font-display font-bold text-sm ${shippingQuote?.freeShipping ? 'text-primary' : 'text-white'}`}>
                      {shippingQuote ? shippingQuote.formattedPrice : '—'}
                    </span>
                  </div>
                  {couponApplied && couponDiscount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-primary">Cupom {couponApplied}</span>
                      <span className="font-display font-bold text-sm text-primary">
                        − R$ {couponDiscount.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  )}
                  {paymentMethod === 'pix' && (
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-green-400">Desconto PIX (5%)</span>
                      <span className="font-display font-bold text-sm text-green-400">
                        − R$ {(grandTotal * 0.05).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                    <span className="font-display font-bold text-base text-white tracking-wider">TOTAL</span>
                    <span className="font-display font-bold text-xl text-primary">
                      R$ {(paymentMethod === 'pix' ? pixTotal : grandTotal).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-body text-xs text-gray-500">Compra 100% segura e protegida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-body text-xs text-gray-500">Entrega para todo o Brasil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
