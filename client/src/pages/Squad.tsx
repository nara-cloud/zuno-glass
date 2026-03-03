import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Instagram, Trophy, Target, Zap, Crown, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SquadMember {
  id: number;
  name: string;
  category: "PERFORMANCE" | "LIFESTYLE";
  image: string;
  bio: string;
  instagram: string;
  instagramHandle: string;
  city?: string;
  activities: string[];
}

const performanceMembers: SquadMember[] = [
  {
    id: 1,
    name: "NARA FERRARI",
    category: "PERFORMANCE",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/CqbaZlrSJEggSwZA.jpg",
    bio: "Empreendedora e atleta de Petrolina. Engenheira e estrategista de marketing, está sempre em movimento transformando ideias em realidade.",
    instagram: "https://instagram.com/naraferrari",
    instagramHandle: "@naraferrari",
    city: "Petrolina, PE",
    activities: ["Engenharia", "Marketing", "Corrida"]
  },
  {
    id: 2,
    name: "LUIZA FERRARI",
    category: "PERFORMANCE",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/aKoficEVsIhaFDMc.jpg",
    bio: "Corredora apaixonada e empreendedora. Leva a performance ao limite em cada treino e prova, unindo esporte e negócios com a mesma intensidade.",
    instagram: "https://instagram.com/luiizaferrari",
    instagramHandle: "@luiizaferrari",
    city: "Belo Horizonte, MG",
    activities: ["Corrida de Rua", "Negócios", "Marketing"]
  },
  {
    id: 3,
    name: "EDUARDO RODRIGUES",
    category: "PERFORMANCE",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/kTNreAwWGuKuUDpO.jpg",
    bio: "Coach de Tênis e Beach Tênis de Petrolina. Inspira a todos com sua paixão pelo esporte e dedicação ao treinamento de atletas.",
    instagram: "https://instagram.com/tiodudu8",
    instagramHandle: "@tiodudu8",
    city: "Petrolina, PE",
    activities: ["Tênis", "Beach Tennis"]
  },
  {
    id: 4,
    name: "NATÁLIA LEITE",
    category: "PERFORMANCE",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/RnBXePBvYxqJrzHu.jpg",
    bio: "Corredora dedicada ao esporte e ao estilo de vida ativo. Leva a performance ao limite em cada treino.",
    instagram: "https://instagram.com/naty_leite",
    instagramHandle: "@naty_leite",
    activities: ["Corrida", "Fitness"]
  },
  {
    id: 5,
    name: "BEATRIZ CORDEIRO",
    category: "PERFORMANCE",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/XwARAvNWRVQqoLRW.jpg",
    bio: "Arquiteta e triatleta amadora de Petrolina. Vive com constância e propósito, unindo a paixão pelo esporte e pela arquitetura.",
    instagram: "https://instagram.com/beatrizcordeiro.arq",
    instagramHandle: "@beatrizcordeiro.arq",
    city: "Petrolina, PE",
    activities: ["Triatlo", "Arquitetura", "Corrida"]
  },
  {
    id: 6,
    name: "LUCAS CORLETT",
    category: "PERFORMANCE",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/SchKnUNzqOxmrSZq.jpg",
    bio: "Atleta de beach tennis e entusiasta de esportes. Promove um estilo de vida ativo e saudável com intensidade e dedicação.",
    instagram: "https://instagram.com/lucascorlett",
    instagramHandle: "@lucascorlett",
    activities: ["Beach Tennis", "Fitness"]
  },
  {
    id: 7,
    name: "LUANDA PASSOS",
    category: "PERFORMANCE",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/mVeEoxheraqPvYPR.jpg",
    bio: "Fisioterapeuta esportiva e maratonista. Doutoranda dedicada a ajudar atletas a alcançarem seu máximo potencial.",
    instagram: "https://instagram.com/luandapassosr",
    instagramHandle: "@luandapassosr",
    city: "Petrolina, PE",
    activities: ["Fisioterapia Esportiva", "Maratona", "CrossFit"]
  },
  {
    id: 9,
    name: "LEONNARDO ARAÚJO",
    category: "PERFORMANCE",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/leonnardo-araujo_594ba69b.jpeg",
    bio: "Arquiteto que vive intensamente. Ama viagens e promove um estilo de vida ativo e saudável com intensidade e dedicação.",
    instagram: "https://instagram.com/leonnardoaraujo",
    instagramHandle: "@leonnardoaraujo",
    city: "Salvador, BA",
    activities: ["Performance", "Lifestyle", "Vida Ativa & Inspiração"]
  },
  {
    id: 10,
    name: "BRUNO OLIUZA",
    category: "PERFORMANCE",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/bruno-oliuza_cdbc5dcd.jpeg",
    bio: "Advogado estratégico, construindo soluções sólidas e resultados consistentes para pessoas e empresas. Performance jurídica com visão de futuro.",
    instagram: "https://instagram.com/brunooliuza",
    instagramHandle: "@brunooliuza",
    city: "Petrolina, PE",
    activities: ["Estratégia & Estrutura", "Direito Empresarial", "Alta Performance"]
  },
  {
    id: 8,
    name: "BEATRIZ POSSIDIO",
    category: "PERFORMANCE",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663210798515/NenRJRDsdnS42xQATPd6GP/beatriz-possidio_cd35955c.jpeg",
    bio: "Corredora incansável e empreendedora de estética. Transforma treinos e resultados com a mesma dedicação com que eleva a beleza a outro nível.",
    instagram: "https://instagram.com/beatrizpossidio",
    instagramHandle: "@beatrizpossidio",
    city: "Petrolina, PE",
    activities: ["Performance", "Empreendedorismo", "Lifestyle & Disciplina"]
  },
];

