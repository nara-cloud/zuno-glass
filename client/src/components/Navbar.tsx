import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

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
            <img src="/images/logo-zuno.png" alt="ZUNO GLASS" className="h-10 md:h-12 w-auto object-contain brightness-0 invert" />
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
        <div className="hidden md:flex items-center gap-4">
          <Link href="/try-on">
            <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-black font-display font-bold text-xs tracking-wider">
              TRY-ON
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
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
      </div>
    </nav>
  );
}
