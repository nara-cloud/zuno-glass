import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { LineChart, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

function fmt(v: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v) || 0); }

export default function AdminProfitability() {
  const { getAuthHeaders } = useAdminAuth();
  const [data, setData] = useState<any>({ total: 0, count: 0, orders: [] });
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/gestao/sales', { headers: getAuthHeaders(), credentials: 'include' }).then(r => r.json()),
      fetch('/api/admin/gestao/investments', { headers: getAuthHeaders(), credentials: 'include' }).then(r => r.json()),
    ]).then(([sales, inv]) => {
      setData(sales && typeof sales === 'object' ? sales : { total: 0, count: 0, orders: [] });
      setInvestments(Array.isArray(inv) ? inv : []);
    }).finally(() => setLoading(false));
  }, []);

  const revenue = data.total || 0;
  const totalInvestments = investments.reduce((s: number, i: any) => s + (Number(i.amount) || 0), 0);
  const profit = revenue - totalInvestments;
  const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0';
  const avgTicket = data.count > 0 ? revenue / data.count : 0;

  // Group investments by category
  const byCategory = investments.reduce((acc: any, i: any) => {
    acc[i.category] = (acc[i.category] || 0) + (Number(i.amount) || 0);
    return acc;
  }, {});

  return (
    <AdminLayout title="RENTABILIDADE" subtitle="Análise de rentabilidade e margens">
      {loading ? (
        <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[#1a1a1a] border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-body text-xs text-gray-500">Receita Total</span>
              </div>
              <p className="font-display font-bold text-xl text-green-400">{fmt(revenue)}</p>
              <p className="font-body text-xs text-gray-600 mt-1">{data.count} pedidos aprovados</p>
            </Card>
            <Card className="bg-[#1a1a1a] border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="font-body text-xs text-gray-500">Investimentos</span>
              </div>
              <p className="font-display font-bold text-xl text-red-400">{fmt(totalInvestments)}</p>
              <p className="font-body text-xs text-gray-600 mt-1">{investments.length} registros</p>
            </Card>
            <Card className="bg-[#1a1a1a] border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="font-body text-xs text-gray-500">Lucro Líquido</span>
              </div>
              <p className={`font-display font-bold text-xl ${profit >= 0 ? 'text-primary' : 'text-red-400'}`}>{fmt(profit)}</p>
              <p className="font-body text-xs text-gray-600 mt-1">Margem: {margin}%</p>
            </Card>
            <Card className="bg-[#1a1a1a] border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-blue-400" />
                <span className="font-body text-xs text-gray-500">Ticket Médio</span>
              </div>
              <p className="font-display font-bold text-xl text-blue-400">{fmt(avgTicket)}</p>
              <p className="font-body text-xs text-gray-600 mt-1">Por pedido</p>
            </Card>
          </div>

          {/* Margin bar */}
          <Card className="bg-[#1a1a1a] border-white/10 p-4 mb-6">
            <h3 className="font-display font-bold text-xs text-white tracking-wider mb-4">MARGEM DE LUCRO</h3>
            <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${profit >= 0 ? 'bg-primary' : 'bg-red-500'}`}
                style={{ width: `${Math.min(Math.abs(Number(margin)), 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs font-body text-gray-500">
              <span>0%</span>
              <span className={profit >= 0 ? 'text-primary font-bold' : 'text-red-400 font-bold'}>{margin}%</span>
              <span>100%</span>
            </div>
          </Card>

          {/* Investments by category */}
          {Object.keys(byCategory).length > 0 && (
            <Card className="bg-[#1a1a1a] border-white/10 p-4">
              <h3 className="font-display font-bold text-xs text-white tracking-wider mb-4">CUSTOS POR CATEGORIA</h3>
              <div className="space-y-3">
                {Object.entries(byCategory).map(([cat, val]: [string, any]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs font-body mb-1">
                      <span className="text-gray-400 capitalize">{cat}</span>
                      <span className="text-white font-bold">{fmt(val)} ({totalInvestments > 0 ? ((val / totalInvestments) * 100).toFixed(1) : 0}%)</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60" style={{ width: `${totalInvestments > 0 ? (val / totalInvestments) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </AdminLayout>
  );
}
