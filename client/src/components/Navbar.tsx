import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuthContext } from '@/contexts/AuthContext';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/logo-zuno-transparent_e9130bfd.png';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'COLEÇÃO', path: '/products' },
    { name: 'LAB', path: '/lab' },
    { name: 'SQUAD', path: '/squad' },
    { name: 'COMUNIDADE', path: '/community' },
    { name: 'APP', path: '/app' },
    { name: 'FAQ', path: '/faq' },
  ];

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
            <div className="flex items-center gap-2">
              <Link href="/minha-conta">
                <span className="font-body text-xs text-gray-300 hidden lg:block hover:text-white transition-colors cursor-pointer">
                  {user?.name?.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 font-display font-bold text-xs tracking-wider text-gray-400 hover:text-white transition-colors px-3 py-1.5 border border-white/10 hover:border-white/30"
                title="Sair"
              >
                <LogOut className="w-3.5 h-3.5" />
                SAIR
              </button>
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
        <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="font-display font-bold text-3xl text-white hover:text-primary hover:italic transition-all">
            MEUS PEDIDOS
          </span>
        </Link>
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
