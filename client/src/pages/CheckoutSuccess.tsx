import { useEffect, useState } from 'react';
import { Link, useSearch } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Package,
  ArrowRight,
  Loader2,
  MapPin,
  FileText,
  Truck,
  Clock,
  Mail,
  Phone,
  Copy,
  Check,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface OrderInfo {
  id: string;
  status: string;
  amount_total: number;
  currency: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping: {
    name: string;
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  } | null;
  shipping_cost: number;
  metadata: Record<string, string>;
  created: number;
  line_items: Array<{
    name: string;
    quantity: number;
    amount: number;
  }>;
}

const TRACKING_STEPS = [
  {
    id: 'confirmed',
    label: 'Pedido Confirmado',
    description: 'Seu pagamento foi aprovado.',
    icon: CheckCircle,
    daysOffset: 0,
  },
  {
    id: 'preparing',
    label: 'Em Preparação',
    description: 'Estamos separando e embalando seu pedido.',
    icon: Package,
    daysOffset: 1,
  },
  {
    id: 'shipped',
    label: 'Enviado',
    description: 'Seu pedido está a caminho.',
    icon: Truck,
    daysOffset: 3,
  },
  {
    id: 'delivered',
    label: 'Entregue',
    description: 'Pedido entregue com sucesso!',
    icon: CheckCircle,
    daysOffset: 10,
  },
];

