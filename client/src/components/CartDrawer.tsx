import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2, CreditCard, Truck, MapPin, User, ChevronLeft, Eye, EyeOff, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { calculateShipping, isValidCep, formatCep } from '@shared/shipping';
import type { ShippingQuote } from '@shared/shipping';

// checkout-v6-endereco-20260306
type Step = 'cart' | 'form';

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  // Endereço
  cepForm: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, closeCart } = useCart();

  const [step, setStep] = useState<Step>('cart');
  const [cep, setCep] = useState('');
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null);
  const [cepError, setCepError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const [form, setForm] = useState<CustomerForm>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    cepForm: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CustomerForm, string>>>({});

  // Carregar CEP salvo do localStorage
  useEffect(() => {
    const savedCep = localStorage.getItem('zuno_shipping_cep');
    if (savedCep) {
      setCep(formatCep(savedCep));
      const quote = calculateShipping(savedCep, totalPrice);
      if (quote) setShippingQuote(quote);
    }
  }, []);

  // Recalcular frete quando o total do carrinho muda
  useEffect(() => {
    if (shippingQuote && cep) {
      const quote = calculateShipping(cep, totalPrice);
      if (quote) setShippingQuote(quote);
    }
  }, [totalPrice]);

  // Resetar para etapa do carrinho ao fechar
  useEffect(() => {
    if (!isCartOpen) {
      setTimeout(() => setStep('cart'), 300);
    }
  }, [isCartOpen]);

  // Preencher CEP do formulário com o CEP de frete já calculado
  useEffect(() => {
    if (step === 'form' && cep && !form.cepForm) {
      const cleanCep = cep.replace(/\D/g, '');
      setForm(f => ({ ...f, cepForm: formatCep(cleanCep) }));
      fetchAddressByCep(cleanCep);
    }
  }, [step]);

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    setCepError('');
    if (formatted.replace(/\D/g, '').length < 8) {
      setShippingQuote(null);
    }
  };

  const handleCalculateShipping = () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (!isValidCep(cleanCep)) {
      setCepError('CEP inválido. Digite 8 números.');
      setShippingQuote(null);
      return;
    }
    setIsCalculating(true);
    setCepError('');
    setTimeout(() => {
      const quote = calculateShipping(cleanCep, totalPrice);
      if (quote) {
        setShippingQuote(quote);
        localStorage.setItem('zuno_shipping_cep', cleanCep);
      } else {
        setCepError('CEP não encontrado. Verifique e tente novamente.');
      }
      setIsCalculating(false);
    }, 600);
  };

  const fetchAddressByCep = async (cleanCep: string) => {
    if (cleanCep.length !== 8) return;
    setIsFetchingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm(f => ({
          ...f,
          logradouro: data.logradouro || f.logradouro,
          bairro: data.bairro || f.bairro,
          cidade: data.localidade || f.cidade,
          estado: data.uf || f.estado,
        }));
      }
    } catch (_) {}
    setIsFetchingCep(false);
  };

  const handleCepFormChange = (value: string) => {
    const formatted = formatCep(value);
    setForm(f => ({ ...f, cepForm: formatted }));
    const clean = formatted.replace(/\D/g, '');
    if (clean.length === 8) {
      fetchAddressByCep(clean);
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return value;
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CustomerForm, string>> = {};
    if (!form.name.trim() || form.name.trim().split(' ').length < 2) {
      errors.name = 'Informe nome e sobrenome';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'E-mail inválido';
    }
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      errors.phone = 'Telefone inválido';
    }
    const cpfDigits = form.cpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11) {
      errors.cpf = 'CPF inválido';
    }
    if (!form.password || form.password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres';
    }
    // Endereço
    const cepDigits = form.cepForm.replace(/\D/g, '');
    if (cepDigits.length !== 8) {
      errors.cepForm = 'CEP inválido';
    }
    if (!form.logradouro.trim()) {
      errors.logradouro = 'Informe o logradouro';
    }
    if (!form.numero.trim()) {
      errors.numero = 'Informe o número';
    }
    if (!form.bairro.trim()) {
      errors.bairro = 'Informe o bairro';
    }
    if (!form.cidade.trim()) {
      errors.cidade = 'Informe a cidade';
    }
    if (!form.estado.trim()) {
      errors.estado = 'Informe o estado';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);
    try {
      const nameParts = form.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      const phoneDigits = form.phone.replace(/\D/g, '');
      const cpfDigits = form.cpf.replace(/\D/g, '');
      const cepDigits = form.cepForm.replace(/\D/g, '');
      const shippingCost = shippingQuote ? shippingQuote.price : 0;
      const orderId = `order-${Date.now()}`;

      const shippingAddress = {
        cep: cepDigits,
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
      };

      // 1. Cadastrar ou logar o cliente automaticamente
      let accessToken: string | null = null;
      try {
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            address: shippingAddress,
          }),
        });
        const regData = await regRes.json();
        if (regRes.ok) {
          accessToken = regData.accessToken;
        } else if (regRes.status === 409) {
          // E-mail já cadastrado — tentar login
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password }),
          });
          const loginData = await loginRes.json();
          if (loginRes.ok) {
            accessToken = loginData.accessToken;
          }
        }
      } catch (_) {}

      // Salvar token no localStorage para manter sessão
      if (accessToken) {
        localStorage.setItem('zuno_access_token', accessToken);
      }

      // 2. Criar preferência no Mercado Pago
      const prefPayload = {
        items: items.map(item => ({
          id: item.productId,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: 'BRL',
          variantColor: item.variantColor || 'default',
        })),
        payer: {
          first_name: firstName,
          last_name: lastName,
          email: form.email,
          phone: {
            area_code: phoneDigits.slice(0, 2),
            number: phoneDigits.slice(2),
          },
          identification: {
            type: 'CPF',
            number: cpfDigits,
          },
          address: {
            zip_code: cepDigits,
            street_name: form.logradouro,
            street_number: form.numero,
          },
        },
        shippingAddress,
        externalReference: orderId,
        backUrls: {
          success: `${window.location.origin}/minha-conta?tab=pedidos&order=${orderId}`,
          failure: `${window.location.origin}/checkout`,
          pending: `${window.location.origin}/minha-conta?tab=pedidos&order=${orderId}`,
        },
      };

      const response = await fetch('/api/checkout/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefPayload),
      });

      const data = await response.json();

      if (data.initPoint || data.sandboxInitPoint) {
        clearCart();
        closeCart();
        window.location.href = data.initPoint || data.sandboxInitPoint;
      } else {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const installmentValue = totalPrice > 0 ? (totalPrice / 3) : 0;
  const shippingCost = shippingQuote ? shippingQuote.price : 0;
  const grandTotal = totalPrice + shippingCost;
  const grandTotalPix = grandTotal * 0.95;
  const installmentGrandTotal = grandTotal > 0 ? (grandTotal / 3) : 0;

  const inputClass = (field: keyof CustomerForm) =>
    `w-full bg-black/50 border px-3 py-2.5 font-body text-sm text-white placeholder:text-gray-600 focus:outline-none transition-colors ${formErrors[field] ? 'border-red-500' : 'border-white/10 focus:border-primary/50'}`;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-white/10 z-[70] transform transition-transform duration-300 ease-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {step === 'form' && (
              <button
                onClick={() => setStep('cart')}
                className="text-gray-400 hover:text-white transition-colors mr-1"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {step === 'cart' ? (
              <ShoppingBag className="w-5 h-5 text-primary" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
            <h2 className="font-display font-bold text-xl text-white tracking-wider">
              {step === 'cart' ? 'CARRINHO' : 'SEUS DADOS'}
            </h2>
            {step === 'cart' && totalItems > 0 && (
              <span className="bg-primary text-black font-display font-bold text-xs px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ── ETAPA 1: CARRINHO ── */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag className="w-16 h-16 text-gray-700 mb-4" />
                  <p className="font-display font-bold text-xl text-gray-500 tracking-wider">CARRINHO VAZIO</p>
                  <p className="font-body text-sm text-gray-600 mt-2">Adicione produtos para continuar</p>
                  <Link href="/produtos" onClick={closeCart}>
                    <Button className="mt-6 bg-primary text-black hover:bg-white font-display font-bold tracking-wider">
                      VER PRODUTOS
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantColor}`} className="flex gap-4 py-3 border-b border-white/5">
                      <div className="w-16 h-16 bg-white/5 flex-shrink-0 overflow-hidden">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm text-white tracking-wide truncate">{item.name}</p>
                        {item.variantColor && (
                          <p className="font-body text-xs text-gray-500 mt-0.5">{item.variantColor}</p>
                        )}
                        <p className="font-body text-sm text-primary font-bold mt-1">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantColor || '', item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-body text-sm text-white w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantColor || '', item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.productId, item.variantColor || '')}
                            className="ml-auto text-gray-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Frete */}
                  <div className="bg-white/5 border border-white/10 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" />
                      <span className="font-display text-xs text-gray-400 tracking-wider">CALCULAR FRETE</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCalculateShipping()}
                        placeholder="00000-000"
                        maxLength={9}
                        className="flex-1 bg-black/50 border border-white/10 px-3 py-2 font-body text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                      <button
                        onClick={handleCalculateShipping}
                        disabled={isCalculating}
                        className="bg-primary text-black px-4 py-2 font-display font-bold text-xs tracking-wider hover:bg-white transition-colors disabled:opacity-70"
                      >
                        {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'OK'}
                      </button>
                    </div>
                    {cepError && <p className="font-body text-xs text-red-400">{cepError}</p>}
                    {shippingQuote && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-body text-xs text-gray-400">{shippingQuote.carrier} — {shippingQuote.days} dias úteis</span>
                          <span className={`font-body text-xs font-bold ${shippingQuote.freeShipping ? 'text-primary' : 'text-white'}`}>
                            {shippingQuote.formattedPrice}
                          </span>
                        </div>
                        {shippingQuote.freeShipping && (
                          <p className="font-body text-xs text-primary">🎉 Frete grátis aplicado!</p>
                        )}
                      </div>
                    )}
                    <a
                      href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-[10px] text-gray-600 hover:text-gray-400 transition-colors block"
                    >
                      Não sei meu CEP
                    </a>
                  </div>
                </>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                {/* Resumo */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-gray-400">Subtotal</span>
                    <span className="font-body text-sm text-white">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {shippingQuote && (
                    <div className="flex justify-between">
                      <span className="font-body text-sm text-gray-400">Frete</span>
                      <span className={`font-body text-sm font-bold ${shippingQuote.freeShipping ? 'text-primary' : 'text-white'}`}>
                        {shippingQuote.formattedPrice}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="font-display font-bold text-sm text-white tracking-wider">TOTAL</span>
                    <span className="font-display font-bold text-sm text-primary">R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                {/* Info pagamento */}
                <div className="bg-white/5 border border-white/10 p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                    <span className="font-body text-xs text-gray-400">3x de R$ {installmentGrandTotal.toFixed(2).replace('.', ',')} sem juros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-xs text-primary font-bold">PIX</span>
                    <span className="font-body text-xs text-gray-400">R$ {grandTotalPix.toFixed(2).replace('.', ',')} (5% OFF)</span>
                  </div>
                </div>

                {!shippingQuote && (
                  <p className="font-body text-xs text-gray-600 text-center">Informe seu CEP acima para calcular o frete.</p>
                )}

                <Button
                  onClick={() => setStep('form')}
                  className="w-full bg-primary text-black hover:bg-white font-display font-bold text-lg h-14 clip-corner tracking-wider"
                >
                  FINALIZAR COMPRA <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* ── ETAPA 2: FORMULÁRIO ── */}
        {step === 'form' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Resumo do pedido */}
              <div className="bg-white/5 border border-white/10 p-4 space-y-1.5 text-sm">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantColor}`} className="flex justify-between">
                    <span className="font-body text-xs text-gray-300">{item.name} x{item.quantity}</span>
                    <span className="font-body text-xs text-white">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
                {shippingQuote && (
                  <div className="flex justify-between pt-1 border-t border-white/10 mt-1">
                    <span className="font-body text-xs text-gray-400">Frete</span>
                    <span className={`font-body text-xs font-bold ${shippingQuote.freeShipping ? 'text-primary' : 'text-white'}`}>
                      {shippingQuote.formattedPrice}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-white/10 mt-1">
                  <span className="font-display font-bold text-sm text-white tracking-wider">TOTAL</span>
                  <span className="font-display font-bold text-sm text-primary">R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* ── Dados pessoais ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-display text-xs text-gray-400 tracking-wider">DADOS PESSOAIS</span>
                </div>

                <div>
                  <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">NOME COMPLETO *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    className={inputClass('name')}
                  />
                  {formErrors.name && <p className="font-body text-xs text-red-400 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">E-MAIL *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className={inputClass('email')}
                  />
                  {formErrors.email && <p className="font-body text-xs text-red-400 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">TELEFONE / WHATSAPP *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))}
                    placeholder="(00) 00000-0000"
                    className={inputClass('phone')}
                  />
                  {formErrors.phone && <p className="font-body text-xs text-red-400 mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">CPF *</label>
                  <input
                    type="text"
                    value={form.cpf}
                    onChange={(e) => setForm(f => ({ ...f, cpf: formatCpf(e.target.value) }))}
                    placeholder="000.000.000-00"
                    className={inputClass('cpf')}
                  />
                  {formErrors.cpf && <p className="font-body text-xs text-red-400 mt-1">{formErrors.cpf}</p>}
                </div>

                <div>
                  <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">CRIE SUA SENHA *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      className={`w-full bg-black/50 border px-3 py-2.5 pr-10 font-body text-sm text-white placeholder:text-gray-600 focus:outline-none transition-colors ${formErrors.password ? 'border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.password && <p className="font-body text-xs text-red-400 mt-1">{formErrors.password}</p>}
                  <p className="font-body text-[10px] text-gray-600 mt-1">Use essa senha para acessar sua conta e acompanhar seus pedidos.</p>
                </div>
              </div>

              {/* ── Endereço de entrega ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                  <Home className="w-4 h-4 text-primary" />
                  <span className="font-display text-xs text-gray-400 tracking-wider">ENDEREÇO DE ENTREGA</span>
                </div>

                <div>
                  <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">CEP *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.cepForm}
                      onChange={(e) => handleCepFormChange(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      className={inputClass('cepForm')}
                    />
                    {isFetchingCep && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-500" />
                    )}
                  </div>
                  {formErrors.cepForm && <p className="font-body text-xs text-red-400 mt-1">{formErrors.cepForm}</p>}
                </div>

                <div>
                  <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">LOGRADOURO *</label>
                  <input
                    type="text"
                    value={form.logradouro}
                    onChange={(e) => setForm(f => ({ ...f, logradouro: e.target.value }))}
                    placeholder="Rua, Avenida, etc."
                    className={inputClass('logradouro')}
                  />
                  {formErrors.logradouro && <p className="font-body text-xs text-red-400 mt-1">{formErrors.logradouro}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">NÚMERO *</label>
                    <input
                      type="text"
                      value={form.numero}
                      onChange={(e) => setForm(f => ({ ...f, numero: e.target.value }))}
                      placeholder="123"
                      className={inputClass('numero')}
                    />
                    {formErrors.numero && <p className="font-body text-xs text-red-400 mt-1">{formErrors.numero}</p>}
                  </div>
                  <div>
                    <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">COMPLEMENTO</label>
                    <input
                      type="text"
                      value={form.complemento}
                      onChange={(e) => setForm(f => ({ ...f, complemento: e.target.value }))}
                      placeholder="Apto, Bloco..."
                      className="w-full bg-black/50 border border-white/10 px-3 py-2.5 font-body text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">BAIRRO *</label>
                  <input
                    type="text"
                    value={form.bairro}
                    onChange={(e) => setForm(f => ({ ...f, bairro: e.target.value }))}
                    placeholder="Seu bairro"
                    className={inputClass('bairro')}
                  />
                  {formErrors.bairro && <p className="font-body text-xs text-red-400 mt-1">{formErrors.bairro}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">CIDADE *</label>
                    <input
                      type="text"
                      value={form.cidade}
                      onChange={(e) => setForm(f => ({ ...f, cidade: e.target.value }))}
                      placeholder="Sua cidade"
                      className={inputClass('cidade')}
                    />
                    {formErrors.cidade && <p className="font-body text-xs text-red-400 mt-1">{formErrors.cidade}</p>}
                  </div>
                  <div>
                    <label className="font-display text-xs text-gray-400 tracking-wider block mb-1">ESTADO *</label>
                    <input
                      type="text"
                      value={form.estado}
                      onChange={(e) => setForm(f => ({ ...f, estado: e.target.value.toUpperCase().slice(0, 2) }))}
                      placeholder="SP"
                      maxLength={2}
                      className={inputClass('estado')}
                    />
                    {formErrors.estado && <p className="font-body text-xs text-red-400 mt-1">{formErrors.estado}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6">
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-primary text-black hover:bg-white font-display font-bold text-lg h-14 clip-corner tracking-wider disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    PROCESSANDO...
                  </>
                ) : (
                  <>
                    FAZER PAGAMENTO <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
