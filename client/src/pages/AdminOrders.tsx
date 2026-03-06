import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import Admin from './Admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Search, Loader2, ChevronLeft, ChevronRight, Eye, RefreshCw,
  CheckCircle2, Circle, ArrowRight, Package, Scissors, CheckCheck,
  Truck, PackageCheck, XCircle
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Pipeline de etapas ───────────────────────────────────────────────────────
const PIPELINE = [
  { key: 'em_separacao', label: 'Pedido Recebido',      icon: Package,      color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/30' },
  { key: 'preparando',   label: 'Em Preparação',        icon: Scissors,     color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  { key: 'pronto',       label: 'Pedido Pronto',        icon: CheckCheck,   color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  { key: 'saiu_entrega', label: 'Saiu para Entrega',    icon: Truck,        color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  { key: 'entregue',     label: 'Entregue',             icon: PackageCheck, color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/30' },
];

const EXTRA_STATUS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:    { label: 'Aguardando Pagamento', color: 'text-gray-400',   bg: 'bg-gray-400/10',   border: 'border-gray-400/30' },
  paid:       { label: 'Pago',                color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/30' },
  cancelado:  { label: 'Cancelado',           color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/30' },
};

const ALL_STATUS_FILTER = [
  { value: 'all',          label: 'Todos' },
  { value: 'pending',      label: 'Aguardando Pagamento' },
  { value: 'em_separacao', label: 'Pedido Recebido' },
  { value: 'preparando',   label: 'Em Preparação' },
  { value: 'pronto',       label: 'Pedido Pronto' },
  { value: 'saiu_entrega', label: 'Saiu para Entrega' },
  { value: 'entregue',     label: 'Entregue' },
  { value: 'cancelado',    label: 'Cancelado' },
];

function getStageInfo(status: string) {
  const stage = PIPELINE.find(s => s.key === status);
  if (stage) return stage;
  const extra = EXTRA_STATUS[status];
  if (extra) return { key: status, label: extra.label, icon: Circle, color: extra.color, bg: extra.bg, border: extra.border };
  return { key: status, label: status, icon: Circle, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/30' };
}

function getNextStage(currentStatus: string): string | null {
  const idx = PIPELINE.findIndex(s => s.key === currentStatus);
  if (idx === -1 || idx >= PIPELINE.length - 1) return null;
  return PIPELINE[idx + 1].key;
}

function getStageIndex(status: string): number {
  return PIPELINE.findIndex(s => s.key === status);
}

// ─── Componente de mini-pipeline por pedido ───────────────────────────────────
function OrderPipeline({ order, onAdvance, advancing }: {
  order: any;
  onAdvance: (orderId: string, nextStatus: string) => void;
  advancing: boolean;
}) {
  const currentIdx = getStageIndex(order.status);
  const nextStage = getNextStage(order.status);
  const isInPipeline = currentIdx !== -1;

  if (!isInPipeline) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {PIPELINE.map((stage, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const Icon = stage.icon;
        return (
          <div key={stage.key} className="flex items-center gap-1">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-body border transition-all ${
              done   ? 'bg-green-400/10 text-green-400 border-green-400/30' :
              active ? `${stage.bg} ${stage.color} ${stage.border}` :
                       'bg-white/3 text-gray-600 border-white/5'
            }`}>
              {done ? <CheckCircle2 className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
              <span className="hidden sm:inline">{stage.label}</span>
            </div>
            {idx < PIPELINE.length - 1 && (
              <ArrowRight className={`w-3 h-3 flex-shrink-0 ${done ? 'text-green-400/50' : 'text-white/10'}`} />
            )}
          </div>
        );
      })}
      {nextStage && (
        <Button
          size="sm"
          onClick={e => { e.stopPropagation(); onAdvance(order.id, nextStage); }}
          disabled={advancing}
          className="ml-2 h-6 px-2 text-[10px] bg-primary/90 hover:bg-primary text-black font-display font-bold"
        >
          {advancing ? <Loader2 className="w-3 h-3 animate-spin" /> : (
            <>
              <ArrowRight className="w-3 h-3 mr-1" />
              {PIPELINE.find(s => s.key === nextStage)?.label}
            </>
          )}
        </Button>
      )}
      {order.status === 'entregue' && (
        <span className="ml-2 flex items-center gap-1 text-green-400 text-[10px] font-body">
          <CheckCircle2 className="w-3 h-3" /> Concluído
        </span>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function AdminOrders() {
  const { authenticated, loading, getAuthHeaders } = useAdminAuth();
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [dataLoading, setDataLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [advancing, setAdvancing] = useState<string | null>(null);
  const limit = 20;

  const loadOrders = useCallback(async () => {
    setDataLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (status && status !== 'all') params.set('status', status);
      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotal(data.total || 0);
      } else if (res.status === 401) {
        navigate('/admin');
      }
    } catch {
      toast.error('Erro ao carregar pedidos');
    } finally {
      setDataLoading(false);
    }
  }, [page, search, status, getAuthHeaders, navigate]);

  useEffect(() => {
    if (authenticated) loadOrders();
  }, [authenticated, loadOrders]);

  const handleAdvance = async (orderId: string, nextStatus: string) => {
    setAdvancing(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
        credentials: 'include',
      });
      if (res.ok) {
        const stage = PIPELINE.find(s => s.key === nextStatus);
        toast.success(`Pedido avançado para: ${stage?.label || nextStatus}`);
        // Atualizar localmente sem recarregar tudo
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus, updatedAt: new Date().toISOString() } : o));
      } else {
        toast.error('Erro ao atualizar etapa');
      }
    } catch {
      toast.error('Erro ao atualizar etapa');
    } finally {
      setAdvancing(null);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm('Cancelar este pedido?')) return;
    setAdvancing(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelado' }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Pedido cancelado');
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelado', updatedAt: new Date().toISOString() } : o));
      } else {
        toast.error('Erro ao cancelar');
      }
    } catch {
      toast.error('Erro ao cancelar');
    } finally {
      setAdvancing(null);
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

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout title="Pedidos" subtitle={`${total} pedido${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}>
      <div className="space-y-4">

        {/* Resumo por etapa */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {PIPELINE.map(stage => {
            const Icon = stage.icon;
            const count = orders.filter(o => o.status === stage.key).length;
            return (
              <button
                key={stage.key}
                onClick={() => { setStatus(stage.key); setPage(1); }}
                className={`flex items-center gap-2 p-3 rounded border transition-all text-left ${
                  status === stage.key
                    ? `${stage.bg} ${stage.border} border`
                    : 'bg-white/3 border-white/5 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${stage.color}`} />
                <div>
                  <p className={`font-display font-bold text-xs ${stage.color}`}>{count}</p>
                  <p className="font-body text-[10px] text-gray-500 leading-tight">{stage.label}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar por email, nome ou número..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
          </div>
          <Select value={status} onValueChange={v => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-52 bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10">
              {ALL_STATUS_FILTER.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="text-white hover:bg-white/10">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={loadOrders}
            className="border-white/10 text-gray-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Lista de pedidos */}
        <div className="space-y-3">
          {dataLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 border border-white/5 rounded">
              <p className="font-body text-sm">Nenhum pedido encontrado</p>
              <p className="font-body text-xs mt-1">Os pedidos aparecerão aqui após as primeiras compras</p>
            </div>
          ) : (
            orders.map(order => {
              const stageInfo = getStageInfo(order.status);
              const StageIcon = stageInfo.icon;
              const customerName = order.customerName ||
                (order.payer ? `${order.payer.first_name || ''} ${order.payer.last_name || ''}`.trim() : '') || '—';
              const customerEmail = order.customerEmail || order.payer?.email || '—';
              const orderDate = order.createdAt ? new Date(order.createdAt) : null;
              const total = parseFloat(order.total || order.amount || 0);

              return (
                <Card
                  key={order.id}
                  className="bg-white/3 border-white/8 hover:bg-white/5 transition-colors"
                >
                  <CardContent className="p-4">
                    {/* Linha superior: número, cliente, data, total */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold text-sm text-white">
                            {order.orderNumber || order.id}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-body border rounded-sm ${stageInfo.bg} ${stageInfo.color} ${stageInfo.border}`}>
                            <StageIcon className="w-3 h-3" />
                            {stageInfo.label}
                          </span>
                        </div>
                        <p className="font-body text-xs text-gray-400 mt-0.5">{customerName}</p>
                        <p className="font-body text-[10px] text-gray-600">{customerEmail}</p>
                      </div>
                      <div className="flex items-start gap-4 flex-shrink-0">
                        {orderDate && (
                          <div className="text-right">
                            <p className="font-body text-xs text-gray-400">
                              {orderDate.toLocaleDateString('pt-BR')}
                            </p>
                            <p className="font-body text-[10px] text-gray-600">
                              {orderDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="font-display font-bold text-base text-primary">
                            R$ {total.toFixed(2).replace('.', ',')}
                          </p>
                          <p className="font-body text-[10px] text-gray-600">
                            {(order.items || []).length} item{(order.items || []).length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Itens do pedido */}
                    {order.items && order.items.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {order.items.map((item: any, idx: number) => (
                          <span key={idx} className="text-[10px] font-body text-gray-500 bg-white/5 px-2 py-0.5 rounded-sm">
                            {item.title || item.name || item.productId} {item.variantColor ? `· ${item.variantColor}` : ''} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Pipeline de etapas */}
                    <div className="border-t border-white/5 pt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex-1 overflow-x-auto">
                        <OrderPipeline
                          order={order}
                          onAdvance={handleAdvance}
                          advancing={advancing === order.id}
                        />
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {order.status !== 'cancelado' && order.status !== 'entregue' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(order.id)}
                            disabled={advancing === order.id}
                            className="h-6 px-2 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Cancelar
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="h-6 px-2 text-[10px] text-gray-400 hover:text-white"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="font-body text-xs text-gray-500">
              Mostrando {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} de {total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="w-8 h-8 border-white/10 text-gray-400 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-body text-xs text-gray-400">{page} / {totalPages}</span>
              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="w-8 h-8 border-white/10 text-gray-400 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
