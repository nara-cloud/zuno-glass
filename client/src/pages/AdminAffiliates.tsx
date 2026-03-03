import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Instagram, Link } from 'lucide-react';

interface Affiliate {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  referralCode: string;
  commissionType: string;
  commissionValue: number;
  totalSales: number;
  totalCommission: number;
  isActive: boolean;
  createdAt: string;
}

function fmt(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/gestao/affiliates', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setAffiliates(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="AFILIADOS" subtitle="Programa de afiliados e comissões">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <p className="font-display font-bold text-2xl text-primary">{affiliates.length}</p>
          <p className="font-body text-xs text-gray-500">Total</p>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-2xl text-green-400">{affiliates.filter(a => a.isActive).length}</p>
          <p className="font-body text-xs text-gray-500">Activos</p>
        </div>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-display font-bold text-sm text-white tracking-wider">AFILIADOS CADASTRADOS</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : affiliates.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="font-display font-bold text-sm text-gray-500 mb-2">NENHUM AFILIADO CADASTRADO</p>
            <p className="font-body text-xs text-gray-600">Os afiliados aparecerão aqui quando forem cadastrados na plataforma.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  {['Nome', 'Instagram', 'Código', 'Comissão', 'Vendas', 'Comissão Total', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {affiliates.map(a => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-bold">{a.name}</p>
                        {a.email && <p className="text-gray-500 text-[10px]">{a.email}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {a.instagram ? (
                        <div className="flex items-center gap-1 text-pink-400">
                          <Instagram className="w-3 h-3" />
                          <span>{a.instagram}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-primary font-display font-bold">
                        <Link className="w-3 h-3" />
                        {a.referralCode}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {a.commissionValue}{a.commissionType === 'percentual' ? '%' : ' R$'}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{a.totalSales}</td>
                    <td className="px-4 py-3 text-primary font-bold">{fmt(a.totalCommission)}</td>
                    <td className="px-4 py-3">
                      <Badge className={a.isActive
                        ? 'bg-green-500/20 text-green-400 border-green-500/30 text-[10px]'
                        : 'bg-red-500/20 text-red-400 border-red-500/30 text-[10px]'}>
                        {a.isActive ? 'Activo' : 'Inactivo'}
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
