import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PiggyBank } from 'lucide-react';

interface Investment {
  id: number;
  partnerId: number;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  embalagens: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  marketing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  produto: 'bg-primary/20 text-primary border-primary/30',
  operacional: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  outros: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

function fmt(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

export default function AdminInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/gestao/investments', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setInvestments(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const total = investments.reduce((sum, i) => sum + i.amount, 0);

  const byCategory = investments.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + i.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout title="INVESTIMENTOS" subtitle="Controlo de investimentos e despesas">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#1a1a1a] border-white/10 p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-4 h-4 text-primary" />
            <span className="font-body text-xs text-gray-500">Total Investido</span>
          </div>
          <p className="font-display font-bold text-2xl text-primary">{fmt(total)}</p>
          <p className="font-body text-xs text-gray-500 mt-1">{investments.length} registro(s)</p>
        </Card>
        {Object.entries(byCategory).map(([cat, val]) => (
          <Card key={cat} className="bg-[#1a1a1a] border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className={`text-[10px] border ${categoryColors[cat] || categoryColors.outros}`}>{cat}</Badge>
              <span className="font-body text-xs text-gray-500">{((val / total) * 100).toFixed(1)}%</span>
            </div>
            <p className="font-display font-bold text-lg text-white">{fmt(val)}</p>
          </Card>
        ))}
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-display font-bold text-sm text-white tracking-wider">TODOS OS INVESTIMENTOS</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : investments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-body text-sm">Nenhum investimento registado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  {['Data', 'Descrição', 'Categoria', 'Valor'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {investments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(inv => (
                  <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-gray-400">{new Date(inv.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-white">{inv.description}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] border ${categoryColors[inv.category] || categoryColors.outros}`}>{inv.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-red-400 font-bold">{fmt(inv.amount)}</td>
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
