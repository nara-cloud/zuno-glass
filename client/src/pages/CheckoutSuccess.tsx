import { useEffect, useState } from 'react';
import { Link, useSearch } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ArrowRight, Loader2, MapPin, FileText } from 'lucide-react';
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
  metadata: Record<string, string>;
  created: number;
  line_items: Array<{
    name: string;
    quantity: number;
    amount: number;
  }>;
}

export default function CheckoutSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const sessionId = params.get('session_id');
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful checkout
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-36 pb-20 container max-w-2xl">
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
            {/* Success Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
                COMPRA <span className="text-primary">CONFIRMADA</span>
              </h1>
              <p className="font-body text-gray-400 text-lg">
                Obrigado pela sua compra, {order.customer_name || 'atleta'}!
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-white/5 border border-white/10 p-8 clip-corner space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-display text-sm text-gray-500 tracking-wider">PEDIDO</span>
                <span className="font-display font-bold text-sm text-white">#{order.id.slice(-8).toUpperCase()}</span>
              </div>

              {order.line_items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <span className="font-display font-bold text-white block">{item.name}</span>
                    <span className="font-body text-sm text-gray-500">Qtd: {item.quantity}</span>
                  </div>
                  <span className="font-display font-bold text-primary">
                    R$ {(item.amount / 100).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-display font-bold text-white text-lg">TOTAL</span>
                <span className="font-display font-bold text-primary text-2xl">
                  R$ {((order.amount_total || 0) / 100).toFixed(2).replace('.', ',')}
                </span>
              </div>

              {order.customer_email && (
                <p className="font-body text-sm text-gray-500">
                  Confirmação enviada para <span className="text-gray-300">{order.customer_email}</span>
                </p>
              )}
            </div>

            {/* Shipping Address */}
            {order.shipping && (
              <div className="bg-white/5 border border-white/10 p-6 clip-corner">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-bold text-sm text-gray-400 tracking-widest">ENDEREÇO DE ENTREGA</h3>
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

            {/* Next Steps */}
            <div className="bg-white/5 border border-primary/20 p-8 clip-corner">
              <h3 className="font-display font-bold text-xl text-white mb-4">PRÓXIMOS PASSOS</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rotate-45 mt-2 flex-shrink-0"></div>
                  <span className="font-body text-gray-400">Você receberá um email de confirmação com os detalhes do pedido.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rotate-45 mt-2 flex-shrink-0"></div>
                  <span className="font-body text-gray-400">O envio será processado em até 3 dias úteis.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rotate-45 mt-2 flex-shrink-0"></div>
                  <span className="font-body text-gray-400">Prazo de entrega: 5 a 10 dias úteis. Frete grátis para Petrolina e Juazeiro, ou em compras acima de R$ 299,90.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rotate-45 mt-2 flex-shrink-0"></div>
                  <span className="font-body text-gray-400">Acompanhe o rastreamento pelo email cadastrado.</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
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
