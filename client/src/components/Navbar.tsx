import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
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
    { name: 'ÓCULOS', path: '/products' },
    { name: 'PULSE', path: '/pulse' },
    { name: 'LAB', path: '/lab' },
    { name: 'PRO', path: '/pro' },
    { name: 'TRY-ON VIRTUAL', path: '/try-on' },
    { name: 'SOBRE', path: '/about' },
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
            <img src="/images/logo-zuno.png" alt="ZUNO GLASS" className="h-12 w-auto object-contain brightness-0 invert" />
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
          <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/5">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/5 relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
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
        <div className="flex gap-6 mt-8">
          <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary font-display tracking-wider">
            BUSCAR
          </Button>
          <Button variant="default" size="lg" className="bg-primary text-black hover:bg-white font-display tracking-wider font-bold">
            CARRINHO (0)
          </Button>
        </div>
      </div>
    </nav>
  );
}
