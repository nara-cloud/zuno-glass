import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wrench, Sparkles, Bell, ScanFace, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function TryOn() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success('Você será notificado quando o Try-On estiver disponível!');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-2xl w-full text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-2 mb-8">
            <Wrench className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="font-display text-primary text-xs tracking-widest">EM DESENVOLVIMENTO</span>
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-5xl md:text-7xl leading-[0.9] text-white mb-6">
            TRY-ON
            <br />
            <span className="text-transparent text-stroke-neon italic">VIRTUAL</span>
          </h1>

          {/* Description */}
          <p className="font-body text-lg text-gray-400 max-w-lg mx-auto mb-4 leading-relaxed">
            Estamos construindo uma experiência de experimentação virtual que vai mudar a forma como você escolhe seus óculos.
          </p>
          <p className="font-body text-base text-gray-500 max-w-md mx-auto mb-12 leading-relaxed">
            Em breve você poderá experimentar qualquer modelo da coleção ZUNO diretamente pelo seu celular — sem sair de casa.
          </p>

          {/* Features coming */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 text-left">
            {[
              { icon: ScanFace, title: 'IA em Tempo Real', desc: 'Sobreposição dos óculos no seu rosto via câmera' },
              { icon: Sparkles, title: 'Todos os Modelos', desc: 'Experimente toda a coleção sem sair de casa' },
              { icon: ShoppingBag, title: 'Compra Direta', desc: 'Do try-on para o carrinho em um clique' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-white/10 bg-white/5 p-4">
                <Icon className="w-5 h-5 text-primary mb-2" />
                <p className="font-display font-bold text-sm text-white tracking-wider mb-1">{title}</p>
                <p className="font-body text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Notify form */}
          {!submitted ? (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-600 font-body"
                required
              />
              <Button
                type="submit"
                className="bg-primary text-black hover:bg-white font-display font-bold tracking-wider whitespace-nowrap"
              >
                <Bell className="w-4 h-4 mr-2" />
                AVISAR-ME
              </Button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-6 py-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-display text-primary text-sm tracking-wider">Você está na lista! Avisaremos em breve.</span>
            </div>
          )}

          <p className="font-body text-xs text-gray-600 mt-4">
            Sem spam. Apenas um aviso quando estiver pronto.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
