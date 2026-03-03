import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import Admin from './Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  ArrowLeft, Loader2, Package, MapPin, CreditCard,
  Truck, CheckCircle, Clock, AlertCircle, XCircle
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  processing: 'Em Preparo',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const STATUS_ICONS: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400',
  confirmed: 'text-blue-400',
  processing: 'text-orange-400',
  shipped: 'text-purple-400',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
};

const PAYMENT_LABELS: Record<string, string> = {
  stripe: 'Stripe (Cartão)',
  mercadopago: 'Mercado Pago',
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  stripe: 'Cartão de Crédito',
  pix: 'PIX',
  boleto: 'Boleto',
  card: 'Cartão',
};

export default function AdminOrderDetail() {
  const { authenticated, loading, getAuthHeaders } = useAdminAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingCode, setTrackingCode] = useState('');

  useEffect(() => {
    if (authenticated && params.id) loadOrder();
  }, [authenticated, params.id]);

  const loadOrder = async () => {
    setDataLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setItems(data.items || []);
        setNewStatus(data.order.status);
        setTrackingCode(data.order.tracking_code || '');
      } else if (res.status === 404) {
        toast.error('Pedido não encontrado');
        navigate('/admin/orders');
      }
    } catch {
      toast.error('Erro ao carregar pedido');
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}/status`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus, trackingCode: trackingCode || undefined }),
      });
      if (res.ok) {
        toast.success('Status atualizado com sucesso');
        await loadOrder();
      } else {
        toast.error('Erro ao atualizar status');
      }
    } catch {
      toast.error('Erro ao atualizar status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!authenticated) return <Admin />;

  if (dataLoading || !order) {
    return (
      <AdminLayout title="Carregando..." subtitle="">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const StatusIcon = STATUS_ICONS[order.status] || Clock;
  const fmt = (v: number | string) => {
    const n = typeof v === 'string' ? parseFloat(v) : v;
    return `R$ ${n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  return (
    <AdminLayout title={`Pedido ${order.order_number}`} subtitle={`Criado em ${new Date(order.created_at).toLocaleDateString('pt-BR')}`}>
      <div className="space-y-6">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/orders')}
          className="text-gray-400 hover:text-white -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar aos Pedidos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="font-display font-bold text-sm text-white tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" /> ITENS DO PEDIDO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.product_name} className="w-12 h-12 object-cover bg-white/10" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-xs text-white truncate">{item.product_name}</p>
                      {item.variant_color_name && (
                        <p className="font-body text-[10px] text-gray-500">Cor: {item.variant_color_name}</p>
                      )}
                      <p className="font-body text-[10px] text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-sm text-primary">{fmt(item.total_price)}</p>
                      <p className="font-body text-[10px] text-gray-500">{fmt(item.unit_price)} /un</p>
                    </div>
                  </div>
                ))}
                <div className="pt-3 space-y-1">
                  <div className="flex justify-between font-body text-xs text-gray-400">
                    <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-body text-xs text-gray-400">
                    <span>Frete</span><span>{parseFloat(order.shipping_cost) === 0 ? 'Grátis' : fmt(order.shipping_cost)}</span>
                  </div>
                  {parseFloat(order.discount) > 0 && (
                    <div className="flex justify-between font-body text-xs text-green-400">
                      <span>Desconto</span><span>-{fmt(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-display font-bold text-sm text-white border-t border-white/10 pt-2 mt-2">
                    <span>Total</span><span className="text-primary">{fmt(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shipping_zip && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display font-bold text-sm text-white tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> ENDEREÇO DE ENTREGA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-body text-sm text-gray-300 space-y-0.5">
                    <p>{order.shipping_street}{order.shipping_number ? `, ${order.shipping_number}` : ''}</p>
                    {order.shipping_neighborhood && <p>{order.shipping_neighborhood}</p>}
                    <p>{order.shipping_city}{order.shipping_state ? ` — ${order.shipping_state}` : ''}</p>
                    <p className="text-gray-500">CEP: {order.shipping_zip}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="font-display font-bold text-sm text-white tracking-wider">STATUS DO PEDIDO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center gap-2 ${STATUS_COLORS[order.status]}`}>
                  <StatusIcon className="w-5 h-5" />
                  <span className="font-display font-bold text-sm">{STATUS_LABELS[order.status] || order.status}</span>
                </div>

                <div className="space-y-2">
                  <Label className="font-body text-xs text-gray-400">Atualizar Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="bg-black/50 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <SelectItem key={v} value={v} className="text-white hover:bg-white/10">{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(newStatus === 'shipped' || order.tracking_code) && (
                  <div className="space-y-1">
                    <Label className="font-body text-xs text-gray-400">Código de Rastreamento</Label>
                    <Input
                      value={trackingCode}
                      onChange={e => setTrackingCode(e.target.value)}
                      placeholder="Ex: BR123456789BR"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                )}

                <Button
                  onClick={handleUpdateStatus}
                  disabled={updating || (newStatus === order.status && trackingCode === (order.tracking_code || ''))}
                  className="w-full bg-primary text-black hover:bg-white font-display font-bold tracking-wider"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SALVAR ALTERAÇÕES'}
                </Button>
              </CardContent>
            </Card>

            {/* Customer */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="font-display font-bold text-sm text-white tracking-wider">CLIENTE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {order.customer_name && <p className="font-body text-sm text-white">{order.customer_name}</p>}
                <p className="font-body text-xs text-gray-400">{order.customer_email}</p>
                {order.customer_phone && <p className="font-body text-xs text-gray-400">{order.customer_phone}</p>}
                {order.customer_cpf && <p className="font-body text-xs text-gray-500">CPF: {order.customer_cpf}</p>}
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="font-display font-bold text-sm text-white tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" /> PAGAMENTO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-body text-xs text-gray-400">Gateway</span>
                  <span className="font-body text-xs text-white">{PAYMENT_LABELS[order.payment_gateway] || order.payment_gateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-xs text-gray-400">Método</span>
                  <span className="font-body text-xs text-white">{PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-xs text-gray-400">Status</span>
                  <span className={`font-body text-xs font-bold ${order.payment_status === 'paid' ? 'text-green-400' : order.payment_status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {order.payment_status === 'paid' ? 'Pago' : order.payment_status === 'failed' ? 'Falhou' : order.payment_status === 'refunded' ? 'Reembolsado' : 'Pendente'}
                  </span>
                </div>
                {order.payment_id && (
                  <div className="pt-1">
                    <p className="font-body text-[10px] text-gray-600 break-all">{order.payment_id}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
