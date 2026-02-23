import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Eye, Shield, Feather, Layers, FlaskConical, Bike } from 'lucide-react';

export default function Lab() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 filter grayscale contrast-125"></div>
        </div>

        <div className="container relative z-20 text-center pt-36 pb-16">
          <div className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <FlaskConical className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary tracking-widest text-sm">PESQUISA & DESENVOLVIMENTO</span>
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 tracking-tighter leading-[1.1]">
            ZUNO <span className="bg-primary text-black px-3 md:px-4">LAB</span>
          </h1>
          <p className="font-body text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Onde a performance encontra o design. Nossa divisão dedicada a desenvolver óculos que fazem diferença real no treino e na competição.
          </p>
        </div>
      </section>

      {/* Technology Grid */}
      <section className="py-20 container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tech 1: Lenses */}
          <div className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
              <Eye className="w-6 h-6 text-primary group-hover:text-black" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">CLAREZA ÓPTICA</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Lentes de alta definição com tratamento anti-reflexo e anti-risco. Visão nítida e sem distorções para que você foque apenas na performance.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 font-mono">
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> VISÃO HD SEM DISTORÇÃO</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> TRATAMENTO ANTI-REFLEXO</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> PROTEÇÃO UV400 TOTAL</li>
            </ul>
          </div>

          {/* Tech 2: Materials */}
          <div className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
              <Feather className="w-6 h-6 text-primary group-hover:text-black" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">LEVEZA ESTRUTURAL</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Armações em TR-90 e materiais de alta resistência que combinam durabilidade com peso mínimo. Conforto que você sente desde o primeiro uso.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 font-mono">
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> ULTRAEVE</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> FLEXÍVEL E RESISTENTE</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> HIPOALERGÊNICO</li>
            </ul>
          </div>

          {/* Tech 3: Ergonomics */}
          <div className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
              <Bike className="w-6 h-6 text-primary group-hover:text-black" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">VALIDAÇÃO REAL</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Cada modelo é testado em condições reais de uso: corrida, ciclismo e beach tennis. Prototipagem e validação ergonômica com atletas de verdade.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 font-mono">
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> TESTES EM CORRIDA</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> TESTES EM CICLISMO</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> TESTES EM BEACH TENNIS</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-square md:aspect-video bg-black border border-white/10 overflow-hidden group">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/BLDpyGWjjvJWflJW.png" 
                  alt="Tecnologia das lentes ZUNO" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                {/* Tech Overlay UI */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="bg-black/80 backdrop-blur border border-primary/30 px-3 py-1 text-xs font-mono text-primary">
                    UV400
                  </div>
                  <div className="bg-black/80 backdrop-blur border border-primary/30 px-3 py-1 text-xs font-mono text-primary">
                    ANTI-REFLEXO
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-primary tracking-widest text-sm">DESIGN COM PROPÓSITO</span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">
                CADA DETALHE <br/>
                TEM <span className="text-gray-500">FUNÇÃO</span>.
              </h2>
              <p className="font-body text-gray-400 text-lg leading-relaxed mb-8">
                Os óculos ZUNO são desenvolvidos com foco em ergonomia e performance real. 
                Cada protótipo passa por validação com atletas em treinos de corrida, ciclismo e beach tennis 
                antes de chegar ao produto final. Proteção UV400, leveza e estabilidade são os pilares de cada modelo.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-display font-bold text-white text-xl mb-2">UV400</h4>
                  <p className="text-sm text-gray-500">Proteção total contra raios UVA e UVB.</p>
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-xl mb-2">ANTI-RISCO</h4>
                  <p className="text-sm text-gray-500">Tratamento que prolonga a vida útil das lentes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future App Notice */}
      <section className="py-20 container">
        <div className="bg-white/5 border border-primary/30 p-10 text-center clip-corner">
          <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
          <h3 className="font-display font-bold text-2xl text-white mb-4">ECOSSISTEMA EM CONSTRUÇÃO</h3>
          <p className="font-body text-gray-400 max-w-2xl mx-auto leading-relaxed">
            O monitoramento e recursos digitais estarão disponíveis futuramente através do aplicativo Zuno, em desenvolvimento. 
            Fique atento às novidades e entre na lista de espera.
          </p>
          <Link href="/app">
            <button className="mt-6 bg-primary text-black hover:bg-white font-display font-bold px-8 py-3 clip-corner tracking-wider transition-colors">
              LISTA DE ESPERA DO APP
            </button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 container text-center">
        <Shield className="w-16 h-16 text-primary mx-auto mb-8" />
        <h2 className="font-display font-bold text-3xl md:text-6xl mb-6">
          PERFORMANCE <span className="text-primary">REAL</span>
        </h2>
        <p className="font-body text-gray-400 max-w-xl mx-auto mb-10">
          Sem exageros. Sem promessas vazias. Apenas óculos projetados para quem leva o esporte a sério.
        </p>
        <Link href="/products">
          <button className="bg-white text-black hover:bg-primary font-display font-bold px-10 py-4 clip-corner tracking-wider text-lg transition-colors">
            VER COLEÇÃO
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
