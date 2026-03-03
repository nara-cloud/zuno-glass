import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  TrendingUp, Package, Boxes, DollarSign,
  Clock, AlertCircle, Loader2, ShieldCheck, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';

interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
  recentOrders: any[];
  ordersByStatus: { status: string; count: number }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  processing: 'Em Preparo',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400',
  confirmed: 'text-blue-400',
  processing: 'text-orange-400',
  shipped: 'text-purple-400',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
};

function LoginScreen({ onLogin }: { onLogin: (password: string) => Promise<boolean> }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await onLogin(password);
    if (!ok) setError('Senha incorreta. Tente novamente.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border border-primary/30 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white tracking-widest">ZUNO GLASS</h1>
          <p className="font-body text-sm text-gray-500 mt-1">Painel de Gestão</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 space-y-4">
          <div className="space-y-1">
            <Label className="font-body text-xs text-gray-400">Senha de Acesso</Label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
              autoFocus
            />
          </div>
          {error && (
            <p className="font-body text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-primary text-black hover:bg-white font-display font-bold tracking-wider h-11"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ENTRAR'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const { authenticated, loading, login, getAuthHeaders } = useAdminAuth();
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (authenticated) loadStats();
  }, [authenticated]);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) setStats(await res.json());
    } catch {
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!authenticated) return <LoginScreen onLogin={login} />;

  const fmt = (v: number) =>
    `R$ ${v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

  const kpis = [
    { label: 'Receita Total', value: stats ? fmt(stats.totalRevenue) : '—', icon: DollarSign, sub: stats ? `Hoje: ${fmt(stats.todayRevenue)}` : '', color: 'text-primary' },
    { label: 'Total de Pedidos', value: stats?.totalOrders ?? '—', icon: Package, sub: stats ? `Hoje: ${stats.todayOrders}` : '', color: 'text-blue-400' },
    { label: 'Pendentes', value: stats?.pendingOrders ?? '—', icon: Clock, sub: 'Aguardando ação', color: 'text-yellow-400' },
    { label: 'Pedidos Hoje', value: stats?.todayOrders ?? '—', icon: TrendingUp, sub: stats ? fmt(stats.todayRevenue) : '', color: 'text-green-400' },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Visão geral do e-commerce">
      {statsLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(kpi => (
              <Card key={kpi.label} className="bg-white/5 border-white/10">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-body text-xs text-gray-400">{kpi.label}</CardTitle>
                    <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className={`font-display font-bold text-2xl ${kpi.color}`}>{kpi.value}</div>
                  <p className="font-body text-xs text-gray-500 mt-1">{kpi.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Chart */}
          {stats && stats.revenueByDay.length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="font-display font-bold text-sm text-white tracking-wider">RECEITA — ÚLTIMOS 30 DIAS</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={stats.revenueByDay}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E9FF00" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E9FF00" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={v => `R$${v}`} />
                    <Tooltip
                      contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }}
                      labelStyle={{ color: '#fff', fontSize: 11 }}
                      formatter={(v: any) => [`R$ ${Number(v).toFixed(2).replace('.', ',')}`, 'Receita']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#E9FF00" fill="url(#revenueGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Breakdown */}
            {stats && stats.ordersByStatus.length > 0 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display font-bold text-sm text-white tracking-wider">PEDIDOS POR STATUS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.ordersByStatus.map(({ status, count }) => (
                    <div key={status} className="flex items-center justify-between py-1.5 border-b border-white/5">
                      <span className={`font-body text-sm ${STATUS_COLORS[status] || 'text-gray-400'}`}>{STATUS_LABELS[status] || status}</span>
                      <span className="font-display font-bold text-sm text-white">{count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recent Orders */}
            {stats && stats.recentOrders.length > 0 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="font-display font-bold text-sm text-white tracking-wider">PEDIDOS RECENTES</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')} className="text-primary text-xs font-display">
                    Ver todos <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.recentOrders.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between py-2 border-b border-white/5 cursor-pointer hover:bg-white/5 px-2 -mx-2 transition-colors"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <div>
                        <p className="font-display font-bold text-xs text-white">{order.order_number}</p>
                        <p className="font-body text-[10px] text-gray-500">{order.customer_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-xs text-primary">R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}</p>
                        <p className={`font-body text-[10px] ${STATUS_COLORS[order.status] || 'text-gray-400'}`}>{STATUS_LABELS[order.status] || order.status}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions (when no orders yet) */}
          {(!stats || stats.totalOrders === 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { href: '/admin/orders', label: 'Gerenciar Pedidos', desc: 'Ver e atualizar status dos pedidos', icon: Package },
                { href: '/admin/stock', label: 'Ver Estoque', desc: 'Sincronizado com ZUNO Gestão', icon: Boxes },
                { href: '/admin/sales', label: 'Relatórios', desc: 'Análise de vendas e receita', icon: TrendingUp },
              ].map(item => (
                <Card key={item.href} className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-colors" onClick={() => navigate(item.href)}>
                  <CardHeader>
                    <item.icon className="w-6 h-6 text-primary mb-2" />
                    <CardTitle className="font-display font-bold text-sm text-white tracking-wider">{item.label}</CardTitle>
                    <p className="font-body text-xs text-gray-500">{item.desc}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