function MemberCard({ member }: { member: SquadMember }) {
  return (
    <div className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-white/5 clip-corner mb-6">
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" 
        />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary tracking-widest text-xs">{member.category}</span>
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">{member.name}</h2>
          
          {member.city && (
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-body text-gray-400 text-xs">{member.city}</span>
            </div>
          )}

          <p className="font-body text-gray-300 text-sm leading-relaxed max-w-md mb-3">
            {member.bio}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {member.activities.map((activity, idx) => (
              <span key={idx} className="text-[10px] font-mono uppercase tracking-wider border border-white/20 px-2 py-0.5 text-gray-400">
                {activity}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <span className="text-xs font-mono border border-primary/30 px-3 py-1 text-primary">{member.category}</span>
        <a 
          href={member.instagram} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group/link"
        >
          <span className="text-xs font-body opacity-0 group-hover/link:opacity-100 transition-opacity">{member.instagramHandle}</span>
          <Instagram className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

export default function Squad() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black z-10"></div>
          <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/AAqJuzYIRTfbdrLS.jpeg" alt="Squad Hero" className="w-full h-full object-cover opacity-50 filter contrast-125" />
        </div>

        <div className="container relative z-20 text-center pt-36 pb-16">
          <div className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary tracking-widest text-sm">ELITE TEAM</span>
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 tracking-tighter leading-[1.1]">
            ZUNO <span className="bg-primary text-black px-3 md:px-4">SQUAD</span>
          </h1>
          <p className="font-body text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
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
            Atletas que testam nossos óculos nas condições mais exigentes.
          </p>
        </div>
      </section>

      {/* Performance Category */}
      <section className="py-16 container">
        <div className="flex items-center gap-4 mb-12">
          <Zap className="w-8 h-8 text-primary" />
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white">PERFORMANCE</h2>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>
        <p className="font-body text-gray-400 text-lg mb-12 max-w-2xl">
          Membros ligados ao esporte e treino. Atletas que testam nossos óculos nas condições mais exigentes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {performanceMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-32 container">
        <div className="bg-white/5 border border-white/10 p-12 md:p-20 text-center relative overflow-hidden clip-corner">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <Target className="w-16 h-16 text-primary mx-auto mb-8" />
          <h2 className="font-display font-bold text-3xl md:text-6xl mb-6">
            QUER FAZER PARTE?
          </h2>
          <p className="font-body text-gray-400 max-w-xl mx-auto mb-10 text-lg">
            Estamos sempre em busca de pessoas que compartilham nossa visão. 
            Se você vive o esporte com intensidade, queremos te conhecer.
          </p>
          <a href="mailto:contato@zunoglass.com?subject=Quero fazer parte do Squad ZUNO">
            <Button className="bg-white text-black hover:bg-primary font-display font-bold px-10 h-14 tracking-wider text-lg">
              APLICAR PARA O SQUAD
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
