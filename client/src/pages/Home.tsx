import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Eye, Shield, Feather, CheckCircle2, RotateCcw, MessageCircle, Lock, Play, ChevronRight, Zap, Users, Trophy, Sparkles } from 'lucide-react';
import LeadCapturePopup from '@/components/LeadCapturePopup';
import { toast } from 'sonner';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [vipEmail, setVipEmail] = useState('');
  const [vipSubmitting, setVipSubmitting] = useState(false);
  const [vipDone, setVipDone] = useState(false);
  useEffect(() => {
    document.title = 'ZUNO GLASS | Óculos Esportivos de Alta Performance';
  }, []);

  useEffect(() => {
    fetch('/api/catalog')
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
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

  const handleVipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipEmail) return;
    setVipSubmitting(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: vipEmail, source: 'home-vip' }),
      });
      setVipDone(true);
      toast.success('Você está na lista VIP!', { description: 'Acesso antecipado e condição exclusiva garantidos.' });
    } catch {
      toast.error('Erro ao cadastrar', { description: 'Tente novamente.' });
    } finally {
      setVipSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <LeadCapturePopup />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-screen flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 bg-background"></div>
        <div ref={heroRef} className="absolute right-0 top-0 w-full md:w-[60%] h-full z-[1] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10"></div>
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/hero-athlete-running_bef4ff10.jpg" 
            alt="Atleta correndo com óculos ZUNO GLASS" 
            className="w-full h-full object-cover object-center"
          />
        </div>

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
                  GARANTIR O MEU <ArrowRight className="w-5 h-5 ml-2" />
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

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-display text-xs tracking-[0.3em] text-gray-500">SCROLL</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* ─── GARANTIA FORTE (bloco de confiança) ─────────────── */}
      <section className="py-12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.05)_10px,rgba(0,0,0,0.05)_20px)]"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: RotateCcw, title: "30 DIAS SEM RISCO", desc: "Teste e devolva se não amar" },
              { icon: CheckCircle2, title: "TROCA FÁCIL E RÁPIDA", desc: "Sem burocracia, sem complicação" },
              { icon: Lock, title: "COMPRA 100% SEGURA", desc: "Pagamento protegido via Mercado Pago" },
              { icon: MessageCircle, title: "SUPORTE VIA WHATSAPP", desc: "Atendimento direto e humano" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <item.icon className="w-8 h-8 text-black" />
                <span className="font-display font-bold text-black text-sm tracking-wider">{item.title}</span>
                <span className="font-body text-black/70 text-xs">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POR QUE ZUNO? (comparação implícita) ────────────── */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="container relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-primary text-sm tracking-widest">DIFERENCIAL</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
              POR QUE <span className="text-primary">ZUNO?</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-3xl mx-auto">
              <thead>
                <tr>
                  <th className="text-left font-display text-gray-500 text-sm tracking-widest pb-4 pr-8">ÓCULOS COMUM</th>
                  <th className="text-left font-display text-primary text-sm tracking-widest pb-4 px-8 border-l border-primary/30">ZUNO GLASS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["Escorrega com suor", "Estabilidade total em movimento"],
                  ["Lente comum sem tratamento", "Clareza óptica otimizada + UV400"],
                  ["Design genérico de prateleira", "Performance + Estilo esportivo"],
                  ["Produto sem comunidade", "Ecossistema Zuno: squad, desafios, app"],
                  ["Suporte inexistente", "Atendimento direto via WhatsApp"],
                  ["Garantia duvidosa", "3 meses + 30 dias de teste sem risco"],
                ].map(([bad, good], i) => (
                  <tr key={i}>
                    <td className="py-4 pr-8">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-[2px] bg-red-400 rounded"></div>
                        </div>
                        <span className="font-body text-gray-500 text-sm line-through">{bad}</span>
                      </div>
                    </td>
                    <td className="py-4 px-8 border-l border-primary/30">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="font-body text-white text-sm font-medium">{good}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" className="bg-primary text-black hover:bg-white font-display font-bold text-lg px-12 h-14 clip-corner tracking-wider">
                ENTRAR PARA O MOVIMENTO <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BLOCO INSTITUCIONAL HUMANO ───────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-black to-background relative overflow-hidden">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 rounded-full mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-primary text-sm tracking-widest">NOSSA ORIGEM</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
              DESENVOLVIDO POR QUEM<br />
              <span className="text-primary italic">VIVE EM MOVIMENTO</span>
            </h2>
            <p className="font-body text-gray-400 text-lg leading-relaxed mb-8">
              A ZUNO nasceu da frustração de atletas que não encontravam óculos que realmente 
              acompanhassem o ritmo do treino. Cada modelo foi testado em corridas reais, 
              treinos funcionais e competições — não em laboratório.
            </p>
            <p className="font-body text-gray-500 text-base leading-relaxed mb-10 border-l-2 border-primary/50 pl-6 text-left max-w-xl mx-auto">
              "Não queríamos mais um óculos bonito que escorrega na primeira volta. 
              Queríamos algo que desse orgulho de usar e que não saísse do lugar."
              <span className="block mt-3 text-primary font-display text-sm tracking-wider">— FUNDADORES ZUNO GLASS</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-primary text-black hover:bg-white font-display font-bold px-10 h-14 clip-corner tracking-wider">
                  CONHECER A COLEÇÃO
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white hover:text-black font-display font-bold px-10 h-14 tracking-wider">
                  VER A COMUNIDADE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────── */}
      <section className="py-24 bg-black relative">
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

      {/* ─── VÍDEO EM MOVIMENTO ───────────────────────────────── */}
      <section className="py-0 bg-black relative overflow-hidden">
        <div className="relative h-[60vh] overflow-hidden">
          <video
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/zuno-performance-video_ee338dea.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
            <p className="font-display font-bold text-white text-xl md:text-2xl tracking-widest drop-shadow-lg">PERFORMANCE EM MOVIMENTO</p>
          </div>
          {/* Corner accent */}
          <div className="absolute bottom-0 left-0 w-32 h-1 bg-primary"></div>
          <div className="absolute top-0 right-0 w-32 h-1 bg-primary"></div>
        </div>
      </section>

      {/* ─── PRODUTOS DESTAQUE ────────────────────────────────── */}
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
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" className="bg-primary text-black hover:bg-white font-display font-bold text-lg px-12 h-14 clip-corner tracking-wider">
                VER TODOS OS MODELOS <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BIG IMAGE ────────────────────────────────────────── */}
      <section className="h-[80vh] relative flex items-center overflow-hidden">
        <img 
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/IMG_2484_047aed5d.jpeg" 
          alt="Natália com óculos ZUNO GLASS em movimento" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50"></div>
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

      {/* ─── LISTA VIP AGRESSIVA ──────────────────────────────── */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 border border-primary bg-primary/10 px-4 py-2 rounded-full mb-8 animate-pulse">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span className="font-display font-bold text-primary text-sm tracking-widest">VAGAS LIMITADAS</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-4">
              ENTRE PARA O<br />
              <span className="text-primary">LANÇAMENTO OFICIAL</span>
            </h2>
            <p className="font-body text-gray-400 text-lg mb-4">
              Acesso antecipado + condição exclusiva para os primeiros da lista.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-display text-sm tracking-wider">10% DE DESCONTO NO LANÇAMENTO</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-display text-sm tracking-wider">FRETE GRÁTIS ESPECIAL</span>
              </div>
            </div>

            {vipDone ? (
              <div className="bg-primary/10 border border-primary p-8 clip-corner">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="font-display font-bold text-white text-xl tracking-wider">VOCÊ ESTÁ NA LISTA VIP!</p>
                <p className="font-body text-gray-400 mt-2">Avisaremos você em primeira mão com condição exclusiva.</p>
              </div>
            ) : (
              <form onSubmit={handleVipSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={vipEmail}
                  onChange={e => setVipEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-500 h-14 font-body"
                />
                <Button
                  type="submit"
                  disabled={vipSubmitting}
                  className="bg-primary text-black hover:bg-white font-display font-bold h-14 px-8 clip-corner tracking-wider whitespace-nowrap"
                >
                  {vipSubmitting ? 'ENTRANDO...' : 'GARANTIR VAGA'}
                </Button>
              </form>
            )}
            <p className="font-body text-gray-600 text-xs mt-4">Sem spam. Você pode sair quando quiser.</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      </section>

      {/* ─── COMUNIDADE ───────────────────────────────────────── */}
      <section className="py-32 bg-background relative">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Users className="w-4 h-4 text-primary" />
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
                    ENTRAR PARA O MOVIMENTO
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
              {[
                { icon: Trophy, title: "DESAFIOS", desc: "Desafios mensais de corrida, ciclismo e beach tennis" },
                { icon: Users, title: "SQUAD", desc: "Embaixadores que lideram e inspiram a comunidade" },
                { icon: ChevronRight, title: "RANKING", desc: "Acompanhe sua evolução e compare com outros atletas" },
                { icon: Zap, title: "APP", desc: "Conecte-se com a comunidade ZUNO" },
              ].map((item, i) => (
                <div key={i} className={`bg-white/5 border ${i === 3 ? 'border-primary/30' : 'border-white/10'} p-6 clip-corner hover:border-primary/50 transition-colors`}>
                  <item.icon className="w-6 h-6 text-primary mb-3" />
                  <div className="text-primary font-display font-bold text-lg mb-2">{item.title}</div>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
