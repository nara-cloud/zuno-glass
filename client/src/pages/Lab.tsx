import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Zap, Shield, Wind, Layers, Microscope, Cpu } from 'lucide-react';

export default function Lab() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black z-10"></div>
          {/* Abstract tech background */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 filter grayscale contrast-125"></div>
        </div>

        <div className="container relative z-20 text-center">
          <div className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Microscope className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary tracking-widest text-sm">PESQUISA & DESENVOLVIMENTO</span>
          </div>

          <h1 className="font-display font-bold text-6xl md:text-8xl mb-6 tracking-tighter">
            ZUNO <span className="text-transparent text-stroke-white">LAB</span>
          </h1>
          <p className="font-body text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Onde a física encontra o design. Nossa divisão dedicada a explorar os limites dos materiais e da ótica avançada.
          </p>
        </div>
      </section>

      {/* Technology Grid */}
      <section className="py-20 container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tech 1: Lenses */}
          <div className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
              <Zap className="w-6 h-6 text-primary group-hover:text-black" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">LENTES FOTÔNICAS</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Nossa tecnologia proprietária de lentes reage a fótons UV em 0.04 segundos, adaptando a transmissão de luz instantaneamente para qualquer ambiente.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 font-mono">
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> CLAREZA HD+</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> CONTRASTE ADAPTATIVO</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> PROTEÇÃO UV400 TOTAL</li>
            </ul>
          </div>

          {/* Tech 2: Materials */}
          <div className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
              <Layers className="w-6 h-6 text-primary group-hover:text-black" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">CARBONO FORJADO</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Estruturas feitas com compósito de fibra de carbono reciclada de grau aeroespacial. 40% mais leve que o titânio, 10x mais resistente que o aço.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 font-mono">
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> PESO PLUMA (18g)</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> MEMÓRIA DE FORMA</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> HIPOALERGÊNICO</li>
            </ul>
          </div>

          {/* Tech 3: Aerodynamics */}
          <div className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
              <Wind className="w-6 h-6 text-primary group-hover:text-black" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">AERO-FLOW™</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Canais de ventilação esculpidos digitalmente para eliminar o embaçamento e reduzir o arrasto do vento em altas velocidades.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 font-mono">
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> ZERO EMBAÇAMENTO</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> ESTABILIDADE EM SPRINT</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> REFRIGERAÇÃO ATIVA</li>
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
                  src="/images/uploads/ÓculosdeSol.zip-13(1).png" 
                  alt="Lens Technology" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                {/* Tech Overlay UI */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="bg-black/80 backdrop-blur border border-primary/30 px-3 py-1 text-xs font-mono text-primary">
                    VLT: 12-85%
                  </div>
                  <div className="bg-black/80 backdrop-blur border border-primary/30 px-3 py-1 text-xs font-mono text-primary">
                    ABBE: 45
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-primary tracking-widest text-sm">ENGENHARIA DE PRECISÃO</span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
                NÃO É APENAS PLÁSTICO. <br/>
                É <span className="text-gray-500">CIÊNCIA</span>.
              </h2>
              <p className="font-body text-gray-400 text-lg leading-relaxed mb-8">
                Cada par de óculos ZUNO passa por 400 horas de testes em túnel de vento e simulações de impacto balístico. 
                Utilizamos polímeros de nylon balístico injetados com precisão microscópica para garantir que sua visão 
                esteja protegida contra detritos, raios UV e impactos de alta velocidade.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-display font-bold text-white text-xl mb-2">ANSI Z87.1</h4>
                  <p className="text-sm text-gray-500">Certificação de impacto de alta massa e alta velocidade.</p>
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-xl mb-2">OLEOFÓBICO</h4>
                  <p className="text-sm text-gray-500">Revestimento que repele óleo, suor e impressões digitais.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 container text-center">
        <Shield className="w-16 h-16 text-primary mx-auto mb-8 animate-pulse" />
        <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">
          O FUTURO É <span className="text-primary">RESISTENTE</span>
        </h2>
        <p className="font-body text-gray-400 max-w-xl mx-auto mb-10">
          Inscreva-se para receber relatórios técnicos detalhados e acesso antecipado aos nossos novos materiais experimentais.
        </p>
      </section>

      <Footer />
    </div>
  );
}
