import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import Admin from './Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, DollarSign, Package, BarChart3 } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  processing: 'Em Preparo',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const STATUS_PIE_COLORS: Record<string, string> = {
  pending: '#facc15',
  confirmed: '#60a5fa',
  processing: '#fb923c',
  shipped: '#a78bfa',
  delivered: '#4ade80',
  cancelled: '#f87171',
};

export default function AdminSales() {
  const { authenticated, loading, getAuthHeaders } = useAdminAuth();
  const [stats, setStats] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (authenticated) loadStats();
  }, [authenticated]);

  const loadStats = async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) setStats(await res.json());
    } catch {
      toast.error('Erro ao carregar relatórios');
    } finally {
      setDataLoading(false);
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

  const fmt = (v: number) =>
    `R$ ${v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

  const pieData = stats?.ordersByStatus?.map((s: any) => ({
    name: STATUS_LABELS[s.status] || s.status,
    value: s.count,
    color: STATUS_PIE_COLORS[s.status] || '#6b7280',
  })) || [];

  return (
    <AdminLayout title="Relatórios" subtitle="Análise de vendas e receita">
      {dataLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : !stats || stats.totalOrders === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <BarChart3 className="w-10 h-10 mb-3 opacity-20" />
          <p className="font-body text-sm">Nenhum dado de vendas disponível ainda</p>
          <p className="font-body text-xs mt-1">Os relatórios aparecerão aqui após as primeiras vendas</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Receita Total', value: fmt(stats.totalRevenue), icon: DollarSign, color: 'text-primary' },
              { label: 'Total de Pedidos', value: stats.totalOrders, icon: Package, color: 'text-blue-400' },
              { label: 'Ticket Médio', value: stats.totalOrders > 0 ? fmt(stats.totalRevenue / stats.totalOrders) : '—', icon: TrendingUp, color: 'text-green-400' },
              { label: 'Pedidos Hoje', value: stats.todayOrders, icon: BarChart3, color: 'text-purple-400' },
            ].map(kpi => (
              <Card key={kpi.label} className="bg-white/5 border-white/10">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-body text-xs text-gray-400">{kpi.label}</CardTitle>
                    <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className={`font-display font-bold text-2xl ${kpi.color}`}>{kpi.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Over Time */}
          {stats.revenueByDay.length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="font-display font-bold text-sm text-white tracking-wider">RECEITA DIÁRIA — ÚLTIMOS 30 DIAS</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={stats.revenueByDay}>
                    <defs>
                      <linearGradient id="revenueGrad2" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="revenue" stroke="#E9FF00" fill="url(#revenueGrad2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders per Day */}
            {stats.revenueByDay.length > 0 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display font-bold text-sm text-white tracking-wider">PEDIDOS POR DIA</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.revenueByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }}
                        labelStyle={{ color: '#fff', fontSize: 11 }}
                        formatter={(v: any) => [v, 'Pedidos']}
                      />
                      <Bar dataKey="orders" fill="#60a5fa" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Status Pie */}
            {pieData.length > 0 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display font-bold text-sm text-white tracking-wider">DISTRIBUIÇÃO DE STATUS</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry: any, index: number) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }}
                        formatter={(v: any, name: any) => [v, name]}
                      />
                      <Legend formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 11 }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
