import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users, Search, Shield, UserCheck, UserX,
  ChevronLeft, ChevronRight, RefreshCw, Edit2, Save, X
} from 'lucide-react';
import { toast } from 'sonner';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

const ALL_ROLES = ['admin', 'ops', 'creator_partner', 'customer', 'community_member'];

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  ops: 'Operações',
  creator_partner: 'Parceiro',
  customer: 'Cliente',
  community_member: 'Comunidade',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  ops: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  creator_partner: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  customer: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  community_member: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function AdminUsers() {
  const { token, authenticated: isAuthenticated, loading: authLoading } = useAdminAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editRoles, setEditRoles] = useState<string[]>([]);
  const [savingRoles, setSavingRoles] = useState(false);
  const perPage = 20;

  useEffect(() => {
    if (isAuthenticated) fetchUsers();
  }, [isAuthenticated, page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: perPage.toString(),
        ...(search ? { search } : {}),
      });
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('[AdminUsers] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoles = (user: UserRecord) => {
    setEditingUser(user);
    setEditRoles([...user.roles]);
  };

  const toggleRole = (role: string) => {
    setEditRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSaveRoles = async () => {
    if (!editingUser) return;
    setSavingRoles(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}/roles`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ roles: editRoles }),
      });
      if (res.ok) {
        toast.success('Papéis atualizados com sucesso!');
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error('Erro ao atualizar papéis.');
      }
    } catch {
      toast.error('Erro de conexão.');
    } finally {
      setSavingRoles(false);
    }
  };

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        toast.success(currentStatus ? 'Usuário desativado.' : 'Usuário ativado.');
        fetchUsers();
      }
    } catch {
      toast.error('Erro ao alterar status.');
    }
  };

  const totalPages = Math.ceil(total / perPage);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout title="Usuários" subtitle="Gestão de contas e permissões">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111] border border-white/10 p-4">
          <p className="text-xs text-gray-400 font-display tracking-widest mb-1">TOTAL</p>
          <p className="font-display font-bold text-2xl text-white">{total}</p>
        </div>
        <div className="bg-[#111] border border-white/10 p-4">
          <p className="text-xs text-gray-400 font-display tracking-widest mb-1">CLIENTES</p>
          <p className="font-display font-bold text-2xl text-blue-400">
            {users.filter(u => u.roles.includes('customer')).length}
          </p>
        </div>
        <div className="bg-[#111] border border-white/10 p-4">
          <p className="text-xs text-gray-400 font-display tracking-widest mb-1">PARCEIROS</p>
          <p className="font-display font-bold text-2xl text-purple-400">
            {users.filter(u => u.roles.includes('creator_partner')).length}
          </p>
        </div>
        <div className="bg-[#111] border border-white/10 p-4">
          <p className="text-xs text-gray-400 font-display tracking-widest mb-1">ADMINS</p>
          <p className="font-display font-bold text-2xl text-red-400">
            {users.filter(u => u.roles.includes('admin')).length}
          </p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por nome ou e-mail..."
            className="pl-9 bg-[#111] border-white/10 text-white placeholder:text-gray-600 h-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          className="border-white/10 text-gray-400 hover:text-white gap-2"
        >
          <RefreshCw className="w-3 h-3" />
          Atualizar
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-xs font-display tracking-widest text-gray-500">USUÁRIO</th>
                <th className="text-left p-4 text-xs font-display tracking-widest text-gray-500 hidden md:table-cell">PAPÉIS</th>
                <th className="text-left p-4 text-xs font-display tracking-widest text-gray-500 hidden lg:table-cell">CADASTRO</th>
                <th className="text-left p-4 text-xs font-display tracking-widest text-gray-500 hidden lg:table-cell">ÚLTIMO LOGIN</th>
                <th className="text-right p-4 text-xs font-display tracking-widest text-gray-500">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum usuário encontrado</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-white text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        {user.phone && <p className="text-xs text-gray-600 mt-0.5">{user.phone}</p>}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? user.roles.map(role => (
                          <span
                            key={role}
                            className={`text-[10px] px-2 py-0.5 border font-display tracking-wider ${ROLE_COLORS[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}
                          >
                            {ROLE_LABELS[role] || role}
                          </span>
                        )) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <p className="text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <p className="text-xs text-gray-400">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString('pt-BR')
                          : '—'}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditRoles(user)}
                          className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                          title="Editar papéis"
                        >
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          className={`p-1.5 transition-colors ${user.isActive ? 'text-green-400 hover:text-red-400' : 'text-red-400 hover:text-green-400'}`}
                          title={user.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {user.isActive ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <p className="text-xs text-gray-500">
              {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} de {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-400">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Roles Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/20 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-white tracking-tight">EDITAR PAPÉIS</h3>
                <p className="text-xs text-gray-400 mt-1">{editingUser.name}</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {ALL_ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`w-full flex items-center justify-between p-3 border transition-colors ${
                    editRoles.includes(role)
                      ? 'border-primary/50 bg-primary/10 text-white'
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <span className="font-display text-xs tracking-wider">{ROLE_LABELS[role]}</span>
                  {editRoles.includes(role) && (
                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEditingUser(null)}
                className="flex-1 border-white/10 text-gray-400 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveRoles}
                disabled={savingRoles}
                className="flex-1 bg-primary text-black hover:bg-primary/90 font-display tracking-wider text-xs"
              >
                {savingRoles ? 'SALVANDO...' : 'SALVAR'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
