import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  description: string | null;
  discountType: 'percentual' | 'fixo';
  discountValue: number;
  minOrderValue: number;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

function fmt(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

export default function AdminDiscounts() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '', discountType: 'percentual', discountValue: '', minOrderValue: '', maxUses: '', expiresAt: '',
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch('/api/admin/gestao/coupons', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setCoupons(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: number) => {
    await fetch(`/api/admin/gestao/coupons/${id}/toggle`, { method: 'PATCH', credentials: 'include' });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('Remover este cupom?')) return;
    await fetch(`/api/admin/gestao/coupons/${id}`, { method: 'DELETE', credentials: 'include' });
    load();
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/gestao/coupons', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) * 100 : 0,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      }),
    });
    setSaving(false);
    setShowForm(false);
    setForm({ code: '', discountType: 'percentual', discountValue: '', minOrderValue: '', maxUses: '', expiresAt: '' });
    load();
  };

  const active = coupons.filter(c => c.isActive).length;

  return (
    <AdminLayout title="DESCONTOS" subtitle="Cupons e promoções">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-primary">{coupons.length}</p>
            <p className="font-body text-xs text-gray-500">Total</p>
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-green-400">{active}</p>
            <p className="font-body text-xs text-gray-500">Activos</p>
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-red-400">{coupons.length - active}</p>
            <p className="font-body text-xs text-gray-500">Inactivos</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-black hover:bg-white font-display font-bold text-xs h-9 px-4 rounded-none"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> NOVO CUPOM
        </Button>
      </div>

      {showForm && (
        <Card className="bg-[#1a1a1a] border-primary/30 p-5 mb-6">
          <h3 className="font-display font-bold text-sm text-primary mb-4">CRIAR NOVO CUPOM</h3>
          <form onSubmit={create} className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">Código *</label>
              <Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                placeholder="EX: ZUNO10" required
                className="bg-white/5 border-white/10 text-white h-9 text-xs rounded-none" />
            </div>
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">Tipo *</label>
              <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}
                className="w-full bg-[#0a0a0a] border border-white/10 text-white h-9 text-xs px-2">
                <option value="percentual">Percentual (%)</option>
                <option value="fixo">Fixo (R$)</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">Valor *</label>
              <Input value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                type="number" placeholder={form.discountType === 'percentual' ? '10' : '20'} required
                className="bg-white/5 border-white/10 text-white h-9 text-xs rounded-none" />
            </div>
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">Pedido Mínimo (R$)</label>
              <Input value={form.minOrderValue} onChange={e => setForm(f => ({ ...f, minOrderValue: e.target.value }))}
                type="number" placeholder="0"
                className="bg-white/5 border-white/10 text-white h-9 text-xs rounded-none" />
            </div>
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">Máximo de Usos</label>
              <Input value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
                type="number" placeholder="Ilimitado"
                className="bg-white/5 border-white/10 text-white h-9 text-xs rounded-none" />
            </div>
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">Expira em</label>
              <Input value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                type="date"
                className="bg-white/5 border-white/10 text-white h-9 text-xs rounded-none" />
            </div>
            <div className="col-span-2 md:col-span-3 flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}
                className="border-white/20 text-gray-400 h-9 text-xs rounded-none">Cancelar</Button>
              <Button type="submit" disabled={saving}
                className="bg-primary text-black hover:bg-white font-bold h-9 text-xs rounded-none">
                {saving ? 'Criando...' : 'Criar Cupom'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="bg-[#1a1a1a] border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-display font-bold text-sm text-white tracking-wider">TODOS OS CUPONS</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-body text-sm">Nenhum cupom criado ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  {['Código', 'Tipo', 'Desconto', 'Usos', 'Mín. Pedido', 'Expira', 'Status', 'Acções'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-primary font-display font-bold">{c.code}</td>
                    <td className="px-4 py-3 text-gray-400">{c.discountType}</td>
                    <td className="px-4 py-3 text-white font-bold">
                      {c.discountType === 'percentual' ? `${c.discountValue}%` : fmt(c.discountValue * 100)}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ''}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{c.minOrderValue > 0 ? fmt(c.minOrderValue) : '—'}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={c.isActive
                        ? 'bg-green-500/20 text-green-400 border-green-500/30 text-[10px]'
                        : 'bg-red-500/20 text-red-400 border-red-500/30 text-[10px]'}>
                        {c.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => toggle(c.id)} className="text-gray-400 hover:text-primary transition-colors">
                          {c.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button onClick={() => remove(c.id)} className="text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
