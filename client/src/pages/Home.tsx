import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye, Shield, Feather } from 'lucide-react';
import LeadCapturePopup from '@/components/LeadCapturePopup';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    document.title = 'ZUNO GLASS | Óculos Esportivos de Alta Performance';
  }, []);

  useEffect(() => {
    fetch('/api/catalog')
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        // Show 6 featured products (mix of performance and lifestyle)
        setFeaturedProducts(arr.slice(0, 6));
      })
      .catch(() => setFeaturedProducts([]));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <LeadCapturePopup />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden bg-background">
        {/* Dark background base */}
        <div className="absolute inset-0 z-0 bg-background"></div>

        {/* Athlete image - positioned on the RIGHT side */}
        <div ref={heroRef} className="absolute right-0 top-0 w-full md:w-[60%] h-full z-[1] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10"></div>
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/hero-athlete-running_bef4ff10.jpg" 
            alt="Atleta correndo com óculos ZUNO GLASS" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Hero Content - left side, below navbar */}
        <div className="container relative z-20 pt-28">
          <div className="max-w-3xl">
            <p className="font-display text-primary text-xl md:text-3xl tracking-[0.35em] uppercase mb-3 animate-in-up">PARA QUEM VIVE NO</p>
            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white mb-8 animate-in-up delay-100 whitespace-nowrap">
              LIMITE <span className="text-transparent text-stroke-neon italic">DA LUZ</span>
            </h1>
            
            <p className="font-body text-xl md:text-2xl text-gray-300 max-w-md mb-10 leading-relaxed border-l-2 border-primary pl-6 animate-in-up delay-200">
              Óculos de alta performance projetados para quem vive em movimento. 
              Proteção UV400, leveza extrema e design esportivo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 animate-in-up delay-300">
              <Link href="/products">
                <Button size="lg" className="bg-primary text-black hover:bg-white font-display font-bold text-lg px-10 h-14 clip-corner tracking-wider">
                  VER COLEÇÃO
                </Button>
              </Link>
              <div className="relative">
                <Button
                  variant="outline"
                  size="lg"
                  disabled
                  className="border-white/20 text-white/40 font-display font-bold text-lg px-10 h-14 clip-corner tracking-wider cursor-not-allowed opacity-50"
                >
                  TRY-ON VIRTUAL
                </Button>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-display font-bold px-2 py-0.5 tracking-widest whitespace-nowrap">
                  EM BREVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-display text-xs tracking-[0.3em] text-gray-500">SCROLL</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* Pricing Banner - replaces countdown */}
      <section className="py-20 bg-gradient-to-b from-black via-black to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="container relative z-10">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-4">
              COLEÇÃO <span className="text-primary">DISPONÍVEL</span>
            </h2>
            <p className="font-body text-gray-400 text-lg max-w-xl mx-auto mb-2">
              A coleção completa ZUNO GLASS já está disponível. Escolha o modelo ideal para o seu estilo.
            </p>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="bg-white/5 border border-white/10 p-6 md:p-8 clip-corner text-center max-w-xs">
              <span className="font-display text-sm text-gray-500 tracking-widest block mb-2">ESPORTIVOS A PARTIR DE</span>
              <span className="font-display font-bold text-3xl text-primary block">R$ 189,90</span>
              <span className="font-body text-xs text-gray-500 mt-1 block">ou 3x de R$ 63,30 sem juros</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 md:p-8 clip-corner text-center max-w-xs">
              <span className="font-display text-sm text-gray-500 tracking-widest block mb-2">CASUAIS A PARTIR DE</span>
              <span className="font-display font-bold text-3xl text-primary block">R$ 169,90</span>
              <span className="font-body text-xs text-gray-500 mt-1 block">ou 3x de R$ 56,63 sem juros</span>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/products">
              <Button size="lg" className="bg-primary text-black hover:bg-white font-display font-bold text-lg px-12 h-14 clip-corner tracking-wider">
                VER TODOS OS MODELOS <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-black relative">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "PROTEÇÃO UV400", desc: "Bloqueio total de raios UVA e UVB. Proteção real para os seus olhos durante treinos e competições." },
              { icon: Feather, title: "LEVEZA EXTREMA", desc: "Armações ultraleves que você esquece que está usando. Conforto absoluto em qualquer atividade." },
              { icon: Eye, title: "CLAREZA ÓPTICA", desc: "Lentes de alta definição com tratamento anti-reflexo para visão nítida em todas as condições." }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 p-10 border border-white/10 hover:border-primary/50 transition-colors group clip-corner">
                <feature.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-display font-bold text-2xl text-white mb-4">{feature.title}</h3>
                <p className="font-body text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white">DESTAQUES</h2>
              <p className="font-body text-gray-500 mt-2">Modelos da coleção ZUNO GLASS</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary font-display tracking-wider">
                VER TODOS <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Big Image Section */}
      <section className="h-[80vh] relative flex items-center overflow-hidden">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/ZRnyhYPsnkScXGDq.jpeg" 
          alt="Embalagem ZUNO GLASS" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container relative z-10 flex justify-end">
          <div className="max-w-2xl bg-black/80 backdrop-blur-md p-12 border-l-4 border-primary clip-corner-top-right">
            <h2 className="font-display font-bold text-5xl text-white mb-6">
              FEITO PARA <span className="text-primary italic">DURAR</span>
            </h2>
            <p className="font-body text-xl text-gray-300 mb-8 leading-relaxed">
              Design esportivo premium com materiais resistentes e acabamento impecável. 
              Cada detalhe pensado para quem exige o melhor.
            </p>
            <Link href="/products">
              <Button className="bg-white text-black hover:bg-primary font-display font-bold px-8 py-6 clip-corner">
                EXPLORAR MODELOS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-32 bg-black relative">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="font-display font-bold text-primary text-sm tracking-widest">COMUNIDADE</span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
                MAIS DO QUE <span className="text-primary">ÓCULOS</span>
              </h2>
              <p className="font-body text-gray-400 text-lg leading-relaxed mb-8">
                A ZUNO é uma comunidade de atletas que vivem o esporte com intensidade. 
                Desafios mensais, conexão real e evolução constante. Junte-se a nós.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/community">
                  <Button className="bg-primary text-black hover:bg-white font-display font-bold px-8 h-12 tracking-wider clip-corner">
                    CONHECER A COMUNIDADE
                  </Button>
                </Link>
                <Link href="/app">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black font-display font-bold px-8 h-12 tracking-wider">
                    CONHEÇA O APP
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-6 clip-corner">
                <div className="text-primary font-display font-bold text-lg mb-2">DESAFIOS</div>
                <p className="text-gray-500 text-sm">Desafios mensais de corrida, ciclismo e beach tennis</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 clip-corner">
                <div className="text-primary font-display font-bold text-lg mb-2">SQUAD</div>
                <p className="text-gray-500 text-sm">Embaixadores que lideram e inspiram a comunidade</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 clip-corner">
                <div className="text-primary font-display font-bold text-lg mb-2">RANKING</div>
                <p className="text-gray-500 text-sm">Acompanhe sua evolução e compare com outros atletas</p>
              </div>
              <div className="bg-white/5 border border-primary/30 p-6 clip-corner">
                <div className="text-primary font-display font-bold text-lg mb-2">APP</div>
                <p className="text-gray-500 text-sm">Conecte-se com a comunidade ZUNO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
