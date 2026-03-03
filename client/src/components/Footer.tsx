import { Link } from 'wouter';
import { Instagram, Facebook, ArrowRight, Lock, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/logo-zuno-transparent_e9130bfd.png';

// Custom TikTok icon (not available in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z"/>
    </svg>
  );
}

// Custom X (Twitter) icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

const socialLinks = [
  { Icon: Instagram, href: "https://www.instagram.com/zuno.glass/", label: "Instagram" },
  { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61581944526033", label: "Facebook" },
  { Icon: TikTokIcon, href: "https://www.tiktok.com/@zuno.glass", label: "TikTok" },
  { Icon: XIcon, href: "#", label: "X" },
];

function AdminFooterButton() {
  const { user, loading, isAuthenticated, hasRole } = useAuthContext();

  if (loading) return null;

  const hasAdminAccess = isAuthenticated && (hasRole('admin') || hasRole('ops'));

  if (hasAdminAccess) {
    return (
      <Link href="/admin">
        <button className="flex items-center gap-1.5 font-body text-gray-600 text-sm hover:text-primary transition-colors group">
          <LayoutDashboard className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
          <span>PAINEL ADMIN</span>
        </button>
      </Link>
    );
  }

  return (
    <Link href="/entrar">
      <span className="flex items-center gap-1.5 font-body text-gray-600 text-sm hover:text-primary transition-colors group cursor-pointer">
        <Lock className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
        <span>ACESSO RESTRITO</span>
      </span>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary blur-[150px]"></div>
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <img src={LOGO_URL} alt="ZUNO GLASS" className="h-20 w-auto object-contain" />
            </div>
            <p className="font-body text-gray-400 max-w-xs text-lg leading-relaxed">
              PARA QUEM VIVE NO LIMITE DA LUZ.
              Óculos esportivos de alta performance. Design, proteção UV400 e leveza para o seu esporte.
            </p>
            <div className="flex gap-4 mt-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <a 
                  key={label} 
                  href={href} 
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  title={label}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:text-black hover:border-primary transition-all clip-corner"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-white text-lg mb-6">EXPLORAR</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/products" className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">Coleção</Link></li>
              <li><Link href="/lab" className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">Lab</Link></li>
              <li><Link href="/squad" className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">Squad</Link></li>
              <li><Link href="/community" className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">Comunidade</Link></li>
              <li><Link href="/app" className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">App</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-white text-lg mb-6">SUPORTE</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/faq" className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">FAQ</Link></li>
              <li><Link href="/shipping" className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">Envio e Devoluções</Link></li>
              <li><Link href="/warranty" className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">Garantia</Link></li>
              <li><Link href="/size-guide" className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">Guia de Tamanhos</Link></li>
              <li><Link href="/contact" className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">Contato</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4">
            <h4 className="font-display font-bold text-white text-lg mb-6">FIQUE NO LOOP</h4>
            <p className="font-body text-gray-400 mb-6">
              Receba novidades sobre novos modelos, desafios e promoções exclusivas da comunidade ZUNO.
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="SEU EMAIL" 
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-display rounded-none h-12 focus:border-primary focus:ring-0"
              />
              <Button className="bg-primary text-black hover:bg-white font-bold rounded-none h-12 px-6">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-gray-600 text-sm">
            © 2026 ZUNO GLASS. TODOS OS DIREITOS RESERVADOS.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="font-body text-gray-600 text-sm hover:text-white transition-colors">PRIVACIDADE</a>
            <a href="#" className="font-body text-gray-600 text-sm hover:text-white transition-colors">TERMOS</a>
            <AdminFooterButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
