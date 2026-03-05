import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

function fmt(v: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v) || 0); }

const statusColors: Record<string, string> = {
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  paid: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const statusLabels: Record<string, string> = {
  approved: 'Aprovado', paid: 'Pago', pending: 'Pendente', rejected: 'Recusado', cancelled: 'Cancelado',
};

const methodLabels: Record<string, string> = {
  credit_card: 'Cartão de Crédito', debit_card: 'Cartão de Débito', pix: 'PIX', boleto: 'Boleto',
};

export default function AdminPayments() {
  const { getAuthHeaders } = useAdminAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/gestao/payments', { headers: getAuthHeaders(), credentials: 'include' })
      .then(r => r.json())
      .then(d => setPayments(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const total = payments.filter(p => p.status === 'approved' || p.status === 'paid').reduce((s, p) => s + (Number(p.amount) || 0), 0);

  return (
    <AdminLayout title="PAGAMENTOS" subtitle="Histórico de transações e pagamentos">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#1a1a1a] border-white/10 p-4">
          <p className="font-body text-xs text-gray-500 mb-1">Total Recebido</p>
          <p className="font-display font-bold text-xl text-green-400">{fmt(total)}</p>
        </Card>
        <Card className="bg-[#1a1a1a] border-white/10 p-4">
          <p className="font-body text-xs text-gray-500 mb-1">Transações</p>
          <p className="font-display font-bold text-xl text-white">{payments.length}</p>
        </Card>
        <Card className="bg-[#1a1a1a] border-white/10 p-4">
          <p className="font-body text-xs text-gray-500 mb-1">Aprovados</p>
          <p className="font-display font-bold text-xl text-primary">{payments.filter(p => p.status === 'approved' || p.status === 'paid').length}</p>
        </Card>
        <Card className="bg-[#1a1a1a] border-white/10 p-4">
          <p className="font-body text-xs text-gray-500 mb-1">Pendentes</p>
          <p className="font-display font-bold text-xl text-yellow-400">{payments.filter(p => p.status === 'pending').length}</p>
        </Card>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-display font-bold text-sm text-white tracking-wider">HISTÓRICO DE PAGAMENTOS</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="font-display font-bold text-sm text-gray-500">NENHUM PAGAMENTO REGISTRADO</p>
            <p className="font-body text-xs text-gray-600 mt-1">Os pagamentos aparecerão aqui quando houver pedidos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  {['Data', 'Cliente', 'Pedido', 'Método', 'Valor', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.id || i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-gray-400">{p.date ? new Date(p.date).toLocaleDateString('pt-BR') : '—'}</td>
                    <td className="px-4 py-3 text-white">{p.customer || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">#{String(p.orderId || p.id || '').slice(-6)}</td>
                    <td className="px-4 py-3 text-gray-400">{methodLabels[p.method] || p.method || '—'}</td>
                    <td className="px-4 py-3 text-white font-bold">{fmt(p.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] border ${statusColors[p.status] || statusColors.pending}`}>
                        {statusLabels[p.status] || p.status || 'Pendente'}
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
