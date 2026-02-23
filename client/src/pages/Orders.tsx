import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Package, Search, Loader2, MapPin, Mail, Clock, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { Link } from 'wouter';

interface OrderLineItem {
  name: string;
  quantity: number;
  amount: number;
}

interface Order {
  id: string;
  status: string;
  amount_total: number;
  currency: string;
  customer_email: string;
  customer_name: string;
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
  metadata: Record<string, string>;
  created: number;
  line_items: OrderLineItem[];
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',');
}

function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white/5 border border-white/10 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-white text-sm">
                Pedido #{order.id.slice(-8).toUpperCase()}
              </span>
              <span className="bg-green-500/20 text-green-400 font-display text-xs px-2 py-0.5 border border-green-500/30">
                PAGO
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-body text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(order.created)}
              </span>
              <span className="font-body text-xs text-gray-500">
                {order.line_items?.length || 0} {(order.line_items?.length || 0) === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-lg text-primary">
            R$ {formatPrice(order.amount_total)}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-white/10 p-6 space-y-6">
          {/* Items */}
          <div>
            <h4 className="font-display font-bold text-xs text-gray-400 tracking-widest mb-3">ITENS</h4>
            <div className="space-y-3">
              {order.line_items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 p-3 border border-white/5">
                  <div>
                    <span className="font-display font-bold text-sm text-white">{item.name}</span>
                    <span className="font-body text-xs text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-display font-bold text-sm text-white">
                    R$ {formatPrice(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          {order.shipping && (
            <div>
              <h4 className="font-display font-bold text-xs text-gray-400 tracking-widest mb-3">ENTREGA</h4>
              <div className="flex items-start gap-3 bg-white/5 p-4 border border-white/5">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="font-body text-sm text-gray-300">
                  <p className="font-bold text-white">{order.shipping.name}</p>
                  <p>{order.shipping.address.line1}</p>
                  {order.shipping.address.line2 && <p>{order.shipping.address.line2}</p>}
                  <p>
                    {order.shipping.address.city}, {order.shipping.address.state} — CEP {order.shipping.address.postal_code}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="flex items-center gap-2 text-gray-500">
            <Mail className="w-3 h-3" />
            <span className="font-body text-xs">{order.customer_email}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao buscar pedidos');
      }

      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar pedidos. Tente novamente.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-black/50 backdrop-blur-sm px-4 py-2 mb-6">
            <Package className="w-4 h-4 text-primary" />
            <span className="font-display text-primary text-sm tracking-widest">ACOMPANHE SEUS PEDIDOS</span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            MEUS <span className="text-primary">PEDIDOS</span>
          </h1>
          <p className="font-body text-gray-400 max-w-md mx-auto mb-10">
            Consulte o histórico das suas compras ZUNO GLASS utilizando o email da compra.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 text-white font-body placeholder:text-gray-600 focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-black hover:bg-white font-display font-bold tracking-wider h-14 px-8 clip-corner"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  BUSCAR
                </>
              )}
            </Button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="pb-24">
        <div className="container max-w-3xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 text-center mb-8">
              <p className="font-body text-sm text-red-400">{error}</p>
            </div>
          )}

          {hasSearched && !isLoading && orders.length === 0 && !error && (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl text-gray-500 mb-2">
                NENHUM PEDIDO ENCONTRADO
              </h3>
              <p className="font-body text-sm text-gray-600 mb-6">
                Não encontramos pedidos associados a este email. Verifique se o email está correto.
              </p>
              <Link href="/products">
                <Button className="bg-primary text-black hover:bg-white font-display font-bold tracking-wider clip-corner">
                  VER COLEÇÃO
                </Button>
              </Link>
            </div>
          )}

          {orders.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <span className="font-display font-bold text-sm text-gray-400 tracking-widest">
                  {orders.length} {orders.length === 1 ? 'PEDIDO' : 'PEDIDOS'} ENCONTRADO{orders.length > 1 ? 'S' : ''}
                </span>
              </div>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
