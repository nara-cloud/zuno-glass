import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Instagram, Twitter, Trophy, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Squad() {
  const athletes = [
    {
      id: 1,
      name: "ALEXIA STORM",
      sport: "URBAN RUNNING",
      image: "/images/uploads/ZUNO-FEEDOUTUBRO.zip-19(1).png",
      bio: "Recordista sul-americana de 10km de rua. Conhecida por treinar nas madrugadas de São Paulo.",
      achievements: ["10k Record Holder", "Night Run Champion"],
      social: "@alexiastorm"
    },
    {
      id: 2,
      name: "KAI ZEN",
      sport: "PARKOUR / FREERUNNING",
      image: "/images/uploads/ZUNO-FEEDOUTUBRO.zip-22(1).png",
      bio: "Desafia a gravidade nos arranha-céus de Tóquio. Onde você vê um muro, ele vê um caminho.",
      achievements: ["Red Bull Art of Motion Finalist", "Urban Flow Master"],
      social: "@kaizen_flow"
    },
    {
      id: 3,
      name: "LUNA V",
      sport: "TRIATHLON",
      image: "/images/uploads/ZUNO-FEEDOUTUBRO.zip-24(1).png",
      bio: "Ironman finisher. Especialista em resistência mental e performance sob pressão extrema.",
      achievements: ["Ironman World Championship", "Endurance Elite"],
      social: "@luna_tri"
    },
    {
      id: 4,
      name: "JAX 'GHOST'",
      sport: "CYCLING",
      image: "/images/uploads/ZUNO-FEEDOUTUBRO.zip-12(1).png",
      bio: "Velocista de critério. Domina as curvas fechadas e sprints finais com precisão cirúrgica.",
      achievements: ["Crit King 2025", "Sprint Specialist"],
      social: "@jax_ghost"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black z-10"></div>
          <img src="/images/uploads/IMG_0253(1).jpeg" alt="Squad Hero" className="w-full h-full object-cover opacity-50 filter grayscale contrast-125" />
        </div>

        <div className="container relative z-20 text-center">
          <div className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary tracking-widest text-sm">ELITE TEAM</span>
          </div>

          <h1 className="font-display font-bold text-6xl md:text-9xl mb-6 tracking-tighter">
            ZUNO <span className="text-transparent text-stroke-white">SQUAD</span>
          </h1>
          <p className="font-body text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Não patrocinamos apenas atletas. Patrocinamos obsessões. Conheça quem leva a nossa tecnologia ao limite.
          </p>
        </div>
      </section>

      {/* Athletes Grid */}
      <section className="py-20 container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {athletes.map((athlete, index) => (
            <div key={athlete.id} className={`group relative ${index % 2 !== 0 ? 'md:mt-20' : ''}`}>
              {/* Image Card */}
              <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-white/5 clip-corner mb-6">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <img 
                  src={athlete.image} 
                  alt={athlete.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" 
                />
                
                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-display font-bold text-primary tracking-widest text-sm">{athlete.sport}</span>
                  </div>
                  <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">{athlete.name}</h2>
                  <p className="font-body text-gray-300 text-sm leading-relaxed max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {athlete.bio}
                  </p>
                </div>
              </div>

              {/* External Info */}
              <div className="flex justify-between items-start px-2">
                <div className="flex gap-2">
                  {athlete.achievements.map((achievement, i) => (
                    <span key={i} className="text-xs font-mono border border-white/20 px-2 py-1 text-gray-400">
                      {achievement}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-32 container">
        <div className="bg-white/5 border border-white/10 p-12 md:p-20 text-center relative overflow-hidden clip-corner">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <Target className="w-16 h-16 text-primary mx-auto mb-8" />
          <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">
            VOCÊ TEM O QUE É <br/> NECESSÁRIO?
          </h2>
          <p className="font-body text-gray-400 max-w-xl mx-auto mb-10 text-lg">
            Estamos sempre em busca de novos talentos que compartilham nossa visão de futuro. 
            Se você vive no limite, queremos te conhecer.
          </p>
          <Button className="bg-white text-black hover:bg-primary font-display font-bold px-10 h-14 tracking-wider text-lg">
            APLICAR PARA O SQUAD
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
