import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Star, Crown, Zap, Shield } from 'lucide-react';

export default function Pro() {
  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "ACESSO ANTECIPADO",
      description: "Compre lançamentos do Zuno Lab 24h antes do público geral."
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "GARANTIA ESTENDIDA",
      description: "Cobertura total contra danos acidentais por 2 anos em qualquer óculos."
    },
    {
      icon: <Crown className="w-6 h-6 text-primary" />,
      title: "CONTEÚDO ELITE",
      description: "Planilhas de treino de atletas olímpicos e webinars exclusivos."
    },
    {
      icon: <Star className="w-6 h-6 text-primary" />,
      title: "DESCONTOS PROGRESSIVOS",
      description: "Até 30% OFF em toda a loja baseado no seu nível no Zuno Pulse."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 container text-center">
        <div className="inline-flex items-center gap-2 border border-yellow-500/50 bg-yellow-500/10 px-4 py-2 rounded-full mb-8">
          <Crown className="w-4 h-4 text-yellow-500" />
          <span className="font-display font-bold text-yellow-500 tracking-widest text-sm">MEMBERSHIP EXCLUSIVO</span>
        </div>
        
        <h1 className="font-display font-bold text-6xl md:text-8xl text-white mb-6">
          ZUNO <span className="text-primary italic">PRO</span>
        </h1>
        <p className="font-body text-gray-400 max-w-2xl mx-auto text-xl leading-relaxed mb-12">
          Junte-se à elite. Desbloqueie o potencial máximo da sua performance com benefícios que vão muito além dos óculos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-card border border-white/10 p-8 hover:border-primary/50 transition-all group text-left">
              <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                {benefit.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3">{benefit.title}</h3>
              <p className="font-body text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {/* Free Tier */}
          <div className="bg-card border border-white/10 p-8 opacity-80 hover:opacity-100 transition-opacity">
            <h3 className="font-display font-bold text-2xl text-white mb-2">MEMBER</h3>
            <div className="text-3xl font-bold text-gray-500 mb-6">GRÁTIS</div>
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-gray-500" /> Acesso ao Zuno Pulse</li>
              <li className="flex items-center gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-gray-500" /> Histórico de Try-On</li>
              <li className="flex items-center gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-gray-500" /> Newsletter Semanal</li>
            </ul>
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white hover:text-black font-display tracking-wider">
              CRIAR CONTA
            </Button>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="bg-black border-2 border-primary p-10 transform md:scale-110 relative shadow-2xl shadow-primary/20">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-4 py-1 font-display font-bold text-xs tracking-widest rounded-full">
              MAIS POPULAR
            </div>
            <h3 className="font-display font-bold text-3xl text-white mb-2">PRO</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-primary">R$ 29</span>
              <span className="text-gray-500">/mês</span>
            </div>
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center gap-3 text-white text-sm"><Check className="w-4 h-4 text-primary" /> Tudo do plano Member</li>
              <li className="flex items-center gap-3 text-white text-sm"><Check className="w-4 h-4 text-primary" /> Acesso Antecipado a Drops</li>
              <li className="flex items-center gap-3 text-white text-sm"><Check className="w-4 h-4 text-primary" /> Planilhas de Treino Elite</li>
              <li className="flex items-center gap-3 text-white text-sm"><Check className="w-4 h-4 text-primary" /> 15% OFF Permanente</li>
            </ul>
            <Button className="w-full bg-primary text-black hover:bg-white font-display font-bold h-12 tracking-wider">
              ASSINAR AGORA
            </Button>
          </div>

          {/* Team Tier */}
          <div className="bg-card border border-white/10 p-8 opacity-80 hover:opacity-100 transition-opacity">
            <h3 className="font-display font-bold text-2xl text-white mb-2">SQUAD</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-white">R$ 99</span>
              <span className="text-gray-500">/mês</span>
            </div>
            <p className="text-xs text-gray-500 mb-6 text-left">Para assessorias esportivas e grupos de corrida (até 10 pessoas).</p>
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-white" /> Benefícios PRO para todos</li>
              <li className="flex items-center gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-white" /> Personalização de Uniforme</li>
              <li className="flex items-center gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-white" /> Eventos Exclusivos</li>
            </ul>
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white hover:text-black font-display tracking-wider">
              FALAR COM VENDAS
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
