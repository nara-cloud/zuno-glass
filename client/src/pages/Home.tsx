import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Wind, Eye } from 'lucide-react';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

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

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video with Parallax */}
        <div ref={heroRef} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10"></div>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="container relative z-20 pt-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-black/50 backdrop-blur-sm px-4 py-2 mb-6 clip-corner">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="font-display text-primary text-sm tracking-widest">NOVA COLEÇÃO 2026</span>
            </div>
            
            <h1 className="font-display font-bold text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-white mb-8 animate-in-up delay-100">
              LIMITE <br/>
              <span className="text-transparent text-stroke-neon italic pr-4">DA LUZ</span>
            </h1>
            
            <p className="font-body text-xl md:text-2xl text-gray-300 max-w-xl mb-10 leading-relaxed border-l-2 border-primary pl-6 animate-in-up delay-200">
              Óculos de alta performance projetados para quem vive em movimento constante. 
              Tecnologia ótica avançada para o atleta moderno.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 animate-in-up delay-300">
              <Link href="/products">
                <Button size="lg" className="bg-primary text-black hover:bg-white font-display font-bold text-lg px-10 h-14 clip-corner tracking-wider">
                  EXPLORAR COLEÇÃO
                </Button>
              </Link>
              <Link href="/try-on">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black font-display font-bold text-lg px-10 h-14 clip-corner tracking-wider">
                  TRY-ON VIRTUAL
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-display text-xs tracking-[0.3em] text-gray-500">SCROLL</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-black relative">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "VISÃO INSTANTÂNEA", desc: "Lentes fotocromáticas que reagem em milissegundos às mudanças de luz." },
              { icon: Wind, title: "AERODINÂMICA PURA", desc: "Design testado em túnel de vento para zero resistência e estabilidade total." },
              { icon: Eye, title: "CLAREZA HD", desc: "Polarização seletiva que elimina reflexos sem comprometer a leitura de telas." }
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
      <section className="py-32 bg-background relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-20 right-20 font-display font-bold text-[20rem] text-white/5 leading-none pointer-events-none select-none">
          ZUNO
        </div>

        <div className="container relative z-10">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="font-display font-bold text-5xl text-white mb-4">DESTAQUES</h2>
              <div className="h-1 w-20 bg-primary"></div>
            </div>
            <Link href="/products">
              <Button variant="link" className="text-white hover:text-primary font-display tracking-widest group">
                VER TODOS <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Big Image Section */}
      <section className="h-[80vh] relative flex items-center overflow-hidden">
        <img 
          src="/images/004.webp" 
          alt="Lifestyle" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container relative z-10 flex justify-end">
          <div className="max-w-2xl bg-black/80 backdrop-blur-md p-12 border-l-4 border-primary clip-corner-top-right">
            <h2 className="font-display font-bold text-5xl text-white mb-6">
              DOMINE O <span className="text-primary italic">CAOS</span>
            </h2>
            <p className="font-body text-xl text-gray-300 mb-8 leading-relaxed">
              A cidade é imprevisível. Seus óculos não deveriam ser. 
              A linha Urban Drift combina proteção de nível militar com estética streetwear.
            </p>
            <Button className="bg-white text-black hover:bg-primary font-display font-bold px-8 py-6 clip-corner">
              CONHEÇA A LINHA URBAN
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
