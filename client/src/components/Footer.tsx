import { Link } from 'wouter';
import { Instagram, Twitter, Facebook, Youtube, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
              <div className="w-8 h-8 bg-primary clip-corner flex items-center justify-center">
                <span className="font-display font-bold text-black">Z</span>
              </div>
              <span className="font-display font-bold text-3xl text-white tracking-wider">ZUNO</span>
            </div>
            <p className="font-body text-gray-400 max-w-xs text-lg leading-relaxed">
              PARA QUEM VIVE NO LIMITE DA LUZ.
              Performance ótica avançada para atletas que desafiam o impossível.
            </p>
            <div className="flex gap-4 mt-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:text-black hover:border-primary transition-all clip-corner">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-white text-lg mb-6">SHOP</h4>
            <ul className="flex flex-col gap-4">
              {['Lançamentos', 'Performance', 'Lifestyle', 'Tech', 'Acessórios'].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-white text-lg mb-6">SUPORTE</h4>
            <ul className="flex flex-col gap-4">
              {['FAQ', 'Envio e Devoluções', 'Garantia', 'Guia de Tamanhos', 'Contato'].map((item) => (
                <li key={item}>
                  <Link href={item === 'FAQ' ? '/faq' : '#'} className="font-body text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4">
            <h4 className="font-display font-bold text-white text-lg mb-6">FIQUE NO LOOP</h4>
            <p className="font-body text-gray-400 mb-6">
              Receba atualizações sobre lançamentos exclusivos e tecnologia ótica.
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
          <div className="flex gap-8">
            <a href="#" className="font-body text-gray-600 text-sm hover:text-white transition-colors">PRIVACIDADE</a>
            <a href="#" className="font-body text-gray-600 text-sm hover:text-white transition-colors">TERMOS</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
