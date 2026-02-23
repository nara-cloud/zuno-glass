import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Smartphone, Activity, Trophy, Users, BarChart3, Bell, Zap } from 'lucide-react';

const futureFeatures = [
  {
    icon: Activity,
    title: "REGISTRO DE TREINOS",
    description: "Registre corridas, pedaladas e sessões de beach tennis com dados detalhados de cada atividade."
  },
  {
    icon: Trophy,
    title: "DESAFIOS INTERNOS",
    description: "Participe de desafios mensais da comunidade e ganhe reconhecimento pelos seus resultados."
  },
  {
    icon: BarChart3,
    title: "RANKING DA COMUNIDADE",
    description: "Acompanhe sua posição no ranking e veja como você se compara com outros membros ZUNO."
  },
  {
    icon: Users,
    title: "INTEGRAÇÃO COM DISPOSITIVOS",
    description: "Conecte com dispositivos compatíveis para importar dados de treino automaticamente."
  },
  {
    icon: Bell,
    title: "NOTIFICAÇÕES DE EVENTOS",
    description: "Receba alertas sobre corridas coletivas, lançamentos e eventos exclusivos da comunidade."
  },
  {
    icon: Zap,
    title: "PERFIL DO ATLETA",
    description: "Crie seu perfil, compartilhe conquistas e conecte-se com outros membros da comunidade ZUNO."
  }
];

export default function ZunoApp() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(163,230,53,0.1),transparent_70%)]"></div>
        </div>

        <div className="container relative z-20 text-center pt-36 pb-16">
          <div className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary tracking-widest text-sm">EM DESENVOLVIMENTO</span>
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 tracking-tighter leading-[1.1]">
            ZUNO <span className="bg-primary text-black px-3 md:px-4">APP</span>
          </h1>
          <p className="font-body text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-4">
            O App Zuno está em desenvolvimento. Uma plataforma dedicada para conectar a comunidade, 
            registrar treinos e participar de desafios exclusivos.
          </p>
          <p className="font-body text-gray-500 text-sm max-w-lg mx-auto mb-12">
            Estamos trabalhando para entregar a melhor experiência possível. Entre na lista de espera 
            para ser um dos primeiros a testar.
          </p>

          <Button className="bg-primary text-black hover:bg-white font-display font-bold px-10 h-14 tracking-wider text-lg clip-corner">
            ENTRAR NA LISTA DE ESPERA
          </Button>
        </div>
      </section>

      {/* Phone Mockup Section */}
      <section className="py-20 container">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-64 h-[500px] bg-black border-4 border-gray-800 rounded-[3rem] shadow-2xl shadow-primary/20 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
              
              {/* App Preview UI */}
              <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black p-6 pt-10 flex flex-col">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-white text-lg">ZUNO APP</h3>
                  <p className="text-gray-500 text-xs mt-1">EM DESENVOLVIMENTO</p>
                </div>
                
                <div className="space-y-3 flex-1">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-white text-xs font-bold">Treinos</p>
                      <p className="text-gray-500 text-[10px]">Registre suas atividades</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-white text-xs font-bold">Desafios</p>
                      <p className="text-gray-500 text-[10px]">Participe e evolua</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-white text-xs font-bold">Ranking</p>
                      <p className="text-gray-500 text-[10px]">Compare sua evolução</p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center">
                  <p className="text-primary text-xs font-display font-bold">LISTA DE ESPERA ABERTA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-6 text-white">
              FUNCIONALIDADES <span className="text-primary">FUTURAS</span>
            </h2>
            <p className="font-body text-gray-400 text-lg leading-relaxed mb-10">
              O app está sendo desenvolvido com foco na experiência da comunidade ZUNO. 
              Estas são as funcionalidades planejadas para as primeiras versões:
            </p>

            <div className="space-y-6">
              {futureFeatures.slice(0, 4).map((feature, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 transition-colors">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Features Grid */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="container">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-center mb-12 text-white">
            O QUE ESTÁ <span className="text-primary">POR VIR</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {futureFeatures.map((feature, i) => (
              <div key={i} className="bg-black border border-white/10 p-8 hover:border-primary/50 transition-colors group clip-corner">
                <feature.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-xl mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 container">
        <div className="bg-white/5 border border-white/10 p-8 text-center">
          <p className="font-body text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto">
            O App Zuno está em fase de desenvolvimento. As funcionalidades apresentadas são planejadas e podem sofrer alterações. 
            Não há data confirmada de lançamento. Ao entrar na lista de espera, você será notificado quando o app estiver disponível para testes.
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 container text-center">
        <Smartphone className="w-16 h-16 text-primary mx-auto mb-8" />
        <h2 className="font-display font-bold text-3xl md:text-6xl mb-6">
          SEJA O <span className="text-primary">PRIMEIRO</span>
        </h2>
        <p className="font-body text-gray-400 max-w-xl mx-auto mb-10 text-lg">
          Entre na lista de espera e seja um dos primeiros a experimentar o App Zuno quando estiver disponível.
        </p>
        <Button className="bg-primary text-black hover:bg-white font-display font-bold px-10 h-14 tracking-wider text-lg clip-corner">
          ENTRAR NA LISTA DE ESPERA
        </Button>
      </section>

      <Footer />
    </div>
  );
}
