import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, LogIn, LogOut, User, Package, Shield, ChevronDown, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuthContext } from '@/contexts/AuthContext';

const LOGO_URL = '/images/logo-zuno-white.png';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuthContext();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  // Bloquear scroll do body quando menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const openMobileMenu = () => setIsMobileMenuOpen(true);

  return (
    <>
    {/* Navbar estático (não sticky) */}
    <nav className="w-full z-50 bg-background border-b border-white/10" style={{height: '64px', overflow: 'visible'}}>
      <div className="container flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
          <img
            src={LOGO_URL}
            alt="ZUNO GLASS"
            className="h-20 md:h-24 w-auto object-contain" style={{marginTop: '4px', marginBottom: '4px'}}
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 font-display font-bold text-xs tracking-wider text-gray-300 hover:text-white transition-colors px-3 py-1.5 border border-white/10 hover:border-white/30"
              >
                <User className="w-3.5 h-3.5" />
                {firstName}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-black border border-white/20 shadow-xl z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="font-display font-bold text-xs text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                  </div>
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
          {/* Carrinho */}
          <button
            onClick={openCart}
            className="relative p-2 text-white hover:text-primary transition-colors"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-display font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-white/20 text-white font-display font-bold text-xs tracking-wider cursor-not-allowed opacity-60"
            >
              TRY-ON
            </Button>
            <span className="absolute -top-2 -right-2 bg-primary text-black text-[8px] font-display font-bold px-1 py-0.5 tracking-widest leading-none">
              EM BREVE
            </span>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          {/* Carrinho mobile */}
          <button
            onClick={openCart}
            className="relative p-2 text-white hover:text-primary transition-colors"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-display font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
          <button
            className="text-white hover:text-primary transition-colors p-2"
            onClick={openMobileMenu}
            aria-label="Abrir menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile Menu — overlay fixo com z-index alto */}
    {isMobileMenuOpen && (
      <>
        {/* Backdrop para fechar ao clicar fora */}
        <div
          className="fixed inset-0 bg-black/80 z-[199] md:hidden"
          onClick={closeMobileMenu}
        />
        {/* Menu panel */}
        <div
          className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0a0a0a] z-[200] flex flex-col md:hidden shadow-2xl border-l border-white/10"
          style={{ overflowY: 'auto' }}
        >
          {/* Header do menu mobile */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
            <Link href="/" onClick={closeMobileMenu}>
              <img
                src={LOGO_URL}
                alt="ZUNO GLASS"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <button
              onClick={closeMobileMenu}
              className="text-white hover:text-primary transition-colors p-3 bg-white/10 hover:bg-white/20 rounded-lg active:scale-95"
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links de navegação */}
          <div className="flex flex-col px-6 py-8 gap-2 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-display font-bold text-2xl py-3 border-b border-white/5 transition-all hover:text-primary hover:pl-2 ${
                  location === link.path ? 'text-primary' : 'text-white'
                }`}
                onClick={closeMobileMenu}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-3">
              {/* Carrinho */}
              <button
                onClick={() => { openCart(); closeMobileMenu(); }}
                className="flex items-center gap-3 font-display font-bold text-xl text-white hover:text-primary transition-all py-2"
              >
                <ShoppingCart className="w-6 h-6" />
                CARRINHO
                {totalItems > 0 && (
                  <span className="bg-primary text-black text-xs font-display font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Try-On */}
              <div className="relative w-fit">
                <Button
                  variant="outline"
                  size="lg"
                  disabled
                  className="border-white/20 text-white font-display tracking-wider font-bold cursor-not-allowed opacity-60"
                >
                  TRY-ON VIRTUAL
                </Button>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-black text-[9px] font-display font-bold px-2 py-0.5 tracking-widest whitespace-nowrap">
                  EM BREVE
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/minha-conta" onClick={closeMobileMenu}>
                    <span className="flex items-center gap-3 font-display font-bold text-xl text-white hover:text-primary transition-all py-2">
                      <User className="w-5 h-5" />
                      MINHA CONTA
                    </span>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={closeMobileMenu}>
                      <span className="flex items-center gap-3 font-display font-bold text-xl text-primary hover:text-white transition-all py-2">
                        <Shield className="w-5 h-5" />
                        PAINEL ADMIN
                      </span>
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); closeMobileMenu(); }}
                    className="flex items-center gap-3 font-display font-bold text-xl text-gray-400 hover:text-white transition-all py-2"
                  >
                    <LogOut className="w-5 h-5" />
                    SAIR
                  </button>
                </>
              ) : (
                <Link href="/entrar" onClick={closeMobileMenu}>
                  <span className="flex items-center gap-3 font-display font-bold text-2xl text-white hover:text-primary transition-all py-2">
                    <LogIn className="w-6 h-6" />
                    ENTRAR
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
}
