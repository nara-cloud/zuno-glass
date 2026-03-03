import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, Percent } from 'lucide-react';

interface FinancialSummary {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  margin: number;
  roi: number;
}

interface SaleItem {
  sale: {
    id: number;
    productId: number;
    quantity: number;
    salePrice: number;
    costPrice: number;
    profit: number;
    customerName: string;
    paymentMethod: string;
    channel: string;
    createdAt: string;
  };
  product: { name: string; category: string };
}

function fmt(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

export default function AdminFinancial() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [sales, setSales] = useState<SaleItem[]>([]);
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
    { label: 'Receita Total', value: fmt(summary.totalRevenue), icon: DollarSign, color: 'text-green-400' },
    { label: 'Custo Total', value: fmt(summary.totalCost), icon: TrendingDown, color: 'text-red-400' },
    { label: 'Lucro Bruto', value: fmt(summary.totalProfit), icon: TrendingUp, color: 'text-primary' },
    { label: 'Margem', value: `${summary.margin.toFixed(1)}%`, icon: Percent, color: 'text-blue-400' },
  ] : [];

  const methodLabel: Record<string, string> = {
    pix: 'PIX', credit_card: 'Cartão', boleto: 'Boleto', manual: 'Manual',
  };

  return (
    <AdminLayout title="FINANCEIRO" subtitle="Resumo financeiro e vendas">
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          <h2 className="font-display font-bold text-sm text-white tracking-wider">VENDAS REGISTADAS</h2>
          <p className="font-body text-xs text-gray-500">{sales.length} venda(s) no total</p>
        </div>
        {sales.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-body text-sm">Nenhuma venda registada ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  {['Data', 'Produto', 'Cliente', 'Qtd', 'Venda', 'Custo', 'Lucro', 'Pagamento', 'Canal'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sales.map(({ sale, product }) => (
                  <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-gray-400">{new Date(sale.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-white font-bold">{product?.name || `#${sale.productId}`}</td>
                    <td className="px-4 py-3 text-gray-400">{sale.customerName || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{sale.quantity}</td>
                    <td className="px-4 py-3 text-green-400">{fmt(sale.salePrice)}</td>
                    <td className="px-4 py-3 text-red-400">{fmt(sale.costPrice)}</td>
                    <td className="px-4 py-3 text-primary font-bold">{fmt(sale.profit)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-white/20 text-gray-300 text-[10px]">
                        {methodLabel[sale.paymentMethod] || sale.paymentMethod}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{sale.channel}</td>
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
