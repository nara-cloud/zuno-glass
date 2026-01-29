import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Zap, Shield, Eye, Activity, Target, Layers } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section - Manifesto */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/005.webp')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"></div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-black/50 backdrop-blur-sm px-4 py-2 mb-8 clip-corner">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="font-display text-primary text-sm tracking-widest">MANIFESTO ZUNO</span>
            </div>
            
            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-none text-white mb-10">
              NÃO SEGUIMOS <br/>
              <span className="text-transparent text-stroke-neon italic">A LUZ.</span> <br/>
              NÓS A <span className="text-primary">DOMINAMOS.</span>
            </h1>
            
            <p className="font-body text-xl text-gray-300 leading-relaxed mb-12 max-w-2xl mx-auto">
              A ZUNO nasceu de uma obsessão: eliminar a barreira entre o atleta e o ambiente. 
              Acreditamos que a visão é o sentido primário da velocidade. Se você não pode ver o limite, 
              você não pode quebrá-lo.
            </p>
          </div>
        </div>
      </section>

      {/* The Mission - Grid Layout */}
      <section className="py-20 bg-black/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-primary/30"></div>
              <img 
                src="/images/003.webp" 
                alt="Zuno Lab" 
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500 clip-corner"
              />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-primary/30"></div>
            </div>
            
            <div>
              <h2 className="font-display font-bold text-4xl text-white mb-6">
                ENGENHARIA DO <span className="text-primary">CAOS</span>
              </h2>
              <p className="font-body text-gray-400 mb-6 leading-relaxed">
                O mundo real é sujo, rápido e imprevisível. Nossos laboratórios não simulam apenas dias de sol; 
                simulamos tempestades de areia, reflexos cegantes de asfalto molhado e a escuridão súbita de túneis.
              </p>
              <p className="font-body text-gray-400 mb-8 leading-relaxed">
                Cada armação ZUNO é esculpida em Carbono Forjado ou TR-90 de grau aeroespacial. 
                Leveza não é luxo, é necessidade.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="font-display font-bold text-2xl text-white">40%</h3>
                  <p className="text-sm text-gray-500">MAIS LEVE QUE O PADRÃO</p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="font-display font-bold text-2xl text-white">0.02s</h3>
                  <p className="text-sm text-gray-500">TEMPO DE REAÇÃO DA LENTE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology - Cards */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-display font-bold text-5xl text-white mb-4">TECNOLOGIA <span className="text-stroke-neon">Z-CORE</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">O sistema proprietário que define cada par de óculos ZUNO.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Layers, 
                title: "LENTES Z-POLAR", 
                desc: "Polarização seletiva que filtra 99.9% do brilho horizontal sem apagar telas digitais ou painéis de instrumentos." 
              },
              { 
                icon: Shield, 
                title: "ESCUDO BALÍSTICO", 
                desc: "Policarbonato injetado testado contra impactos de alta velocidade. Proteção ANSI Z87.1+ como padrão." 
              },
              { 
                icon: Target, 
                title: "FOCO ADAPTATIVO", 
                desc: "Curvatura da lente otimizada para visão periférica sem distorção, essencial para ciclistas e corredores." 
              },
              { 
                icon: Activity, 
                title: "GRIP HIDROFÓBICO", 
                desc: "Hastes e plaquetas em Unobtainium que aumentam a aderência quando você transpira." 
              },
              { 
                icon: Zap, 
                title: "REAÇÃO FOTÔNICA", 
                desc: "Moléculas fotossensíveis que escurecem a lente instantaneamente sob UV e clareiam na sombra." 
              },
              { 
                icon: Eye, 
                title: "CONTRASTE AUMENTADO", 
                desc: "Filtros de cor específicos que destacam buracos, raízes e relevo no asfalto ou trilha." 
              }
            ].map((tech, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 hover:border-primary hover:bg-white/10 transition-all duration-300 group clip-corner">
                <div className="w-14 h-14 bg-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/20 group-hover:border-primary">
                  <tech.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-3">{tech.title}</h3>
                <p className="font-body text-gray-400 text-sm leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary text-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container relative z-10 text-center">
          <h2 className="font-display font-bold text-6xl md:text-8xl mb-8 tracking-tighter">
            JUNTE-SE AO <br/> MOVIMENTO
          </h2>
          <p className="font-body font-bold text-xl mb-10 max-w-2xl mx-auto">
            Não somos apenas uma marca de óculos. Somos uma comunidade de obcecados por performance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/products">
              <Button size="lg" className="bg-black text-white hover:bg-white hover:text-black border-2 border-black font-display font-bold text-lg px-12 h-16 clip-corner">
                COMPRAR AGORA
              </Button>
            </Link>
            <Link href="/pulse">
              <Button variant="outline" size="lg" className="bg-transparent text-black border-2 border-black hover:bg-black hover:text-white font-display font-bold text-lg px-12 h-16 clip-corner">
                ACESSAR ZUNO PULSE
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
