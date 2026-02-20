import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Activity, Trophy, Flame, Smartphone } from 'lucide-react';

export default function Pulse() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/80 to-black z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 filter grayscale contrast-125"></div>
        </div>

        <div className="container relative z-20 text-center">
          <div className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary tracking-widest text-sm">ECOSSISTEMA EM CONSTRUÇÃO</span>
          </div>

          <h1 className="font-display font-bold text-6xl md:text-9xl mb-6 tracking-tighter">
            ZUNO <span className="text-transparent text-stroke-white">PULSE</span>
          </h1>
          <p className="font-body text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            O futuro da comunidade ZUNO. Um ecossistema digital com desafios, ranking e gamificação 
            para quem leva o esporte a sério. Em desenvolvimento.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Button className="bg-primary text-black hover:bg-white h-14 px-10 font-display font-bold tracking-wider text-lg clip-corner">
              ENTRAR NA LISTA DE ESPERA
            </Button>
          </div>
          <p className="mt-6 text-xs text-gray-500 font-display tracking-widest">EM DESENVOLVIMENTO</p>
        </div>
      </section>

      {/* Features Preview Grid */}
      <section className="py-32 container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <Trophy className="w-16 h-16 text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4 text-white">RANKING COMUNITÁRIO</h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              Participe de desafios mensais e acompanhe sua posição no ranking da comunidade ZUNO. 
              Evolua junto com outros atletas.
            </p>
            <div className="bg-black/50 p-4 rounded border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-yellow-500 font-bold">#1</span>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <span className="text-white text-sm">---</span>
                <span className="ml-auto text-primary text-xs">EM BREVE</span>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <span className="text-gray-500 font-bold">#2</span>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <span className="text-white text-sm">---</span>
                <span className="ml-auto text-primary text-xs">EM BREVE</span>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <Flame className="w-16 h-16 text-orange-500" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4 text-white">CONSISTÊNCIA & EVOLUÇÃO</h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              A consistência é a chave. Mantenha sua sequência de treinos ativa, registre suas atividades 
              e acompanhe sua evolução ao longo do tempo.
            </p>
            <div className="flex justify-between items-end h-20 gap-1">
              {[40, 60, 30, 80, 50, 90, 100].map((h, i) => (
                <div key={i} className="w-full bg-primary/20 rounded-t-sm relative group-hover:bg-primary transition-colors" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <Smartphone className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4 text-white">APP DEDICADO</h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              Um aplicativo dedicado para a comunidade ZUNO está em desenvolvimento. 
              Registro de treinos, desafios e conexão com outros atletas na palma da mão.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black/50 p-2 text-center border border-white/10">
                <span className="text-xs text-gray-500 block">IOS</span>
                <span className="text-primary font-bold text-sm">EM BREVE</span>
              </div>
              <div className="bg-black/50 p-2 text-center border border-white/10">
                <span className="text-xs text-gray-500 block">ANDROID</span>
                <span className="text-primary font-bold text-sm">EM BREVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Teaser */}
      <section className="py-20 border-t border-white/10 bg-white/5">
        <div className="container flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-6">
              <Smartphone className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-white tracking-widest">EM DESENVOLVIMENTO</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 text-white">
              SEU TREINO NA <br/> PALMA DA MÃO
            </h2>
            <p className="font-body text-gray-400 text-lg leading-relaxed mb-8">
              O monitoramento e recursos digitais estarão disponíveis futuramente através do aplicativo Zuno, 
              em desenvolvimento. Registro de treinos, desafios da comunidade e ranking — tudo num só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black font-display tracking-wider h-12">
                IOS (EM BREVE)
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black font-display tracking-wider h-12">
                ANDROID (EM BREVE)
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-64 h-[500px] bg-black border-4 border-gray-800 rounded-[3rem] shadow-2xl shadow-primary/20 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/KApJbWzmgRZYRSqJ.jpeg" alt="Atleta correndo com óculos ZUNO" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 flex flex-col justify-end p-6">
                <h4 className="font-display font-bold text-2xl text-white mb-1">RUNNING</h4>
                <p className="text-primary font-mono text-xl">00:42:15</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
