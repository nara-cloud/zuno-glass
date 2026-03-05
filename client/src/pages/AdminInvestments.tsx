import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PiggyBank, Plus, X, Trash2 } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';

interface Investment {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
  notes: string | null;
}

const categoryColors: Record<string, string> = {
  embalagens: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  marketing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  produto: 'bg-primary/20 text-primary border-primary/30',
  operacional: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  outros: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const categories = ['embalagens', 'marketing', 'produto', 'operacional', 'outros'];

function fmt(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
}

export default function AdminInvestments() {
  const { getAuthHeaders } = useAdminAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ description: '', amount: 0, category: 'outros', date: new Date().toISOString().split('T')[0], notes: '' });

  const load = () => {
    fetch('/api/admin/gestao/investments', { headers: getAuthHeaders(), credentials: 'include' })
      .then(r => r.json())
      .then(d => setInvestments(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const total = investments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const byCategory = investments.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + (Number(i.amount) || 0);
    return acc;
  }, {} as Record<string, number>);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/gestao/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success('Investimento registrado!');
      setShowModal(false);
      setForm({ description: '', amount: 0, category: 'outros', date: new Date().toISOString().split('T')[0], notes: '' });
      load();
    } catch { toast.error('Erro ao registrar'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remover investimento?')) return;
    await fetch(`/api/admin/gestao/investments/${id}`, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
    toast.success('Removido'); load();
  };

  return (
    <AdminLayout title="INVESTIMENTOS" subtitle="Controle de investimentos e despesas">
      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowModal(true)} className="bg-primary text-black font-display font-bold text-xs tracking-wider gap-2">
          <Plus className="w-4 h-4" /> NOVO INVESTIMENTO
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#1a1a1a] border-white/10 p-4">
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
              <span className="font-body text-xs text-gray-500">{total > 0 ? ((val / total) * 100).toFixed(1) : 0}%</span>
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
          <div className="p-8 text-center">
            <PiggyBank className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="font-display font-bold text-sm text-gray-500">NENHUM INVESTIMENTO REGISTRADO</p>
            <p className="font-body text-xs text-gray-600 mt-1">Clique em "NOVO INVESTIMENTO" para registrar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  {['Data', 'Descrição', 'Categoria', 'Valor', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...investments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(inv => (
                  <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-gray-400">{new Date(inv.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-white">{inv.description}{inv.notes && <p className="text-gray-600 text-[10px]">{inv.notes}</p>}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] border ${categoryColors[inv.category] || categoryColors.outros}`}>{inv.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-red-400 font-bold">{fmt(inv.amount)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(inv.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="font-display font-bold text-sm text-white tracking-wider">NOVO INVESTIMENTO</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">Descrição *</label>
                <input type="text" required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="Ex: Compra de embalagens" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs text-gray-500 mb-1 block">Valor (R$) *</label>
                  <input type="number" required min={0} step={0.01} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="font-body text-xs text-gray-500 mb-1 block">Data *</label>
                  <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">Categoria</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">Observações</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-white/10 text-gray-400 font-display text-xs">CANCELAR</Button>
                <Button type="submit" disabled={saving} className="flex-1 bg-primary text-black font-display font-bold text-xs">{saving ? 'SALVANDO...' : 'REGISTRAR'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
