import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface Transaction {
  date: string;
  description: string;
  type: 'entrada' | 'saida';
  amount: number;
  category?: string;
}

function fmt(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
}

export default function AdminCashflow() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/gestao/sales', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/admin/gestao/investments', { credentials: 'include' }).then(r => r.json()),
    ]).then(([sales, investments]) => {
      const txs: Transaction[] = [];

      (Array.isArray(sales) ? sales : []).forEach((s: any) => {
        txs.push({
          date: s.created_at || s.createdAt,
          description: `Venda #${s.order_number || s.id}: ${s.items || s.customer_name || 'Pedido'}`,
          type: 'entrada',
          amount: Number(s.total) || 0,
          category: 'venda',
        });
      });

      (Array.isArray(investments) ? investments : []).forEach((inv: any) => {
        txs.push({
          date: inv.date || inv.created_at,
          description: inv.description,
          type: 'saida',
          amount: Number(inv.amount) || 0,
          category: inv.category,
        });
      });

      txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(txs);
    }).finally(() => setLoading(false));
  }, []);

  const entradas = transactions.filter(t => t.type === 'entrada').reduce((s, t) => s + t.amount, 0);
  const saidas = transactions.filter(t => t.type === 'saida').reduce((s, t) => s + t.amount, 0);
  const saldo = entradas - saidas;

  return (
    <AdminLayout title="FLUXO DE CAIXA" subtitle="Entradas e saídas financeiras">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#1a1a1a] border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="font-body text-xs text-gray-500">Total Entradas</span>
          </div>
          <p className="font-display font-bold text-xl text-green-400">{fmt(entradas)}</p>
        </Card>
        <Card className="bg-[#1a1a1a] border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="font-body text-xs text-gray-500">Total Saídas</span>
          </div>
          <p className="font-display font-bold text-xl text-red-400">{fmt(saidas)}</p>
        </Card>
        <Card className={`border p-4 ${saldo >= 0 ? 'bg-primary/5 border-primary/30' : 'bg-red-500/5 border-red-500/30'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className={`w-4 h-4 ${saldo >= 0 ? 'text-primary' : 'text-red-400'}`} />
            <span className="font-body text-xs text-gray-500">Saldo Líquido</span>
          </div>
          <p className={`font-display font-bold text-xl ${saldo >= 0 ? 'text-primary' : 'text-red-400'}`}>{fmt(saldo)}</p>
        </Card>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-display font-bold text-sm text-white tracking-wider">TODAS AS TRANSACÇÕES</h2>
          <p className="font-body text-xs text-gray-500">{transactions.length} transacção(ões) registada(s)</p>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-body text-sm">Nenhuma transacção registada.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  {['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-gray-400">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-white">{t.description}</td>
                    <td className="px-4 py-3 text-gray-500">{t.category || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge className={t.type === 'entrada'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30 text-[10px]'
                        : 'bg-red-500/20 text-red-400 border-red-500/30 text-[10px]'}>
                        {t.type === 'entrada' ? '↑ Entrada' : '↓ Saída'}
                      </Badge>
                    </td>
                    <td className={`px-4 py-3 font-bold ${t.type === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>
                      {t.type === 'entrada' ? '+' : '-'}{fmt(t.amount)}
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
