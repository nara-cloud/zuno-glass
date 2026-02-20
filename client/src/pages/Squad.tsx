import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Instagram, Trophy, Target, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const performanceMembers = [
  {
    id: 1,
    name: "MEMBRO 1",
    category: "PERFORMANCE",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/QtcCXfLHxIsmKmbd.png",
    bio: "Atleta de corrida. Leva o treino ao limite todos os dias.",
    instagram: "#"
  },
  {
    id: 2,
    name: "MEMBRO 2",
    category: "PERFORMANCE",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/qAwYpxOkXdUsEimU.png",
    bio: "Ciclista de estrada. Velocidade e resistência como estilo de vida.",
    instagram: "#"
  },
];

const classicoMembers = [
  {
    id: 3,
    name: "MEMBRO 3",
    category: "CLÁSSICO",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/ZprAYfUVQCGmhqRu.png",
    bio: "Estilo e postura. A atitude fala mais alto que qualquer troféu.",
    instagram: "#"
  },
  {
    id: 4,
    name: "MEMBRO 4",
    category: "CLÁSSICO",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/OUTBhbLkSAqYGkGd.png",
    bio: "Lifestyle urbano. Onde o esporte encontra a moda de rua.",
    instagram: "#"
  }
];

export default function Squad() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black z-10"></div>
          <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/AAqJuzYIRTfbdrLS.jpeg" alt="Squad Hero" className="w-full h-full object-cover opacity-50 filter contrast-125" />
        </div>

        <div className="container relative z-20 text-center">
          <div className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary tracking-widest text-sm">ELITE TEAM</span>
          </div>

          <h1 className="font-display font-bold text-6xl md:text-9xl mb-6 tracking-tighter">
            ZUNO <span className="bg-primary text-black px-4">SQUAD</span>
          </h1>
          <p className="font-body text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Não patrocinamos apenas atletas. Patrocinamos obsessões. Conheça quem leva a nossa marca ao limite.
          </p>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-16 container text-center">
        <div className="max-w-3xl mx-auto border-l-4 border-primary pl-8 text-left">
          <p className="font-display font-bold text-3xl md:text-4xl text-white leading-snug italic">
            "Performance não é título. <br/>É <span className="text-primary">postura</span>."
          </p>
          <p className="font-body text-gray-400 mt-6 text-lg leading-relaxed">
            O Squad ZUNO é formado por pessoas que vivem o esporte e o estilo com a mesma intensidade. 
            Dividimos em duas categorias: quem compete e quem inspira.
          </p>
        </div>
      </section>

      {/* Performance Category */}
      <section className="py-16 container">
        <div className="flex items-center gap-4 mb-12">
          <Zap className="w-8 h-8 text-primary" />
          <h2 className="font-display font-bold text-4xl text-white">PERFORMANCE</h2>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>
        <p className="font-body text-gray-400 text-lg mb-12 max-w-2xl">
          Membros ligados ao esporte e treino. Atletas que testam nossos óculos nas condições mais exigentes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {performanceMembers.map((member) => (
            <div key={member.id} className="group relative">
              <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-white/5 clip-corner mb-6">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" 
                />
                
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-display font-bold text-primary tracking-widest text-sm">{member.category}</span>
                  </div>
                  <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">{member.name}</h2>
                  <p className="font-body text-gray-300 text-sm leading-relaxed max-w-md">
                    {member.bio}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-mono border border-primary/30 px-3 py-1 text-primary">{member.category}</span>
                <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clássico Category */}
      <section className="py-16 container">
        <div className="flex items-center gap-4 mb-12">
          <Crown className="w-8 h-8 text-primary" />
          <h2 className="font-display font-bold text-4xl text-white">CLÁSSICO</h2>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>
        <p className="font-body text-gray-400 text-lg mb-12 max-w-2xl">
          Membros ligados a estilo, postura e lifestyle. Onde a atitude encontra o design.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {classicoMembers.map((member) => (
            <div key={member.id} className="group relative">
              <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-white/5 clip-corner mb-6">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" 
                />
                
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-primary" />
                    <span className="font-display font-bold text-primary tracking-widest text-sm">{member.category}</span>
                  </div>
                  <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">{member.name}</h2>
                  <p className="font-body text-gray-300 text-sm leading-relaxed max-w-md">
                    {member.bio}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-mono border border-primary/30 px-3 py-1 text-primary">{member.category}</span>
                <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
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
            QUER FAZER PARTE?
          </h2>
          <p className="font-body text-gray-400 max-w-xl mx-auto mb-10 text-lg">
            Estamos sempre em busca de pessoas que compartilham nossa visão. 
            Se você vive o esporte ou o estilo com intensidade, queremos te conhecer.
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
