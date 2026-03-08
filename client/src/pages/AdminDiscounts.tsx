import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ToggleLeft, ToggleRight, Trash2, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface Coupon {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

function fmt(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export default function AdminDiscounts() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '', discount_type: 'percentual', discount_value: '', min_order_value: '', max_uses: '', expires_at: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gestao/coupons', { headers: getAuthHeaders() });
      const d = await res.json();
      setCoupons(Array.isArray(d) ? d : []);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: number) => {
    try {
      await fetch(`/api/admin/gestao/coupons/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      toast.success('Status do cupom atualizado');
      load();
    } catch {
      toast.error('Erro ao atualizar cupom');
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Remover este cupom?')) return;
    try {
      await fetch(`/api/admin/gestao/coupons/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      toast.success('Cupom removido');
      load();
    } catch {
      toast.error('Erro ao remover cupom');
    }
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.code.trim()) { setError('Informe o código do cupom'); return; }
    if (!form.discount_value) { setError('Informe o valor do desconto'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/gestao/coupons', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          code: form.code.trim().toUpperCase(),
          discountType: form.discount_type,
          discountValue: parseFloat(form.discount_value),
          minOrderValue: form.min_order_value ? parseFloat(form.min_order_value) : null,
          maxUses: form.max_uses ? parseInt(form.max_uses) : null,
          expiresAt: form.expires_at || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao criar cupom');
        return;
      }
      toast.success(`Cupom ${data.code} criado com sucesso!`);
      setShowForm(false);
      setForm({ code: '', discount_type: 'percentual', discount_value: '', min_order_value: '', max_uses: '', expires_at: '' });
      load();
    } catch {
      setError('Erro ao criar cupom. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const active = coupons.filter(c => c.is_active).length;

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <AdminLayout title="DESCONTOS" subtitle="Cupons e promoções">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#1a1a1a] border-white/10 p-4 text-center">
          <p className="font-display font-bold text-2xl text-primary">{coupons.length}</p>
          <p className="font-body text-xs text-gray-500 mt-1">Total de Cupons</p>
        </Card>
        <Card className="bg-[#1a1a1a] border-white/10 p-4 text-center">
          <p className="font-display font-bold text-2xl text-green-400">{active}</p>
          <p className="font-body text-xs text-gray-500 mt-1">Ativos</p>
        </Card>
        <Card className="bg-[#1a1a1a] border-white/10 p-4 text-center">
          <p className="font-display font-bold text-2xl text-red-400">{coupons.length - active}</p>
          <p className="font-body text-xs text-gray-500 mt-1">Inativos</p>
        </Card>
      </div>

      {/* Header com botão */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-sm text-white tracking-wider flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" /> CUPONS DE DESCONTO
        </h2>
        <Button
          onClick={() => { setShowForm(!showForm); setError(''); }}
          className="bg-primary text-black hover:bg-white font-display font-bold text-xs h-9 px-4 rounded-none"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> NOVO CUPOM
        </Button>
      </div>

      {/* Formulário de criação */}
      {showForm && (
        <Card className="bg-[#1a1a1a] border-primary/30 p-5 mb-6">
          <h3 className="font-display font-bold text-sm text-primary mb-4">CRIAR NOVO CUPOM</h3>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-body px-3 py-2 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={create} className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">Código *</label>
              <Input
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="Ex: ZUNO10"
                required
                className="bg-white/5 border-white/10 text-white h-9 text-xs rounded-none uppercase"
              />
            </div>
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">Tipo *</label>
              <select
                value={form.discount_type}
                onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))}
                className="w-full bg-[#0a0a0a] border border-white/10 text-white h-9 text-xs px-2 focus:outline-none focus:border-primary/50"
              >
                <option value="percentual">Percentual (%)</option>
                <option value="fixo">Fixo (R$)</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">
                Valor * {form.discount_type === 'percentual' ? '(%)' : '(R$)'}
              </label>
              <Input
                value={form.discount_value}
                onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))}
                type="number"
                step="0.01"
                min="0"
                placeholder={form.discount_type === 'percentual' ? '10' : '20.00'}
                required
                className="bg-white/5 border-white/10 text-white h-9 text-xs rounded-none"
              />
            </div>
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">Pedido Mínimo (R$)</label>
              <Input
                value={form.min_order_value}
                onChange={e => setForm(f => ({ ...f, min_order_value: e.target.value }))}
                type="number"
                step="0.01"
                min="0"
                placeholder="Sem mínimo"
                className="bg-white/5 border-white/10 text-white h-9 text-xs rounded-none"
              />
            </div>
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">Máximo de Usos</label>
              <Input
                value={form.max_uses}
                onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                type="number"
                min="1"
                placeholder="Ilimitado"
                className="bg-white/5 border-white/10 text-white h-9 text-xs rounded-none"
              />
            </div>
            <div>
              <label className="font-body text-xs text-gray-500 mb-1 block">Data de Expiração</label>
              <Input
                value={form.expires_at}
                onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="bg-white/5 border-white/10 text-white h-9 text-xs rounded-none"
              />
            </div>
            <div className="col-span-2 md:col-span-3 flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowForm(false); setError(''); }}
                className="border-white/20 text-gray-400 h-9 text-xs rounded-none hover:bg-white/5"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary text-black hover:bg-white font-bold h-9 text-xs rounded-none"
              >
                {saving ? 'Criando...' : 'Criar Cupom'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de cupons */}
      <Card className="bg-[#1a1a1a] border-white/10">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center">
            <Tag className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="font-body text-sm text-gray-500">Nenhum cupom criado ainda.</p>
            <p className="font-body text-xs text-gray-600 mt-1">Clique em "NOVO CUPOM" para criar o primeiro.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  {['Código', 'Tipo', 'Desconto', 'Usos', 'Mín. Pedido', 'Expira', 'Status', 'Ações'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => {
                  const expired = isExpired(c.expires_at);
                  return (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3 text-primary font-display font-bold tracking-wider">{c.code}</td>
                      <td className="px-4 py-3 text-gray-400 capitalize">{c.discount_type}</td>
                      <td className="px-4 py-3 text-white font-bold">
                        {c.discount_type === 'percentual' ? `${c.discount_value}%` : fmt(Number(c.discount_value))}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {c.min_order_value && Number(c.min_order_value) > 0 ? fmt(Number(c.min_order_value)) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {c.expires_at ? (
                          <span className={expired ? 'text-red-400' : 'text-gray-400'}>
                            {new Date(c.expires_at + 'T12:00:00').toLocaleDateString('pt-BR')}
                            {expired && ' (expirado)'}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={
                          expired ? 'bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]' :
                          c.is_active
                            ? 'bg-green-500/20 text-green-400 border-green-500/30 text-[10px]'
                            : 'bg-red-500/20 text-red-400 border-red-500/30 text-[10px]'
                        }>
                          {expired ? 'Expirado' : c.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggle(c.id)}
                            title={c.is_active ? 'Desativar' : 'Ativar'}
                            className="text-gray-400 hover:text-primary transition-colors"
                          >
                            {c.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => remove(c.id)}
                            title="Remover"
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
