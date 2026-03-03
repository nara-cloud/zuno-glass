import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  roles: string[];
}

export default function AdminClients() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = (q = '') => {
    setLoading(true);
    fetch(`/api/admin/users?limit=100&search=${encodeURIComponent(q)}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setTotal(d.total || 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    load(e.target.value);
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-primary/20 text-primary border-primary/30',
    squad: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    user: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <AdminLayout title="CLIENTES" subtitle="Utilizadores registados na plataforma">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <p className="font-display font-bold text-2xl text-primary">{total}</p>
            <p className="font-body text-xs text-gray-500">Utilizadores registados</p>
          </div>
        </div>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <Input
              value={search}
              onChange={handleSearch}
              placeholder="Buscar por nome ou email..."
              className="bg-white/5 border-white/10 text-white h-9 text-xs pl-9 rounded-none"
            />
          </div>
          <span className="font-body text-xs text-gray-500">{users.length} resultado(s)</span>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-body text-sm">Nenhum utilizador encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-white/10">
                  {['ID', 'Nome', 'Email', 'Papéis', 'Registado em'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-gray-600">#{u.id}</td>
                    <td className="px-4 py-3 text-white font-bold">{u.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(u.roles || []).length === 0 ? (
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-[10px]">user</Badge>
                        ) : (
                          u.roles.map(r => (
                            <Badge key={r} className={`${roleColors[r] || roleColors.user} text-[10px] border`}>{r}</Badge>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '—'}
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
