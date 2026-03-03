import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, Clock } from 'lucide-react';

interface FinancialSummary {
  total_orders: number;
  total_revenue: number;
  revenue_this_month: number;
  revenue_today: number;
  pending_revenue: number;
  total_invested: number;
}

interface SaleRow {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  payment_status: string;
  status: string;
  payment_method: string;
  created_at: string;
  items: string;
}

function fmt(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
}

export default function AdminFinancial() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/gestao/financial', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/admin/gestao/sales', { credentials: 'include' }).then(r => r.json()),
    ]).then(([fin, sal]) => {
      setSummary(fin);
      setSales(Array.isArray(sal) ? sal : []);
    }).finally(() => setLoading(false));
  }, []);

  const kpis = summary ? [
    { label: 'Receita Total', value: fmt(summary.total_revenue), icon: DollarSign, color: 'text-green-400' },
    { label: 'Este Mês', value: fmt(summary.revenue_this_month), icon: TrendingUp, color: 'text-primary' },
    { label: 'Hoje', value: fmt(summary.revenue_today), icon: ShoppingCart, color: 'text-blue-400' },
    { label: 'Pendente', value: fmt(summary.pending_revenue), icon: Clock, color: 'text-yellow-400' },
    { label: 'Total Investido', value: fmt(summary.total_invested), icon: TrendingDown, color: 'text-red-400' },
    { label: 'Lucro Estimado', value: fmt((summary.total_revenue || 0) - (summary.total_invested || 0)), icon: TrendingUp, color: 'text-emerald-400' },
  ] : [];

  const methodLabel: Record<string, string> = {
    stripe: 'Cartão', mercadopago: 'Mercado Pago', pix: 'PIX', manual: 'Manual',
  };

  const statusColor: Record<string, string> = {
    paid: 'text-green-400 border-green-400/30',
    pending: 'text-yellow-400 border-yellow-400/30',
    failed: 'text-red-400 border-red-400/30',
    refunded: 'text-gray-400 border-gray-400/30',
  };

  return (
    <AdminLayout title="FINANCEIRO" subtitle="Resumo financeiro e vendas">
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-white/5 animate-pulse rounded" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {kpis.map(k => (
            <Card key={k.label} className="bg-[#1a1a1a] border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body text-xs text-gray-500">{k.label}</span>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`font-display font-bold text-xl ${k.color}`}>{k.value}</p>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-[#1a1a1a] border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-display font-bold text-sm text-white tracking-wider">VENDAS PAGAS</h2>
          <p className="font-body text-xs text-gray-500">{sales.length} venda(s) no total</p>
        </div>
        {sales.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-body text-sm">Nenhuma venda registada ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  {['Data', 'Pedido', 'Cliente', 'Produtos', 'Total', 'Pagamento', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-gray-400">{new Date(sale.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-white font-bold">{sale.order_number}</td>
                    <td className="px-4 py-3 text-gray-300">{sale.customer_name || sale.customer_email || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-[200px] truncate">{sale.items || '—'}</td>
                    <td className="px-4 py-3 text-green-400 font-bold">{fmt(sale.total)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-white/20 text-gray-300 text-[10px]">
                        {methodLabel[sale.payment_method] || sale.payment_method || '—'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-[10px] ${statusColor[sale.payment_status] || 'text-gray-400'}`}>
                        {sale.payment_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
