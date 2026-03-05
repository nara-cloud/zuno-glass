import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import {
  Eye, EyeOff, Lock, LogIn, ArrowLeft,
  Package, BarChart3, ShoppingBag, DollarSign,
  TrendingUp, Users, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// ─── Login Screen ─────────────────────────────────────────────────────────────
function AdminLogin() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    const ok = await login(password);
    if (!ok) {
      setLoginError('Senha incorreta. Tente novamente.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <Link href="/">
          <img
            src="/images/logo-zuno-trim.png"
            alt="ZUNO GLASS"
            className="h-10 w-auto object-contain"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/logo-zuno-white.png'; }}
          />
        </Link>
      </div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white tracking-widest mb-1">PAINEL ADMIN</h1>
          <p className="font-body text-sm text-gray-500">Área restrita — ZUNO GLASS</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-6 space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Senha de acesso"
              autoFocus
              className="w-full bg-black/50 border border-white/10 px-4 py-3 font-body text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {loginError && <p className="font-body text-xs text-red-400">{loginError}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black hover:bg-white font-display font-bold tracking-wider h-11"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                ENTRAR
              </>
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="font-body text-xs text-gray-600 hover:text-white transition-colors flex items-center justify-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function AdminDashboard() {
  const { getAuthHeaders } = useAdminAuth();
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, waitlistCount: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const cards = [
    {
      icon: DollarSign,
      label: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toFixed(2).replace('.', ',')}`,
      sub: 'Hoje: R$ 0,00',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Package,
      label: 'Total de Pedidos',
      value: stats.totalOrders,
      sub: `Hoje: ${stats.totalOrders}`,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      icon: RefreshCw,
      label: 'Pendentes',
      value: stats.pendingOrders,
      sub: 'Aguardando ação',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      icon: TrendingUp,
      label: 'Pedidos Hoje',
      value: 0,
      sub: 'R$ 0,00',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
  ];

  const quickLinks = [
    { icon: Package, label: 'Gerenciar Pedidos', sub: 'Ver e atualizar status dos pedidos', href: '/admin/orders' },
    { icon: BarChart3, label: 'Ver Estoque', sub: 'Sincronizado com ZUNO Gestão', href: '/admin/stock' },
    { icon: TrendingUp, label: 'Relatórios', sub: 'Análise de vendas e receita', href: '/admin/sales' },
  ];

  return (
    <AdminLayout title="DASHBOARD" subtitle="Visão geral do e-commerce">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-xs text-gray-400">{card.label}</p>
                <div className={`w-8 h-8 ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <p className={`font-display font-bold text-2xl ${card.color}`}>{card.value}</p>
                  <p className="font-body text-[10px] text-gray-600 mt-1">{card.sub}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => navigate(link.href)}
              className="bg-white/5 border border-white/10 p-5 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
            >
              <link.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-display font-bold text-sm text-white tracking-wider">{link.label}</p>
              <p className="font-body text-xs text-gray-500 mt-1">{link.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Admin() {
  const { authenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!authenticated) return <AdminLogin />;

  return <AdminDashboard />;
}
