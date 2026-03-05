import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { getAuthHeaders } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    storeName: 'ZUNO GLASS',
    adminPassword: '',
    adminPasswordConfirm: '',
    freeShippingThreshold: 299,
    shippingCost: 19.90,
    whatsapp: '',
    instagram: '',
    email: '',
  });

  useEffect(() => {
    fetch('/api/admin/settings', { headers: getAuthHeaders(), credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d && typeof d === 'object') {
          setForm(f => ({ ...f, ...d, adminPassword: '', adminPasswordConfirm: '' }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.adminPassword && form.adminPassword !== form.adminPasswordConfirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    setSaving(true);
    try {
      const payload: any = { ...form };
      delete payload.adminPasswordConfirm;
      if (!payload.adminPassword) delete payload.adminPassword;
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success('Configurações salvas!');
      setForm(f => ({ ...f, adminPassword: '', adminPasswordConfirm: '' }));
    } catch { toast.error('Erro ao salvar'); } finally { setSaving(false); }
  };

  return (
    <AdminLayout title="CONFIGURAÇÕES" subtitle="Configurações gerais da plataforma">
      {loading ? (
        <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : (
        <form onSubmit={handleSave} className="max-w-2xl space-y-6">
          <Card className="bg-[#1a1a1a] border-white/10 p-6">
            <h3 className="font-display font-bold text-sm text-white tracking-wider mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" /> LOJA
            </h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">Nome da Loja</label>
                <input type="text" value={form.storeName} onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-gray-500 mb-1 block">Frete Grátis acima de (R$)</label>
                  <input type="number" min={0} step={0.01} value={form.freeShippingThreshold} onChange={e => setForm(f => ({ ...f, freeShippingThreshold: Number(e.target.value) }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="font-body text-xs text-gray-500 mb-1 block">Custo do Frete (R$)</label>
                  <input type="number" min={0} step={0.01} value={form.shippingCost} onChange={e => setForm(f => ({ ...f, shippingCost: Number(e.target.value) }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1a1a] border-white/10 p-6">
            <h3 className="font-display font-bold text-sm text-white tracking-wider mb-4">CONTATO</h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">WhatsApp</label>
                <input type="text" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="5511999999999" />
              </div>
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">Instagram</label>
                <input type="text" value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="@zunoglass" />
              </div>
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">E-mail de contato</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="contato@zunoglass.com" />
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1a1a] border-white/10 p-6">
            <h3 className="font-display font-bold text-sm text-white tracking-wider mb-4">SEGURANÇA</h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">Nova Senha do Admin (deixe em branco para não alterar)</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={form.adminPassword} onChange={e => setForm(f => ({ ...f, adminPassword: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 pr-10 font-body focus:outline-none focus:border-primary" placeholder="Nova senha" />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-gray-500 mb-1 block">Confirmar Nova Senha</label>
                <input type={showPassword ? 'text' : 'password'} value={form.adminPasswordConfirm} onChange={e => setForm(f => ({ ...f, adminPasswordConfirm: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="Confirmar senha" />
              </div>
            </div>
          </Card>

          <Button type="submit" disabled={saving} className="bg-primary text-black font-display font-bold text-xs tracking-wider w-full py-3">
            {saving ? 'SALVANDO...' : 'SALVAR CONFIGURAÇÕES'}
          </Button>
        </form>
      )}
    </AdminLayout>
  );
}
