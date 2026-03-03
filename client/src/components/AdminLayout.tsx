import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  LayoutDashboard, Package, BarChart3, Boxes,
  LogOut, Menu, X, Store, ChevronRight, ShieldCheck, Users, Tag,
  DollarSign, TrendingUp, Wallet, PiggyBank, CreditCard,
  Percent, UserCheck, Bot, Target, LineChart, Handshake,
  Settings, Plug, FolderOpen, ChevronDown, ChevronUp,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'PRINCIPAL',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'GESTÃO',
    items: [
      { href: '/admin/orders', label: 'Pedidos', icon: Package },
      { href: '/admin/products', label: 'Produtos', icon: Tag },
      { href: '/admin/stock', label: 'Estoque', icon: Boxes },
      { href: '/admin/clients', label: 'Clientes', icon: Users },
      { href: '/admin/collections', label: 'Coleções', icon: FolderOpen },
    ],
  },
  {
    label: 'FINANCEIRO',
    items: [
      { href: '/admin/sales', label: 'Vendas', icon: TrendingUp },
      { href: '/admin/financial', label: 'Financeiro', icon: DollarSign },
      { href: '/admin/cashflow', label: 'Fluxo de Caixa', icon: Wallet },
      { href: '/admin/investments', label: 'Investimentos', icon: PiggyBank },
      { href: '/admin/payments', label: 'Pagamentos', icon: CreditCard },
    ],
  },
  {
    label: 'MARKETING',
    items: [
      { href: '/admin/discounts', label: 'Descontos', icon: Percent },
      { href: '/admin/affiliates', label: 'Afiliados', icon: UserCheck },
      { href: '/admin/bot', label: 'Bot Z4', icon: Bot },
      { href: '/admin/scenarios', label: 'Cenários', icon: Target },
      { href: '/admin/profitability', label: 'Rentabilidade', icon: LineChart },
    ],
  },
  {
    label: 'ADMINISTRAÇÃO',
    items: [
      { href: '/admin/partners', label: 'Sócios', icon: Handshake },
      { href: '/admin/users', label: 'Permissões', icon: ShieldCheck },
      { href: '/admin/integrations', label: 'Integração', icon: Plug },
      { href: '/admin/settings', label: 'Configurações', icon: Settings },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [location] = useLocation();
  const { logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location === href;
    return location.startsWith(href);
  };

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-[#111111] border-r border-white/10 z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <div>
              <p className="font-display font-bold text-xs text-white tracking-widest">ZUNO GLASS</p>
              <p className="font-body text-[9px] text-gray-500 tracking-wider">GESTÃO</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-2 overflow-y-auto scrollbar-thin">
          {navGroups.map(group => {
            const isCollapsed = collapsedGroups[group.label];
            return (
              <div key={group.label}>
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-2 py-1 mb-0.5"
                >
                  <span className="font-display font-bold text-[9px] text-gray-600 tracking-widest">{group.label}</span>
                  {isCollapsed
                    ? <ChevronDown className="w-2.5 h-2.5 text-gray-600" />
                    : <ChevronUp className="w-2.5 h-2.5 text-gray-600" />
                  }
                </button>
                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {group.items.map(item => {
                      const active = isActive(item.href, item.exact);
                      return (
                        <Link key={item.href} href={item.href}>
                          <div
                            className={`flex items-center gap-2.5 px-3 py-2 transition-all cursor-pointer
                              ${active
                                ? 'bg-primary/10 border border-primary/30 text-primary'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                              }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
                            <span className="font-display font-bold text-[10px] tracking-wider">{item.label}</span>
                            {active && <ChevronRight className="w-2.5 h-2.5 ml-auto" />}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 py-3 border-t border-white/10 space-y-1">
          <Link href="/">
            <div className="flex items-center gap-2.5 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
              <Store className="w-3.5 h-3.5" />
              <span className="font-body text-[10px]">Ver Loja</span>
            </div>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="font-body text-[10px]">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-12 border-b border-white/10 bg-[#111111] flex items-center px-4 gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-sm text-white tracking-wider">{title}</h1>
            {subtitle && <p className="font-body text-[10px] text-gray-500">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block font-body text-[10px] text-gray-500">Admin</span>
            <div className="w-6 h-6 bg-primary/20 border border-primary/30 flex items-center justify-center">
              <ShieldCheck className="w-3 h-3 text-primary" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
