import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus, X, Trash2 } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';

interface Scenario { id: number; name: string; revenue: number; cost: number; units: number; notes: string; created_at: string; }
function fmt(v: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v) || 0); }

export default function AdminScenarios() {
  const { getAuthHeaders } = useAdminAuth();
  const [items, setItems] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', revenue: 0, cost: 0, units: 0, notes: '' });

  const load = () => {
    fetch('/api/admin/gestao/scenarios', { headers: getAuthHeaders(), credentials: 'include' })
      .then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch('/api/admin/gestao/scenarios', {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include', body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success('Cenário criado!'); setShowModal(false);
      setForm({ name: '', revenue: 0, cost: 0, units: 0, notes: '' }); load();
    } catch { toast.error('Erro ao criar cenário'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remover cenário?')) return;
    await fetch(`/api/admin/gestao/scenarios/${id}`, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
    toast.success('Removido'); load();
  };

  return (
    <AdminLayout title="CENÁRIOS" subtitle="Simulação de cenários financeiros">
      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowModal(true)} className="bg-primary text-black font-display font-bold text-xs tracking-wider gap-2">
          <Plus className="w-4 h-4" /> NOVO CENÁRIO
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : items.length === 0 ? (
          <div className="col-span-3 p-12 text-center">
            <Target className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="font-display font-bold text-sm text-gray-500">NENHUM CENÁRIO CRIADO</p>
            <p className="font-body text-xs text-gray-600 mt-1">Crie cenários para simular diferentes projeções financeiras.</p>
          </div>
        ) : items.map(s => {
          const profit = (s.revenue || 0) - (s.cost || 0);
          const margin = s.revenue > 0 ? ((profit / s.revenue) * 100).toFixed(1) : '0';
          return (
            <Card key={s.id} className="bg-[#1a1a1a] border-white/10 p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-bold text-sm text-white">{s.name}</h3>
                <button onClick={() => handleDelete(s.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2 text-xs font-body">
                <div className="flex justify-between"><span className="text-gray-500">Receita</span><span className="text-green-400 font-bold">{fmt(s.revenue)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Custo</span><span className="text-red-400 font-bold">{fmt(s.cost)}</span></div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-gray-500">Lucro</span>
                  <span className={profit >= 0 ? 'text-primary font-bold' : 'text-red-400 font-bold'}>{fmt(profit)}</span>
                </div>
                <div className="flex justify-between"><span className="text-gray-500">Margem</span><span className="text-white">{margin}%</span></div>
                {s.units > 0 && <div className="flex justify-between"><span className="text-gray-500">Unidades</span><span className="text-white">{s.units}</span></div>}
                {s.notes && <p className="text-gray-600 mt-2 border-t border-white/5 pt-2">{s.notes}</p>}
              </div>
            </Card>
          );
        })}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="font-display font-bold text-sm text-white tracking-wider">NOVO CENÁRIO</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">Nome *</label>
                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="Ex: Cenário Otimista" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs text-gray-500 mb-1 block">Receita (R$)</label>
                  <input type="number" min={0} step={0.01} value={form.revenue} onChange={e => setForm(f => ({ ...f, revenue: Number(e.target.value) }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="font-body text-xs text-gray-500 mb-1 block">Custo (R$)</label>
                  <input type="number" min={0} step={0.01} value={form.cost} onChange={e => setForm(f => ({ ...f, cost: Number(e.target.value) }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">Unidades estimadas</label>
                <input type="number" min={0} value={form.units} onChange={e => setForm(f => ({ ...f, units: Number(e.target.value) }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">Observações</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-white/10 text-gray-400 font-display text-xs">CANCELAR</Button>
                <Button type="submit" disabled={saving} className="flex-1 bg-primary text-black font-display font-bold text-xs">{saving ? 'SALVANDO...' : 'CRIAR'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
