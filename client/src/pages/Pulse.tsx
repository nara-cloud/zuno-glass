import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Trophy, Flame, Target, TrendingUp, Lock, Unlock, Clock, MapPin, Share2, Heart } from 'lucide-react';

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

  const leaderboard = [
    { rank: 1, name: "ALEXIA S.", xp: 15420, avatar: "/images/005.webp", change: "up" },
    { rank: 2, name: "KAI Z.", xp: 14850, avatar: "/images/004.webp", change: "same" },
    { rank: 3, name: "VOCÊ", xp: 12450, avatar: "/images/006.webp", change: "up", highlight: true },
    { rank: 4, name: "JAX G.", xp: 11200, avatar: "/images/003.webp", change: "down" },
    { rank: 5, name: "LUNA V.", xp: 10900, avatar: "/images/001.webp", change: "down" },
  ];

  const activities = [
    {
      id: 1,
      type: "RUN",
      title: "Morning Urban Run",
      date: "Hoje, 06:30",
      stats: { dist: "8.5 km", pace: "4:45 /km", time: "40:22" },
      likes: 24,
      map: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1748&auto=format&fit=crop"
    },
    {
      id: 2,
      type: "CYCLE",
      title: "Night Crit Training",
      date: "Ontem, 20:15",
      stats: { dist: "32.4 km", pace: "32 km/h", time: "1:02:15" },
      likes: 48,
      map: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1587&auto=format&fit=crop"
    }
  ];

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

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left Column: Stats & Activity Feed */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-white/10 p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 font-display text-xs">STREAK</span>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <p className="font-display font-bold text-2xl text-white">{stats.streak}</p>
              </div>
              <div className="bg-card border border-white/10 p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 font-display text-xs">KM TOTAL</span>
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <p className="font-display font-bold text-2xl text-white">{stats.totalKm}</p>
              </div>
              <div className="bg-card border border-white/10 p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 font-display text-xs">HORAS</span>
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <p className="font-display font-bold text-2xl text-white">{stats.hoursFocused}</p>
              </div>
              <div className="bg-card border border-white/10 p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 font-display text-xs">RANK</span>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <p className="font-display font-bold text-2xl text-white">#3</p>
              </div>
            </div>

            {/* Activity Chart (Visual Placeholder) */}
            <div className="bg-card border border-white/10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-xl text-white">ATIVIDADE SEMANAL</h3>
                <select className="bg-black border border-white/20 text-xs text-white p-1">
                  <option>Últimos 7 dias</option>
                  <option>Este Mês</option>
                </select>
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {[40, 65, 30, 85, 50, 90, 20].map((h, i) => (
                  <div key={i} className="w-full bg-white/5 hover:bg-primary/50 transition-colors relative group rounded-t-sm" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}km
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 font-display">
                <span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span><span>DOM</span>
              </div>
            </div>

            {/* Recent Activities Feed */}
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-6">ÚLTIMOS TREINOS</h3>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="bg-card border border-white/10 p-0 overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-48 h-32 bg-gray-800 relative overflow-hidden">
                        <img src={activity.map} alt="Map" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-bold text-primary tracking-wider">{activity.type}</span>
                            <h4 className="font-display font-bold text-lg text-white">{activity.title}</h4>
                            <span className="text-xs text-gray-500">{activity.date}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-6 mt-4">
                          <div>
                            <span className="text-xs text-gray-500 block">DISTÂNCIA</span>
                            <span className="font-display font-bold text-white">{activity.stats.dist}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">RITMO</span>
                            <span className="font-display font-bold text-white">{activity.stats.pace}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">TEMPO</span>
                            <span className="font-display font-bold text-white">{activity.stats.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Leaderboard & Challenges */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <div className="bg-card border border-white/10 p-6">
              <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> LEADERBOARD
              </h3>
              <div className="space-y-4">
                {leaderboard.map((user) => (
                  <div key={user.rank} className={`flex items-center gap-4 p-3 rounded ${user.highlight ? 'bg-primary/10 border border-primary/30' : 'bg-white/5 border border-transparent'}`}>
                    <span className={`font-display font-bold w-6 text-center ${user.rank <= 3 ? 'text-yellow-500' : 'text-gray-500'}`}>
                      {user.rank}
                    </span>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-display font-bold text-sm ${user.highlight ? 'text-primary' : 'text-white'}`}>{user.name}</p>
                      <p className="text-xs text-gray-500">{user.xp} XP</p>
                    </div>
                    {user.change === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {user.change === 'down' && <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />}
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full text-gray-500 hover:text-white mt-4 text-xs">
                VER RANKING COMPLETO
              </Button>
            </div>

            {/* Active Challenges */}
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> DESAFIOS
              </h3>
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className={`bg-card border ${challenge.status === 'active' ? 'border-white/10' : 'border-white/5 opacity-60'} p-4 relative overflow-hidden group`}>
                    <div className="flex gap-4 relative z-10">
                      <div className="w-16 h-16 bg-black/50 rounded border border-white/10 flex-shrink-0">
                        <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-display font-bold text-sm text-white">{challenge.title}</h4>
                          {challenge.status === 'locked' ? <Lock className="w-3 h-3 text-gray-500" /> : <Unlock className="w-3 h-3 text-primary" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-display tracking-wider">
                            <span className="text-gray-400">{Math.round((challenge.progress / challenge.total) * 100)}%</span>
                          </div>
                          <Progress value={(challenge.progress / challenge.total) * 100} className="h-1 bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
