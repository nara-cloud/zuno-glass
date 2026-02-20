import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Flame, Smartphone, ArrowRight, Target, Calendar } from 'lucide-react';

const challenges = [
  {
    title: "DESAFIO 5K",
    description: "Complete 5km em qualquer modalidade durante o mês. Corrida, caminhada ou ciclismo.",
    icon: Target,
    status: "EM BREVE"
  },
  {
    title: "CONSISTÊNCIA 21",
    description: "Treine 21 dias seguidos. Qualquer atividade conta. A consistência é o que separa.",
    icon: Flame,
    status: "EM BREVE"
  },
  {
    title: "SQUAD RUN",
    description: "Participe de uma corrida coletiva organizada pela comunidade ZUNO na sua cidade.",
    icon: Users,
    status: "EM BREVE"
  }
];

export default function Community() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black z-10"></div>
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/AAqJuzYIRTfbdrLS.jpeg" 
            alt="Comunidade ZUNO" 
            className="w-full h-full object-cover opacity-40 filter contrast-125" 
          />
        </div>

        <div className="container relative z-20 text-center">
          <div className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary tracking-widest text-sm">JUNTE-SE A NÓS</span>
          </div>

          <h1 className="font-display font-bold text-6xl md:text-9xl mb-6 tracking-tighter">
            ZUNO <span className="bg-primary text-black px-4">COMUNIDADE</span>
          </h1>
          <p className="font-body text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Evoluímos juntos. Uma comunidade de atletas e entusiastas que compartilham a mesma obsessão por performance e estilo.
          </p>
        </div>
      </section>

      {/* O que é a Comunidade */}
      <section className="py-20 container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-8 text-white">
            O QUE É A <span className="text-primary">COMUNIDADE ZUNO</span>?
          </h2>
          <p className="font-body text-gray-400 text-lg leading-relaxed mb-6">
            A Comunidade ZUNO é o ponto de encontro de quem vive o esporte com intensidade. 
            Aqui você encontra desafios mensais, conexão com outros atletas e acesso antecipado 
            a lançamentos e eventos exclusivos.
          </p>
          <p className="font-body text-gray-400 text-lg leading-relaxed">
            Não importa se você corre 5km ou uma maratona. Se pedala na cidade ou na estrada. 
            Se joga beach tennis aos fins de semana ou compete. O que importa é a atitude.
          </p>
        </div>
      </section>

      {/* Desafios Mensais */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="container">
          <div className="flex items-center gap-4 mb-12">
            <Calendar className="w-8 h-8 text-primary" />
            <h2 className="font-display font-bold text-4xl text-white">DESAFIOS MENSAIS</h2>
            <div className="flex-1 h-[1px] bg-white/10"></div>
          </div>
          <p className="font-body text-gray-400 text-lg mb-12 max-w-2xl">
            Desafios de corrida, consistência e esporte para manter a comunidade ativa e motivada. 
            Novos desafios todos os meses.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {challenges.map((challenge, i) => (
              <div key={i} className="bg-black border border-white/10 p-8 hover:border-primary/50 transition-colors group clip-corner">
                <div className="flex items-center justify-between mb-6">
                  <challenge.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-mono border border-primary/30 px-3 py-1 text-primary">{challenge.status}</span>
                </div>
                <h3 className="font-display font-bold text-2xl mb-4 text-white">{challenge.title}</h3>
                <p className="text-gray-400 leading-relaxed">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integração com Squad */}
      <section className="py-20 container">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <Trophy className="w-12 h-12 text-primary mb-6" />
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 text-white">
              DA COMUNIDADE <br/>AO <span className="text-primary">SQUAD</span>
            </h2>
            <p className="font-body text-gray-400 text-lg leading-relaxed mb-8">
              Os membros mais ativos e dedicados da comunidade podem ser convidados para o Squad ZUNO — 
              nosso time de embaixadores oficiais. Mostre sua dedicação, participe dos desafios e 
              você pode ser o próximo.
            </p>
            <Link href="/squad">
              <Button variant="outline" className="border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary font-display tracking-wider h-12">
                CONHECER O SQUAD <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white/5 border border-white/10 p-8 clip-corner">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-black/50 border border-white/10">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="font-display text-white">Participe dos desafios mensais</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-black/50 border border-white/10">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="font-display text-white">Compartilhe seus treinos</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-black/50 border border-white/10">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="font-display text-white">Conecte-se com outros atletas</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-primary/20 border border-primary/50">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-display text-primary font-bold">Seja convidado para o Squad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Waitlist */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="container text-center">
          <Smartphone className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 text-white">
            APP ZUNO <span className="text-gray-500">EM DESENVOLVIMENTO</span>
          </h2>
          <p className="font-body text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Em breve, a comunidade ZUNO terá um app dedicado para registro de treinos, 
            desafios internos, ranking e muito mais. Entre na lista de espera para ser 
            um dos primeiros a testar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button className="bg-primary text-black hover:bg-white font-display font-bold px-10 h-14 tracking-wider text-lg clip-corner">
                ENTRAR NA LISTA DO APP
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 container text-center">
        <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">
          PRONTO PARA <span className="text-primary">EVOLUIR</span>?
        </h2>
        <p className="font-body text-gray-400 max-w-xl mx-auto mb-10 text-lg">
          Junte-se à comunidade ZUNO e faça parte de algo maior. Esporte, estilo e atitude.
        </p>
        <Button className="bg-white text-black hover:bg-primary font-display font-bold px-10 h-14 tracking-wider text-lg">
          ENTRAR PARA COMUNIDADE
        </Button>
      </section>

      <Footer />
    </div>
  );
}
