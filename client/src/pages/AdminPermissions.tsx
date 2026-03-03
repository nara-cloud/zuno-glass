import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Search, UserPlus, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  roles: string[];
}

const ROLES = [
  { id: 'admin', label: 'Admin', description: 'Acesso total ao painel', color: 'bg-primary/20 text-primary border-primary/30' },
  { id: 'ops', label: 'Operações', description: 'Gestão de pedidos e estoque', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'creator_partner', label: 'Creator/Parceiro', description: 'Acesso a afiliados e marketing', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'squad', label: 'Squad', description: 'Membro do Squad ZUNO', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'community_member', label: 'Comunidade', description: 'Membro da comunidade', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'customer', label: 'Cliente', description: 'Cliente registado', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
];

const SQUAD_MEMBERS = [
  { name: 'Nara Ferrari', email: 'nara@triadeconstrutorabr.com', role: 'admin' },
  { name: 'Luiza Ferrari', email: 'luiza@zunoglass.com', role: 'squad' },
  { name: 'Eduardo Rodrigues', email: 'eduardo@zunoglass.com', role: 'squad' },
  { name: 'Natália Leite', email: 'natalia@zunoglass.com', role: 'squad' },
  { name: 'Beatriz Cordeiro', email: 'beatriz.c@zunoglass.com', role: 'squad' },
  { name: 'Lucas Corlett', email: 'lucas@zunoglass.com', role: 'squad' },
  { name: 'Luanda Passos', email: 'luanda@zunoglass.com', role: 'squad' },
];

export default function AdminPermissions() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  const load = (q = '') => {
    setLoading(true);
    fetch(`/api/admin/users?limit=200&search=${encodeURIComponent(q)}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setUsers(d.users || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (userId: number, role: string, hasRole: boolean) => {
    setUpdating(userId);
    try {
      const method = hasRole ? 'DELETE' : 'POST';
      const res = await fetch(`/api/admin/users/${userId}/roles`, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        toast.success(hasRole ? `Papel "${role}" removido` : `Papel "${role}" adicionado`);
        load(search);
      } else {
        toast.error('Erro ao actualizar papel');
      }
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role: string) => ROLES.find(r => r.id === role)?.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  const getRoleLabel = (role: string) => ROLES.find(r => r.id === role)?.label || role;

  return (
    <AdminLayout title="PERMISSÕES" subtitle="Gestão de papéis e acessos">
      {/* Roles Reference */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {ROLES.map(r => (
          <Card key={r.id} className={`bg-[#1a1a1a] border p-3 ${r.color.includes('primary') ? 'border-primary/20' : 'border-white/10'}`}>
            <Badge className={`${r.color} border text-[10px] mb-2`}>{r.label}</Badge>
            <p className="font-body text-[10px] text-gray-500">{r.description}</p>
          </Card>
        ))}
      </div>

      {/* Squad Members Section */}
      <Card className="bg-[#1a1a1a] border-blue-500/20 mb-6">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <h2 className="font-display font-bold text-sm text-white tracking-wider">MEMBROS DO SQUAD</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b border-white/10">
                {['Nome', 'Email', 'Papel Esperado', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SQUAD_MEMBERS.map(sm => {
                const found = users.find(u => u.email === sm.email);
                const hasRole = found?.roles?.includes(sm.role);
                return (
                  <tr key={sm.email} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-white font-bold">{sm.name}</td>
                    <td className="px-4 py-3 text-gray-400">{sm.email}</td>
                    <td className="px-4 py-3">
                      <Badge className={`${getRoleColor(sm.role)} border text-[10px]`}>{getRoleLabel(sm.role)}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {!found ? (
                        <span className="text-gray-600 text-[10px]">Não registado</span>
                      ) : hasRole ? (
                        <div className="flex items-center gap-1 text-green-400">
                          <Check className="w-3 h-3" />
                          <span className="text-[10px]">Configurado</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => toggleRole(found.id, sm.role, false)}
                          disabled={updating === found.id}
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 h-6 text-[10px] px-2 rounded-none"
                        >
                          <UserPlus className="w-3 h-3 mr-1" /> Atribuir
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* All Users */}
      <Card className="bg-[#1a1a1a] border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <Input
              value={search}
              onChange={e => { setSearch(e.target.value); load(e.target.value); }}
              placeholder="Buscar utilizador..."
              className="bg-white/5 border-white/10 text-white h-9 text-xs pl-9 rounded-none"
            />
          </div>
          <h2 className="font-display font-bold text-sm text-white tracking-wider ml-auto">TODOS OS UTILIZADORES</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-body text-sm">Nenhum utilizador encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">Utilizador</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">Papéis Actuais</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">Adicionar Papel</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <p className="text-white font-bold">{u.name || '—'}</p>
                      <p className="text-gray-500 text-[10px]">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(u.roles || []).length === 0 ? (
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-[10px] border">—</Badge>
                        ) : (
                          u.roles.map(r => (
                            <div key={r} className="flex items-center gap-0.5">
                              <Badge className={`${getRoleColor(r)} border text-[10px]`}>{getRoleLabel(r)}</Badge>
                              <button
                                onClick={() => toggleRole(u.id, r, true)}
                                disabled={updating === u.id}
                                className="text-gray-600 hover:text-red-400 transition-colors ml-0.5"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {ROLES.filter(r => !u.roles?.includes(r.id)).map(r => (
                          <button
                            key={r.id}
                            onClick={() => toggleRole(u.id, r.id, false)}
                            disabled={updating === u.id}
                            className={`text-[10px] px-2 py-0.5 border rounded-none hover:opacity-80 transition-opacity ${r.color}`}
                          >
                            + {r.label}
                          </button>
                        ))}
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
