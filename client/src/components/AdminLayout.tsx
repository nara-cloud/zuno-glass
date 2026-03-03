import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  LayoutDashboard, Package, BarChart3, Boxes,
  LogOut, Menu, X, Store, ChevronRight, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Pedidos', icon: Package },
  { href: '/admin/stock', label: 'Estoque', icon: Boxes },
  { href: '/admin/sales', label: 'Relatórios', icon: BarChart3 },
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

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location === href;
    return location.startsWith(href);
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
        className={`fixed top-0 left-0 h-full w-64 bg-[#111111] border-r border-white/10 z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <div>
              <p className="font-display font-bold text-sm text-white tracking-widest">ZUNO GLASS</p>
              <p className="font-body text-[10px] text-gray-500 tracking-wider">GESTÃO</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const active = isActive(item.href, item.exact);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 transition-all cursor-pointer group
                    ${active
                      ? 'bg-primary/10 border border-primary/30 text-primary'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
                  <span className="font-display font-bold text-xs tracking-wider">{item.label}</span>
                  {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/">
            <div className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
              <Store className="w-4 h-4" />
              <span className="font-body text-xs">Ver Loja</span>
            </div>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-body text-xs">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-white/10 bg-[#111111] flex items-center px-4 gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-base text-white tracking-wider">{title}</h1>
            {subtitle && <p className="font-body text-xs text-gray-500">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block font-body text-xs text-gray-500">Admin</span>
            <div className="w-7 h-7 bg-primary/20 border border-primary/30 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
