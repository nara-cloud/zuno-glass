import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import Admin from './Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Loader2, Package, Scissors, CheckCheck,
  Truck, PackageCheck, CheckCircle2, ArrowRight,
  XCircle, User, MapPin, CreditCard, Clock
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Pipeline de etapas ───────────────────────────────────────────────────────
const PIPELINE = [
  { key: 'em_separacao', label: 'Pedido Recebido',   icon: Package,      color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/30' },
  { key: 'preparando',   label: 'Em Preparação',     icon: Scissors,     color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  { key: 'pronto',       label: 'Pedido Pronto',     icon: CheckCheck,   color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  { key: 'saiu_entrega', label: 'Saiu para Entrega', icon: Truck,        color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  { key: 'entregue',     label: 'Entregue',          icon: PackageCheck, color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/30' },
];

function getStageIndex(status: string) {
  return PIPELINE.findIndex(s => s.key === status);
}
function getNextStage(status: string) {
  const idx = getStageIndex(status);
  if (idx === -1 || idx >= PIPELINE.length - 1) return null;
  return PIPELINE[idx + 1];
}

export default function AdminOrderDetail() {
  const { authenticated, loading, getAuthHeaders } = useAdminAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const [order, setOrder] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    if (!authenticated || !orderId) return;
    setOrderLoading(true);
    fetch(`/api/admin/orders/${orderId}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setOrder(data); })
      .catch(() => toast.error('Erro ao carregar pedido'))
      .finally(() => setOrderLoading(false));
  }, [authenticated, orderId, getAuthHeaders]);

  const handleAdvance = async (nextStatus: string) => {
    setAdvancing(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        const stage = PIPELINE.find(s => s.key === nextStatus);
        toast.success(`Pedido avançado para: ${stage?.label}`);
      } else {
        toast.error('Erro ao atualizar etapa');
      }
    } catch {
      toast.error('Erro ao atualizar etapa');
    } finally {
      setAdvancing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancelar este pedido?')) return;
    setAdvancing(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelado' }),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        toast.success('Pedido cancelado');
      } else {
        toast.error('Erro ao cancelar');
      }
    } catch {
      toast.error('Erro ao cancelar');
    } finally {
      setAdvancing(false);
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

  if (orderLoading) {
    return (
      <AdminLayout title="Pedido" subtitle="Carregando...">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Pedido" subtitle="Não encontrado">
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <p>Pedido não encontrado</p>
          <Button variant="ghost" onClick={() => navigate('/admin/orders')} className="mt-4 text-gray-400">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const currentIdx = getStageIndex(order.status);
  const nextStage = getNextStage(order.status);
  const customerName = order.customerName ||
    (order.payer ? `${order.payer.first_name || ''} ${order.payer.last_name || ''}`.trim() : '') || '—';
  const customerEmail = order.customerEmail || order.payer?.email || '—';
  const customerPhone = order.customerPhone || order.payer?.phone || '—';
  const total = parseFloat(order.total || order.amount || 0);

  return (
    <AdminLayout
      title={`Pedido ${order.orderNumber || order.id}`}
      subtitle={order.createdAt ? new Date(order.createdAt).toLocaleString('pt-BR') : ''}
    >
      <div className="space-y-4">
        {/* Botão voltar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/orders')}
          className="text-gray-400 hover:text-white -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Pedidos
        </Button>

        {/* Pipeline visual */}
        <Card className="bg-white/3 border-white/8">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-sm text-white">Etapa do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Barra de progresso com círculos */}
            <div className="flex items-start gap-0 mb-6 overflow-x-auto pb-2">
              {PIPELINE.map((stage, idx) => {
                const done = currentIdx !== -1 && idx < currentIdx;
                const active = idx === currentIdx;
                const Icon = stage.icon;
                // Buscar timestamp do histórico
                const historyEntry = order.statusHistory
                  ? [...(order.statusHistory as any[])].reverse().find(h => h.status === stage.key)
                  : null;

                return (
                  <div key={stage.key} className="flex items-start flex-shrink-0">
                    <div className="flex flex-col items-center gap-1 px-2 sm:px-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        done   ? 'bg-green-400/20 border-green-400 text-green-400' :
                        active ? `${stage.bg} ${stage.border} ${stage.color}` :
                                 'bg-white/3 border-white/10 text-gray-600'
                      }`}>
                        {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <p className={`font-body text-[10px] text-center leading-tight max-w-[72px] ${
                        done ? 'text-green-400' : active ? stage.color : 'text-gray-600'
                      }`}>{stage.label}</p>
                      {historyEntry && (
                        <p className="font-body text-[9px] text-gray-600 text-center">
                          {new Date(historyEntry.changedAt).toLocaleString('pt-BR', {
                            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                    {idx < PIPELINE.length - 1 && (
                      <div className={`h-0.5 w-6 sm:w-8 mt-5 flex-shrink-0 ${
                        (currentIdx !== -1 && idx < currentIdx) ? 'bg-green-400/40' : 'bg-white/8'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Botões de ação */}
            <div className="flex flex-wrap gap-3 items-center">
              {order.status === 'cancelado' ? (
                <span className="flex items-center gap-2 text-red-400 font-body text-sm">
                  <XCircle className="w-4 h-4" /> Pedido Cancelado
                </span>
              ) : order.status === 'entregue' ? (
                <span className="flex items-center gap-2 text-green-400 font-body text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Pedido Entregue — Concluído
                </span>
              ) : (
                <>
                  {nextStage && (
                    <Button
                      onClick={() => handleAdvance(nextStage.key)}
                      disabled={advancing}
                      className="bg-primary hover:bg-primary/90 text-black font-display font-bold"
                    >
                      {advancing
                        ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        : <ArrowRight className="w-4 h-4 mr-2" />
                      }
                      Avançar para: {nextStage.label}
                    </Button>
                  )}
                  {order.status === 'pending' && (
                    <Button
                      onClick={() => handleAdvance('em_separacao')}
                      disabled={advancing}
                      className="bg-blue-500 hover:bg-blue-400 text-white font-display font-bold"
                    >
                      {advancing
                        ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        : <Package className="w-4 h-4 mr-2" />
                      }
                      Confirmar Recebimento
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={advancing}
                    className="border-red-400/30 text-red-400 hover:bg-red-400/10 hover:border-red-400"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancelar Pedido
                  </Button>
                </>
              )}
            </div>

            {/* Histórico de etapas */}
            {order.statusHistory && (order.statusHistory as any[]).length > 0 && (
              <div className="mt-4 border-t border-white/5 pt-4">
                <p className="font-display text-xs text-gray-500 mb-2 tracking-wider">HISTÓRICO DE ETAPAS</p>
                <div className="space-y-1.5">
                  {[...(order.statusHistory as any[])].reverse().map((entry: any, idx: number) => {
                    const stage = PIPELINE.find(s => s.key === entry.status);
                    return (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-body">
                        <Clock className="w-3 h-3 text-gray-600 flex-shrink-0" />
                        <span className={stage?.color || 'text-gray-400'}>
                          {stage?.label || entry.status}
                        </span>
                        <span className="text-gray-600">—</span>
                        <span className="text-gray-500">
                          {new Date(entry.changedAt).toLocaleString('pt-BR')}
                        </span>
                        {entry.note && (
                          <span className="text-gray-600">· {entry.note}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dados do cliente */}
          <Card className="bg-white/3 border-white/8">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm text-white flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-body text-xs text-gray-500">Nome</p>
                <p className="font-body text-sm text-white">{customerName}</p>
              </div>
              <div>
                <p className="font-body text-xs text-gray-500">E-mail</p>
                <p className="font-body text-sm text-white">{customerEmail}</p>
              </div>
              {customerPhone !== '—' && (
                <div>
                  <p className="font-body text-xs text-gray-500">Telefone</p>
                  <p className="font-body text-sm text-white">{customerPhone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagamento */}
          <Card className="bg-white/3 border-white/8">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" /> Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-body text-xs text-gray-500">Total</p>
                <p className="font-display font-bold text-lg text-primary">
                  R$ {total.toFixed(2).replace('.', ',')}
                </p>
              </div>
              {order.shippingCost > 0 && (
                <div>
                  <p className="font-body text-xs text-gray-500">Frete</p>
                  <p className="font-body text-sm text-white">
                    R$ {parseFloat(order.shippingCost).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              )}
              {order.paymentMethod && (
                <div>
                  <p className="font-body text-xs text-gray-500">Método</p>
                  <p className="font-body text-sm text-white capitalize">{order.paymentMethod}</p>
                </div>
              )}
              {order.paymentId && (
                <div>
                  <p className="font-body text-xs text-gray-500">ID Pagamento</p>
                  <p className="font-body text-xs text-gray-400 break-all">{order.paymentId}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Itens do pedido */}
        <Card className="bg-white/3 border-white/8">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-sm text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> Itens do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(order.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="font-body text-sm text-white">
                      {item.title || item.name || item.productId}
                    </p>
                    {item.variantColor && (
                      <p className="font-body text-xs text-gray-500">Cor: {item.variantColor}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-body text-xs text-gray-400">Qtd: {item.quantity}</p>
                    {(item.unit_price || item.price) && (
                      <p className="font-body text-sm text-white">
                        R$ {((item.unit_price || item.price) * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Endereço de entrega */}
        {(order.shippingAddress || order.address || order.payer?.address) && (
          <Card className="bg-white/3 border-white/8">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const addr = order.shippingAddress || order.address || order.payer?.address || {};
                const parts = [
                  addr.street || addr.logradouro,
                  addr.number || addr.numero,
                  addr.complement || addr.complemento,
                  addr.neighborhood || addr.bairro,
                  addr.city || addr.cidade,
                  addr.state || addr.estado,
                  addr.zipCode || addr.cep,
                ].filter(Boolean);
                return (
                  <p className="font-body text-sm text-gray-300">{parts.join(', ')}</p>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
