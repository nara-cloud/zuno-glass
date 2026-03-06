import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import Admin from './Admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Search, Loader2, ChevronLeft, ChevronRight, Eye, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, string> = {
  all: 'Todos',
  pending: 'Pendente',
  em_separacao: 'Aprovado e em Separação',
  confirmed: 'Confirmado',
  processing: 'Em Preparo',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
  paid: 'Pago',
};

const STATUS_VARIANTS: Record<string, string> = {
  pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  em_separacao: 'bg-green-400/10 text-green-400 border-green-400/30',
  confirmed: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  processing: 'bg-orange-400/10 text-orange-400 border-orange-400/30',
  shipped: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
  delivered: 'bg-green-400/10 text-green-400 border-green-400/30',
  cancelled: 'bg-red-400/10 text-red-400 border-red-400/30',
  paid: 'bg-green-400/10 text-green-400 border-green-400/30',
};

const PAYMENT_STATUS_VARIANTS: Record<string, string> = {
  pending: 'bg-yellow-400/10 text-yellow-400',
  paid: 'bg-green-400/10 text-green-400',
  failed: 'bg-red-400/10 text-red-400',
  refunded: 'bg-gray-400/10 text-gray-400',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  failed: 'Falhou',
  refunded: 'Reembolsado',
};

export default function AdminOrders() {
  const { authenticated, loading, getAuthHeaders } = useAdminAuth();
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [dataLoading, setDataLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const limit = 20;

  const loadOrders = useCallback(async () => {
    setDataLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
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
    <AdminLayout title="Pedidos" subtitle={`${total} pedidos encontrados`}>
      <div className="space-y-4">
        {/* Filters */}
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
            <SelectTrigger className="w-full sm:w-44 bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10">
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v} className="text-white hover:bg-white/10">{l}</SelectItem>
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

        {/* Table */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-0">
            {dataLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <p className="font-body text-sm">Nenhum pedido encontrado</p>
                <p className="font-body text-xs mt-1">Os pedidos aparecerão aqui após as primeiras compras</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 font-display font-bold text-xs text-gray-400 tracking-wider">PEDIDO</th>
                      <th className="text-left px-4 py-3 font-display font-bold text-xs text-gray-400 tracking-wider hidden md:table-cell">CLIENTE</th>
                      <th className="text-left px-4 py-3 font-display font-bold text-xs text-gray-400 tracking-wider hidden lg:table-cell">DATA</th>
                      <th className="text-right px-4 py-3 font-display font-bold text-xs text-gray-400 tracking-wider">TOTAL</th>
                      <th className="text-center px-4 py-3 font-display font-bold text-xs text-gray-400 tracking-wider">PAGAMENTO</th>
                      <th className="text-center px-4 py-3 font-display font-bold text-xs text-gray-400 tracking-wider">STATUS</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr
                        key={order.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        <td className="px-4 py-3">
                          <p className="font-display font-bold text-xs text-white">{order.orderNumber || order.id}</p>
                          <p className="font-body text-[10px] text-gray-500 md:hidden">{order.customerEmail || order.payer?.email || '—'}</p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="font-body text-xs text-white">{order.customerName || (order.payer ? `${order.payer.first_name || ''} ${order.payer.last_name || ''}`.trim() : '') || '—'}</p>
                          <p className="font-body text-[10px] text-gray-500">{order.customerEmail || order.payer?.email || '—'}</p>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="font-body text-xs text-gray-400">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : '—'}
                          </p>
                          <p className="font-body text-[10px] text-gray-600">
                            {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="font-display font-bold text-sm text-primary">
                            R$ {parseFloat(order.total || order.amount || 0).toFixed(2).replace('.', ',')}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-body rounded-sm ${PAYMENT_STATUS_VARIANTS[order.paymentStatus || order.payment_status] || 'text-gray-400'}`}>
                            {PAYMENT_STATUS_LABELS[order.paymentStatus || order.payment_status] || order.paymentStatus || order.payment_status || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-body border rounded-sm ${STATUS_VARIANTS[order.status] || 'text-gray-400 border-gray-400/30'}`}>
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 text-gray-400 hover:text-white"
                            onClick={e => { e.stopPropagation(); navigate(`/admin/orders/${order.id}`); }}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
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
