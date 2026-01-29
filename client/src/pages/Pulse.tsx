import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Trophy, Flame, Target, TrendingUp, Lock, Unlock, Clock } from 'lucide-react';

export default function Pulse() {
  // Mock data for the dashboard
  const stats = {
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    streak: 14,
    totalKm: 128.5,
    hoursFocused: 42
  };

  const challenges = [
    {
      id: 1,
      title: "MARATONA DE VERÃO",
      description: "Complete 42km acumulados em Fevereiro",
      progress: 32,
      total: 42,
      reward: "Badge Exclusiva + 20% OFF",
      image: "/images/001.webp",
      status: "active"
    },
    {
      id: 2,
      title: "DESAFIO DA MONTANHA",
      description: "Ganhe 1000m de elevação em uma única atividade",
      progress: 0,
      total: 1000,
      reward: "Acesso Antecipado Zuno Peak",
      image: "/images/006.webp",
      status: "locked"
    },
    {
      id: 3,
      title: "CONSISTÊNCIA ZUNO",
      description: "Treine por 21 dias consecutivos",
      progress: 14,
      total: 21,
      reward: "Camiseta Zuno Squad",
      image: "/images/004.webp",
      status: "active"
    }
  ];

  const badges = [
    { name: "Early Adopter", icon: <Target className="w-6 h-6" />, unlocked: true },
    { name: "Marathoner", icon: <Activity className="w-6 h-6" />, unlocked: true },
    { name: "Night Runner", icon: <Clock className="w-6 h-6" />, unlocked: false },
    { name: "Elite Squad", icon: <Trophy className="w-6 h-6" />, unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pt-32 pb-20 container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-2">
              ZUNO <span className="text-primary italic">PULSE</span>
            </h1>
            <p className="font-body text-gray-400 text-lg">Seu painel de performance e evolução.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 border border-white/10 rounded-lg">
            <div className="text-right">
              <p className="font-display font-bold text-white text-xl">NÍVEL {stats.level}</p>
              <p className="font-body text-xs text-gray-400">{stats.xp} / {stats.nextLevelXp} XP</p>
            </div>
            <div className="w-16 h-16 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-primary" strokeDasharray={175} strokeDashoffset={175 - (175 * (stats.xp / stats.nextLevelXp))} />
              </svg>
              <Flame className="w-6 h-6 text-primary absolute" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-card border border-white/10 p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-display text-sm">STREAK ATUAL</span>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <p className="font-display font-bold text-4xl text-white">{stats.streak} <span className="text-lg text-gray-500">DIAS</span></p>
          </div>
          <div className="bg-card border border-white/10 p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-display text-sm">TOTAL KM</span>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <p className="font-display font-bold text-4xl text-white">{stats.totalKm}</p>
          </div>
          <div className="bg-card border border-white/10 p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-display text-sm">HORAS DE FOCO</span>
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <p className="font-display font-bold text-4xl text-white">{stats.hoursFocused}h</p>
          </div>
          <div className="bg-card border border-white/10 p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-display text-sm">RANKING</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="font-display font-bold text-4xl text-white">TOP 5%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Active Challenges */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="font-display font-bold text-3xl text-white flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" /> DESAFIOS ATIVOS
            </h2>
            
            <div className="space-y-6">
              {challenges.map((challenge) => (
                <div key={challenge.id} className={`bg-card border ${challenge.status === 'active' ? 'border-white/10' : 'border-white/5 opacity-60'} p-6 relative overflow-hidden group`}>
                  <div className="flex flex-col md:flex-row gap-6 relative z-10">
                    <div className="w-full md:w-48 aspect-video bg-black/50 overflow-hidden rounded border border-white/10">
                      <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-display font-bold text-xl text-white">{challenge.title}</h3>
                        {challenge.status === 'locked' ? <Lock className="w-4 h-4 text-gray-500" /> : <Unlock className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="font-body text-gray-400 text-sm mb-4">{challenge.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-display tracking-wider">
                          <span className="text-white">PROGRESSO</span>
                          <span className="text-primary">{Math.round((challenge.progress / challenge.total) * 100)}%</span>
                        </div>
                        <Progress value={(challenge.progress / challenge.total) * 100} className="h-2 bg-white/10" />
                        <p className="text-xs text-gray-500 mt-2">Recompensa: {challenge.reward}</p>
                      </div>
                    </div>
                  </div>
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges & Achievements */}
          <div className="space-y-8">
            <h2 className="font-display font-bold text-3xl text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" /> CONQUISTAS
            </h2>
            
            <div className="bg-card border border-white/10 p-6">
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, i) => (
                  <div key={i} className={`aspect-square flex flex-col items-center justify-center p-4 border ${badge.unlocked ? 'border-primary/30 bg-primary/5' : 'border-white/5 bg-white/5 opacity-50'} transition-all hover:scale-105`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${badge.unlocked ? 'bg-primary text-black' : 'bg-white/10 text-gray-500'}`}>
                      {badge.icon}
                    </div>
                    <span className={`font-display font-bold text-xs text-center ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>{badge.name}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6 bg-white/5 hover:bg-white hover:text-black text-white border border-white/10 font-display tracking-wider">
                VER TODAS AS BADGES
              </Button>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 p-6 clip-corner">
              <h3 className="font-display font-bold text-xl text-white mb-2">ZUNO PRO</h3>
              <p className="font-body text-sm text-gray-300 mb-4">Desbloqueie análises avançadas e desafios exclusivos.</p>
              <Button className="w-full bg-primary text-black hover:bg-white font-display font-bold">
                FAZER UPGRADE
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
