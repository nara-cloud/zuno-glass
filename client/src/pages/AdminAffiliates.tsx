import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, Link as LinkIcon, Plus, X, Trash2 } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';

interface Affiliate {
  id: number;
  name: string;
  email: string;
  code: string;
  instagram?: string;
  commission_rate: number;
  total_sales: number;
  total_earnings: number;
  is_active: boolean;
  created_at: string;
}

function fmt(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
}

function generateCode(name: string) {
  return name.toUpperCase().replace(/\s+/g, '').slice(0, 6) + Math.floor(Math.random() * 100);
}

export default function AdminAffiliates() {
  const { getAuthHeaders } = useAdminAuth();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', instagram: '', code: '', commission_rate: 10 });

  const load = () => {
    fetch('/api/admin/gestao/affiliates', { headers: getAuthHeaders(), credentials: 'include' })
      .then(r => r.json())
      .then(d => setAffiliates(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form, code: form.code || generateCode(form.name), total_sales: 0, total_earnings: 0, is_active: true };
      const res = await fetch('/api/admin/gestao/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erro');
      toast.success('Afiliado cadastrado!');
      setShowModal(false);
      setForm({ name: '', email: '', instagram: '', code: '', commission_rate: 10 });
      load();
    } catch { toast.error('Erro ao cadastrar'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remover afiliado?')) return;
    await fetch(`/api/admin/gestao/affiliates/${id}`, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
    toast.success('Removido'); load();
  };

  const toggleActive = async (a: Affiliate) => {
    await fetch(`/api/admin/gestao/affiliates/${a.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify({ is_active: !a.is_active }),
    });
    load();
  };

  return (
    <AdminLayout title="AFILIADOS" subtitle="Programa de afiliados e comissões">
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <p className="font-display font-bold text-2xl text-primary">{affiliates.length}</p>
          <p className="font-body text-xs text-gray-500">Total</p>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-2xl text-green-400">{affiliates.filter(a => a.is_active).length}</p>
          <p className="font-body text-xs text-gray-500">Ativos</p>
        </div>
        <div className="ml-auto">
          <Button onClick={() => setShowModal(true)} className="bg-primary text-black font-display font-bold text-xs tracking-wider gap-2">
            <Plus className="w-4 h-4" /> NOVO AFILIADO
          </Button>
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
            <p className="font-body text-xs text-gray-600">Clique em "NOVO AFILIADO" para cadastrar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  {['Nome', 'Instagram', 'Código', 'Comissão', 'Vendas', 'Total Ganho', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {affiliates.map(a => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3"><div><p className="text-white font-bold">{a.name}</p>{a.email && <p className="text-gray-500 text-[10px]">{a.email}</p>}</div></td>
                    <td className="px-4 py-3 text-gray-400">{a.instagram ? `@${a.instagram}` : '—'}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1 text-primary font-display font-bold"><LinkIcon className="w-3 h-3" />{a.code}</div></td>
                    <td className="px-4 py-3 text-gray-400">{a.commission_rate}%</td>
                    <td className="px-4 py-3 text-gray-400">{a.total_sales || 0}</td>
                    <td className="px-4 py-3 text-primary font-bold">{fmt(a.total_earnings || 0)}</td>
                    <td className="px-4 py-3"><button onClick={() => toggleActive(a)}><Badge className={a.is_active ? 'bg-green-500/20 text-green-400 border-green-500/30 text-[10px] cursor-pointer' : 'bg-red-500/20 text-red-400 border-red-500/30 text-[10px] cursor-pointer'}>{a.is_active ? 'Ativo' : 'Inativo'}</Badge></button></td>
                    <td className="px-4 py-3"><button onClick={() => handleDelete(a.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
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
              <h2 className="font-display font-bold text-sm text-white tracking-wider">NOVO AFILIADO</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div><label className="font-body text-xs text-gray-500 mb-1 block">Nome *</label><input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="Nome completo" /></div>
              <div><label className="font-body text-xs text-gray-500 mb-1 block">E-mail</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="email@exemplo.com" /></div>
              <div><label className="font-body text-xs text-gray-500 mb-1 block">Instagram</label><input type="text" value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value.replace('@', '') }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="@usuario" /></div>
              <div><label className="font-body text-xs text-gray-500 mb-1 block">Código (deixe em branco para gerar automaticamente)</label><input type="text" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="Ex: ZUNO10" /></div>
              <div><label className="font-body text-xs text-gray-500 mb-1 block">Taxa de comissão (%)</label><input type="number" min={1} max={50} value={form.commission_rate} onChange={e => setForm(f => ({ ...f, commission_rate: Number(e.target.value) }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" /></div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-white/10 text-gray-400 font-display text-xs">CANCELAR</Button>
                <Button type="submit" disabled={saving} className="flex-1 bg-primary text-black font-display font-bold text-xs">{saving ? 'SALVANDO...' : 'CADASTRAR'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
