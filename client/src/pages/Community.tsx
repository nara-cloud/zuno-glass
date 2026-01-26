import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Play, Calendar, User, ArrowRight, Instagram, MapPin } from 'lucide-react';

export default function Community() {
  const [email, setEmail] = useState('');

  const trainingPlans = [
    {
      title: "MARATONA SUB-3H",
      level: "AVANÇADO",
      duration: "16 SEMANAS",
      author: "Coach Alex Silva",
      image: "/images/001.webp"
    },
    {
      title: "COUCH TO 5K",
      level: "INICIANTE",
      duration: "8 SEMANAS",
      author: "Zuno Team",
      image: "/images/004.webp"
    },
    {
      title: "IRONMAN 70.3 PREP",
      level: "ELITE",
      duration: "24 SEMANAS",
      author: "Triathlon Pro",
      image: "/images/006.webp"
    }
  ];

  const partners = [
    {
      name: "Dr. Marcos Vinicius",
      role: "Fisioterapeuta Esportivo",
      location: "São Paulo, SP",
      specialty: "Recovery & Prevenção",
      image: "/images/008.webp"
    },
    {
      name: "Nutri. Carla Dias",
      role: "Nutricionista Funcional",
      location: "Rio de Janeiro, RJ",
      specialty: "Performance em Endurance",
      image: "/images/009.webp"
    },
    {
      name: "Studio Velocity",
      role: "Centro de Treinamento",
      location: "Curitiba, PR",
      specialty: "Ciclismo Indoor",
      image: "/images/002.webp"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 container">
        <div className="text-center mb-16">
          <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-6">
            ZUNO <span className="text-primary italic">SQUAD</span>
          </h1>
          <p className="font-body text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Mais que uma marca, um movimento. Conecte-se com atletas, acesse treinos exclusivos e eleve sua performance ao próximo nível.
          </p>
        </div>

        <Tabs defaultValue="training" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 p-1 mb-12">
            <TabsTrigger value="training" className="font-display font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-black">TREINOS</TabsTrigger>
            <TabsTrigger value="tips" className="font-display font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-black">DICAS & BLOG</TabsTrigger>
            <TabsTrigger value="partners" className="font-display font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-black">PARCEIROS</TabsTrigger>
          </TabsList>

          {/* Training Content */}
          <TabsContent value="training" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trainingPlans.map((plan, i) => (
                <div key={i} className="bg-card border border-white/10 hover:border-primary/50 transition-all group overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                    <img src={plan.image} alt={plan.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="bg-primary text-black text-xs font-bold px-2 py-1 mb-2 inline-block">{plan.level}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-2xl text-white mb-2">{plan.title}</h3>
                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {plan.duration}</span>
                      <span className="flex items-center gap-1"><User className="w-4 h-4" /> {plan.author}</span>
                    </div>
                    <Button className="w-full bg-white/5 hover:bg-primary hover:text-black text-white border border-white/10 font-display tracking-wider group-hover:border-primary">
                      BAIXAR PLANILHA <Download className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-primary/10 border border-primary/30 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 clip-corner">
              <div>
                <h3 className="font-display font-bold text-3xl text-white mb-2">QUER UM TREINO PERSONALIZADO?</h3>
                <p className="font-body text-gray-400">Nossos treinadores parceiros podem criar uma rotina específica para seus objetivos.</p>
              </div>
              <Button className="bg-primary text-black hover:bg-white font-display font-bold px-8 py-6 whitespace-nowrap">
                FALAR COM UM COACH
              </Button>
            </div>
          </TabsContent>

          {/* Tips Content */}
          <TabsContent value="tips" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-white/10 p-8 hover:border-primary/30 transition-colors">
                <span className="text-primary font-display text-sm tracking-widest mb-4 block">NUTRIÇÃO</span>
                <h3 className="font-display font-bold text-3xl text-white mb-4">O QUE COMER ANTES DE UM LONGO?</h3>
                <p className="font-body text-gray-400 mb-6 leading-relaxed">
                  Carboidratos complexos ou simples? Gordura é inimiga ou aliada? Descubra a estratégia nutricional perfeita para treinos acima de 2 horas.
                </p>
                <a href="#" className="inline-flex items-center text-white hover:text-primary font-display font-bold tracking-wider">
                  LER ARTIGO COMPLETO <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
              <div className="bg-card border border-white/10 p-8 hover:border-primary/30 transition-colors">
                <span className="text-primary font-display text-sm tracking-widest mb-4 block">RECOVERY</span>
                <h3 className="font-display font-bold text-3xl text-white mb-4">A CIÊNCIA DO SONO NA PERFORMANCE</h3>
                <p className="font-body text-gray-400 mb-6 leading-relaxed">
                  Por que 8 horas podem não ser suficientes. Entenda os ciclos de sono e como eles afetam sua regeneração muscular e foco mental.
                </p>
                <a href="#" className="inline-flex items-center text-white hover:text-primary font-display font-bold tracking-wider">
                  LER ARTIGO COMPLETO <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-start p-4 border border-transparent hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 bg-white/5 flex items-center justify-center flex-shrink-0 text-primary">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white text-lg mb-1">DICA RÁPIDA #{i}</h4>
                    <p className="font-body text-gray-500 text-sm">Como ajustar seus óculos ZUNO para evitar pontos de pressão durante corridas longas.</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Partners Content */}
          <TabsContent value="partners">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {partners.map((partner, i) => (
                <div key={i} className="bg-card border border-white/10 text-center p-8 hover:border-primary/50 transition-all group">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary transition-colors">
                    <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-1">{partner.name}</h3>
                  <p className="font-display text-primary text-sm tracking-wider mb-4">{partner.role}</p>
                  
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-6">
                    <MapPin className="w-4 h-4" /> {partner.location}
                  </div>
                  
                  <div className="bg-white/5 p-3 mb-6">
                    <p className="font-body text-xs text-gray-300">Especialidade: {partner.specialty}</p>
                  </div>
                  
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white hover:text-black font-display text-xs tracking-wider">
                    VER PERFIL
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary text-black">
        <div className="container max-w-4xl text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">NÃO PERCA O RITMO</h2>
          <p className="font-body text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-80">
            Junte-se a mais de 10.000 atletas. Receba treinos semanais, convites para eventos e acesso antecipado a lançamentos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input 
              placeholder="SEU MELHOR EMAIL" 
              className="bg-black/10 border-black/20 text-black placeholder:text-black/50 font-display h-14 text-lg focus:border-black focus:ring-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="bg-black text-white hover:bg-white hover:text-black h-14 px-8 font-display font-bold tracking-wider">
              INSCREVER-SE
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
