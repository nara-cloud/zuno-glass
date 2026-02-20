import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Feather, Sun, Wind, Zap, ArrowRight } from 'lucide-react';

const specs = [
  {
    icon: Eye,
    title: "CLAREZA ÓPTICA",
    description: "Lentes com alta definição para visão nítida em qualquer condição de luz. Sem distorção, sem compromisso.",
    stat: "HD"
  },
  {
    icon: Shield,
    title: "PROTEÇÃO UV400",
    description: "Bloqueio total de raios UVA e UVB. Proteção certificada para os seus olhos durante atividades ao ar livre.",
    stat: "UV400"
  },
  {
    icon: Feather,
    title: "LEVEZA ESTRUTURAL",
    description: "Design leve e ergonômico que não pesa durante horas de uso. Ideal para treinos longos e competições.",
    stat: "ULTRA-LEVE"
  },
  {
    icon: Sun,
    title: "ANTI-REFLEXO",
    description: "Tratamento anti-reflexo que reduz o brilho e melhora o conforto visual em condições de alta luminosidade.",
    stat: "AR"
  },
  {
    icon: Wind,
    title: "VENTILAÇÃO OTIMIZADA",
    description: "Sistema de ventilação que minimiza o embaçamento durante atividades intensas e mudanças de temperatura.",
    stat: "AIRFLOW"
  },
  {
    icon: Zap,
    title: "ESTABILIDADE",
    description: "Hastes com grip antiderrapante e design que mantém os óculos firmes durante movimentos intensos.",
    stat: "GRIP+"
  }
];

export default function Pro() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(163,230,53,0.08),transparent_60%)]"></div>
        </div>

        <div className="container relative z-20 text-center">
          <div className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary tracking-widest text-sm">PERFORMANCE REAL</span>
          </div>

          <h1 className="font-display font-bold text-6xl md:text-9xl mb-6 tracking-tighter">
            ZUNO <span className="bg-primary text-black px-4">PRO</span>
          </h1>
          <p className="font-body text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Tecnologia óptica projetada para quem exige o máximo dos seus óculos. 
            Sem exageros. Sem promessas vazias. Performance real, testada em campo.
          </p>
        </div>
      </section>

      {/* Specs Grid */}
      <section className="py-32 container">
        <div className="flex items-center gap-4 mb-16">
          <h2 className="font-display font-bold text-4xl text-white">ESPECIFICAÇÕES</h2>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specs.map((spec, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-all group clip-corner">
              <div className="flex items-start justify-between mb-6">
                <spec.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-mono text-primary text-sm border border-primary/30 px-3 py-1">{spec.stat}</span>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-white">{spec.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{spec.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tested in Real Conditions */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-8 text-white">
              TESTADO EM <span className="text-primary">CONDIÇÕES REAIS</span>
            </h2>
            <p className="font-body text-gray-400 text-lg leading-relaxed mb-12">
              Nossos óculos são testados por atletas reais em condições reais de uso. 
              Corrida sob sol intenso, ciclismo em estradas, beach tennis na praia. 
              Cada modelo passa por validação ergonômica e testes de campo antes de chegar até você.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-primary mb-2">CORRIDA</div>
                <p className="text-gray-500 text-sm">Estabilidade e leveza em longas distâncias</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-primary mb-2">CICLISMO</div>
                <p className="text-gray-500 text-sm">Proteção e clareza em alta velocidade</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-primary mb-2">BEACH</div>
                <p className="text-gray-500 text-sm">Resistência ao suor e areia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 container text-center">
        <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">
          PRONTO PARA <span className="text-primary">PERFORMANCE</span>?
        </h2>
        <p className="font-body text-gray-400 max-w-xl mx-auto mb-10 text-lg">
          Descubra a coleção completa de óculos ZUNO e encontre o modelo ideal para o seu esporte.
        </p>
        <Link href="/products">
          <Button className="bg-primary text-black hover:bg-white font-display font-bold px-10 h-14 tracking-wider text-lg clip-corner">
            VER COLEÇÃO <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
