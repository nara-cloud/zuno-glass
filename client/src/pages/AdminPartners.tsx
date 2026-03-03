import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Handshake, Mail, Phone } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  percentage: number;
  totalInvestment: number;
  createdAt: string;
}

function fmt(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

const partnerColors = ['text-primary', 'text-blue-400', 'text-purple-400'];
const partnerBg = ['bg-primary/10 border-primary/30', 'bg-blue-500/10 border-blue-500/30', 'bg-purple-500/10 border-purple-500/30'];

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/gestao/partners', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setPartners(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const totalInvested = partners.reduce((s, p) => s + p.totalInvestment, 0);

  return (
    <AdminLayout title="SÓCIOS" subtitle="Gestão de sócios e participações">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Summary */}
          <Card className="bg-[#1a1a1a] border-white/10 p-4 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Handshake className="w-4 h-4 text-primary" />
              <span className="font-body text-xs text-gray-500">Total Investido pela Sociedade</span>
            </div>
            <p className="font-display font-bold text-2xl text-primary">{fmt(totalInvested)}</p>
          </Card>

          {/* Partner Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {partners.map((p, i) => (
              <Card key={p.id} className={`bg-[#1a1a1a] border ${partnerBg[i % 3]} p-5`}>
                <div className={`w-12 h-12 rounded-full ${partnerBg[i % 3]} border flex items-center justify-center mb-4`}>
                  <span className={`font-display font-bold text-lg ${partnerColors[i % 3]}`}>
                    {p.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className={`font-display font-bold text-lg ${partnerColors[i % 3]} mb-1`}>{p.name.toUpperCase()}</h3>
                <p className="font-body text-xs text-gray-500 mb-4">Sócio desde {new Date(p.createdAt).toLocaleDateString('pt-BR')}</p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-xs text-gray-500">Participação</span>
                    <span className={`font-display font-bold text-sm ${partnerColors[i % 3]}`}>
                      {(p.percentage / 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-xs text-gray-500">Total Investido</span>
                    <span className="font-display font-bold text-sm text-white">{fmt(p.totalInvestment)}</span>
                  </div>
                  {p.email && (
                    <div className="flex items-center gap-1.5 mt-3">
                      <Mail className="w-3 h-3 text-gray-500" />
                      <span className="font-body text-xs text-gray-400">{p.email}</span>
                    </div>
                  )}
                  {p.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span className="font-body text-xs text-gray-400">{p.phone}</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-blue-400' : 'bg-purple-400'}`}
                      style={{ width: `${p.percentage / 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pie Chart (CSS) */}
          {partners.length > 0 && (
            <Card className="bg-[#1a1a1a] border-white/10 p-5">
              <h2 className="font-display font-bold text-sm text-white tracking-wider mb-4">DISTRIBUIÇÃO DE PARTICIPAÇÕES</h2>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
                    {partners.reduce((acc, p, i) => {
                      const pct = p.percentage / 100;
                      const offset = acc.offset;
                      const colors = ['#E9FF00', '#60a5fa', '#a78bfa'];
                      acc.elements.push(
                        <circle
                          key={p.id}
                          cx="16" cy="16" r="15.9"
                          fill="none"
                          stroke={colors[i % 3]}
                          strokeWidth="3"
                          strokeDasharray={`${pct} ${100 - pct}`}
                          strokeDashoffset={-offset}
                        />
                      );
                      acc.offset += pct;
                      return acc;
                    }, { elements: [] as React.ReactElement[], offset: 0 }).elements}
                  </svg>
                </div>
                <div className="space-y-2">
                  {partners.map((p, i) => {
                    const colors = ['text-primary', 'text-blue-400', 'text-purple-400'];
                    const dots = ['bg-primary', 'bg-blue-400', 'bg-purple-400'];
                    return (
                      <div key={p.id} className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${dots[i % 3]}`} />
                        <span className="font-body text-xs text-gray-400">{p.name}</span>
                        <span className={`font-display font-bold text-xs ${colors[i % 3]}`}>{(p.percentage / 100).toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </AdminLayout>
  );
}