function getTrackingStatus(createdAt: number): number {
  const now = Date.now();
  const elapsed = now - createdAt * 1000;
  const elapsedDays = elapsed / (1000 * 60 * 60 * 24);

  if (elapsedDays >= 10) return 3;
  if (elapsedDays >= 3) return 2;
  if (elapsedDays >= 1) return 1;
  return 0;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getEstimatedDelivery(createdAt: number, metadata: Record<string, string>): string {
  const estimate = metadata?.shipping_estimate;
  if (estimate) {
    const match = estimate.match(/(\d+)\s*a\s*(\d+)/);
    if (match) {
      const maxDays = parseInt(match[2], 10);
      const deliveryDate = new Date(createdAt * 1000);
      deliveryDate.setDate(deliveryDate.getDate() + maxDays);
      return deliveryDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }
  }
  const deliveryDate = new Date(createdAt * 1000);
  deliveryDate.setDate(deliveryDate.getDate() + 10);
  return deliveryDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function CheckoutSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const sessionId = params.get('session_id');
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setError('Sessão de pagamento não encontrada.');
      return;
    }

    fetch(`/api/order/${sessionId}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar pedido');
        return res.json();
      })
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Não foi possível carregar os detalhes do pedido.');
        setLoading(false);
      });
  }, [sessionId]);

  const orderNumber = order ? `#${order.id.slice(-8).toUpperCase()}` : '';

  const handleCopyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-36 pb-20 container max-w-3xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="font-body text-gray-400">A carregar detalhes do pedido...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h1 className="font-display font-bold text-3xl text-white mb-4">Pedido Processado</h1>
            <p className="font-body text-gray-400 mb-8">{error}</p>
            <Link href="/products">
              <Button className="bg-primary text-black hover:bg-white font-display font-bold tracking-wider clip-corner">
                CONTINUAR COMPRANDO
              </Button>
            </Link>
          </div>
        ) : order ? (
          <div className="space-y-8">

            {/* ── Success Header ── */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 ring-4 ring-primary/10">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
                COMPRA <span className="text-primary">CONFIRMADA</span>
              </h1>
              <p className="font-body text-gray-400 text-lg">
                Obrigado pela sua compra, {order.customer_name || 'atleta'}!
              </p>
              <p className="font-body text-sm text-gray-600 mt-2">
                {formatDate(order.created)}
              </p>
            </div>

            {/* ── Order Number ── */}
            <div className="bg-primary/10 border border-primary/30 p-5 clip-corner flex items-center justify-between">
              <div>
                <p className="font-display text-xs text-gray-500 tracking-widest mb-1">NÚMERO DO PEDIDO</p>
                <p className="font-display font-bold text-2xl text-primary">{orderNumber}</p>
              </div>
              <button
                onClick={handleCopyOrderNumber}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-2 rounded"
              >
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>

            {/* ── Tracking Timeline ── */}
            <div className="bg-white/5 border border-white/10 p-8 clip-corner">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-4 h-4 text-primary" />
                <h3 className="font-display font-bold text-sm text-gray-400 tracking-widest">RASTREAMENTO DO PEDIDO</h3>
              </div>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-5 bottom-5 w-px bg-white/10" />

                <div className="space-y-6">
                  {TRACKING_STEPS.map((step, index) => {
                    const currentStep = getTrackingStatus(order.created);
                    const isCompleted = index <= currentStep;
                    const isActive = index === currentStep;
                    const Icon = step.icon;

                    return (
                      <div key={step.id} className="flex items-start gap-4 relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                            isCompleted
                              ? 'bg-primary text-black'
                              : 'bg-white/5 border border-white/20 text-gray-600'
                          } ${isActive ? 'ring-4 ring-primary/20' : ''}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="pt-1.5">
                          <p className={`font-display font-bold text-sm tracking-wide ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                            {step.label}
                          </p>
                          <p className={`font-body text-xs mt-0.5 ${isCompleted ? 'text-gray-400' : 'text-gray-700'}`}>
                            {step.description}
                          </p>
                        </div>
                        {isActive && (
                          <span className="ml-auto flex-shrink-0 mt-1 text-[10px] font-display font-bold text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                            ATUAL
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estimated delivery */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="font-display text-xs text-gray-500 tracking-widest">PREVISÃO DE ENTREGA</p>
                  <p className="font-display font-bold text-white text-sm mt-0.5">
                    Até {getEstimatedDelivery(order.created, order.metadata)}
                  </p>
                  {order.metadata?.shipping_estimate && (
                    <p className="font-body text-xs text-gray-600 mt-0.5">
                      {order.metadata.shipping_estimate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Order Items ── */}
            <div className="bg-white/5 border border-white/10 p-8 clip-corner space-y-4">
              <h3 className="font-display font-bold text-sm text-gray-400 tracking-widest mb-4">ITENS DO PEDIDO</h3>

              {order.line_items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-display font-bold text-white text-sm block">{item.name}</span>
                      <span className="font-body text-xs text-gray-500">Qtd: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-display font-bold text-primary text-sm">
                    R$ {(item.amount / 100).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}

              {/* Shipping cost */}
              {order.shipping_cost > 0 && (
                <div className="flex items-center justify-between py-2">
                  <span className="font-body text-sm text-gray-500">Frete</span>
                  <span className="font-display text-sm text-gray-400">
                    R$ {(order.shipping_cost / 100).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}
              {order.shipping_cost === 0 && (
                <div className="flex items-center justify-between py-2">
                  <span className="font-body text-sm text-gray-500">Frete</span>
                  <span className="font-display text-sm text-primary font-bold">GRÁTIS</span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-display font-bold text-white text-lg">TOTAL</span>
                <span className="font-display font-bold text-primary text-2xl">
                  R$ {((order.amount_total || 0) / 100).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* ── Customer & Shipping Info ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact */}
              <div className="bg-white/5 border border-white/10 p-6 clip-corner">
                <h3 className="font-display font-bold text-xs text-gray-500 tracking-widest mb-4">CONTATO</h3>
                <div className="space-y-2">
                  {order.customer_email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-body text-gray-300 truncate">{order.customer_email}</span>
                    </div>
                  )}
                  {order.customer_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-body text-gray-300">{order.customer_phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping address */}
              {order.shipping && (
                <div className="bg-white/5 border border-white/10 p-6 clip-corner">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3 className="font-display font-bold text-xs text-gray-500 tracking-widest">ENDEREÇO DE ENTREGA</h3>
                  </div>
                  <div className="font-body text-sm text-gray-300 space-y-1">
                    <p className="font-bold text-white">{order.shipping.name}</p>
                    <p>{order.shipping.address.line1}</p>
                    {order.shipping.address.line2 && <p>{order.shipping.address.line2}</p>}
                    <p>
                      {order.shipping.address.city}, {order.shipping.address.state} — CEP {order.shipping.address.postal_code}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Next Steps ── */}
            <div className="bg-white/5 border border-primary/20 p-8 clip-corner">
              <h3 className="font-display font-bold text-xl text-white mb-4">PRÓXIMOS PASSOS</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rotate-45 mt-2 flex-shrink-0" />
                  <span className="font-body text-gray-400">
                    Você receberá um email de confirmação em <span className="text-gray-300">{order.customer_email}</span> com os detalhes do pedido.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rotate-45 mt-2 flex-shrink-0" />
                  <span className="font-body text-gray-400">O envio será processado em até 3 dias úteis.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rotate-45 mt-2 flex-shrink-0" />
                  <span className="font-body text-gray-400">
                    Prazo de entrega: {order.metadata?.shipping_estimate || '2 a 12 dias úteis'}, conforme a região. Frete grátis para Petrolina (PE) e Juazeiro (BA).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rotate-45 mt-2 flex-shrink-0" />
                  <span className="font-body text-gray-400">Acompanhe o rastreamento pelo email cadastrado.</span>
                </li>
              </ul>
            </div>

            {/* ── CTA ── */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="bg-primary text-black hover:bg-white font-display font-bold tracking-wider clip-corner px-8 h-12">
                  CONTINUAR COMPRANDO <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black font-display font-bold tracking-wider px-8 h-12">
                  <FileText className="w-4 h-4 mr-2" />
                  MEUS PEDIDOS
                </Button>
              </Link>
            </div>

          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
