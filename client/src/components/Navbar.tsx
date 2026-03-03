import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, LogIn, LogOut, User, Package, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuthContext } from '@/contexts/AuthContext';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/logo-zuno-transparent_e9130bfd.png';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuthContext();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'COLEÇÃO', path: '/products' },
    { name: 'LAB', path: '/lab' },
    { name: 'SQUAD', path: '/squad' },
    { name: 'COMUNIDADE', path: '/community' },
    { name: 'APP', path: '/app' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('ops');
  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/10 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src={LOGO_URL}
            alt="ZUNO GLASS"
            className="h-14 md:h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`font-display font-medium text-sm tracking-widest hover:text-primary transition-colors relative group ${
                location === link.path ? 'text-primary' : 'text-white'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-primary transform origin-left transition-transform duration-300 ${
                location === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              {/* Botão do utilizador com dropdown */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 font-display font-bold text-xs tracking-wider text-gray-300 hover:text-white transition-colors px-3 py-1.5 border border-white/10 hover:border-white/30"
              >
                <User className="w-3.5 h-3.5" />
                {firstName}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-black border border-white/20 shadow-xl z-50">
                  {/* Cabeçalho do dropdown */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="font-display font-bold text-xs text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                  </div>

                  {/* Opções */}
                  <div className="py-1">
                    <Link href="/minha-conta" onClick={() => setIsUserMenuOpen(false)}>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/5 transition-colors cursor-pointer">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-display text-xs tracking-wider text-gray-300">MINHA CONTA</span>
                      </div>
                    </Link>
                    <Link href="/minha-conta" onClick={() => setIsUserMenuOpen(false)}>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/5 transition-colors cursor-pointer">
                        <Package className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-display text-xs tracking-wider text-gray-300">MEUS PEDIDOS</span>
                      </div>
                    </Link>

                    {/* Acesso Admin */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-white/10 my-1" />
                        <Link href="/admin" onClick={() => setIsUserMenuOpen(false)}>
                          <div className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-primary/10 transition-colors cursor-pointer">
                            <Shield className="w-3.5 h-3.5 text-primary" />
                            <span className="font-display text-xs tracking-wider text-primary">PAINEL ADMIN</span>
                          </div>
                        </Link>
                      </>
                    )}

                    {/* Sair */}
                    <div className="border-t border-white/10 my-1" />
                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-display text-xs tracking-wider text-gray-400">SAIR</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/entrar">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white hover:text-black font-display font-bold text-xs tracking-wider gap-1.5">
                <LogIn className="w-3.5 h-3.5" />
                ENTRAR
              </Button>
            </Link>
          )}
          <Link href="/try-on">
            <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-black font-display font-bold text-xs tracking-wider">
              TRY-ON
            </Button>
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            className="text-white hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-background z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            href={link.path}
            className="font-display font-bold text-3xl text-white hover:text-primary hover:italic transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        <Link href="/try-on" onClick={() => setIsMobileMenuOpen(false)}>
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-black font-display tracking-wider font-bold mt-4">
            TRY-ON VIRTUAL
          </Button>
        </Link>
        {isAuthenticated ? (
          <>
            <Link href="/minha-conta" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="font-display font-bold text-2xl text-white hover:text-primary transition-all">
                MINHA CONTA
              </span>
            </Link>
            <Link href="/minha-conta" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="font-display font-bold text-xl text-gray-300 hover:text-primary transition-all">
                MEUS PEDIDOS
              </span>
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="font-display font-bold text-xl text-primary hover:text-white transition-all flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  PAINEL ADMIN
                </span>
              </Link>
            )}
            <button
              onClick={() => { logout(); setIsMobileMenuOpen(false); }}
              className="font-display font-bold text-xl text-gray-400 hover:text-white transition-all flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              SAIR
            </button>
          </>
        ) : (
          <Link href="/entrar" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="font-display font-bold text-3xl text-white hover:text-primary hover:italic transition-all flex items-center gap-2">
              <LogIn className="w-7 h-7" />
              ENTRAR
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
