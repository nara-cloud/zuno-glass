import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Zap, Lock, ArrowRight, Play } from 'lucide-react';

export default function Lab() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 35, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero Drop Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
          <img src="/images/007.webp" alt="Drop Background" className="w-full h-full object-cover opacity-60 filter grayscale contrast-125" />
        </div>

        <div className="container relative z-20 text-center">
          <div className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md animate-pulse">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary tracking-widest text-sm">PRÓXIMO DROP: PROJECT AERO</span>
          </div>

          <h1 className="font-display font-bold text-6xl md:text-9xl mb-4 tracking-tighter glitch-text" data-text="VELOCITY X">
            VELOCITY X
          </h1>
          <p className="font-body text-gray-300 text-xl max-w-2xl mx-auto mb-12">
            Edição limitada a 50 unidades. Armação em fibra de carbono reciclada de carros de F1. Lentes fotocromáticas de resposta instantânea.
          </p>

          {/* Countdown */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
                <span className="font-display font-bold text-4xl md:text-6xl block mb-2">{value.toString().padStart(2, '0')}</span>
                <span className="font-display text-xs text-gray-500 tracking-widest uppercase">{unit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex w-full max-w-md gap-2">
              <Input placeholder="SEU EMAIL PARA ACESSO VIP" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-display h-14" />
              <Button className="bg-primary text-black hover:bg-white h-14 px-8 font-display font-bold tracking-wider whitespace-nowrap">
                NOTIFICAR-ME
              </Button>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 font-display tracking-widest">MEMBROS ZUNO PRO TÊM ACESSO 1H ANTES</p>
        </div>
      </section>

      {/* Innovation Stories */}
      <section className="py-32 container">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="font-display font-bold text-5xl mb-4">ZUNO <span className="text-primary">ORIGINALS</span></h2>
            <p className="text-gray-400 max-w-xl">Histórias de quem desafia o impossível. Documentários curtos sobre atletas, designers e a ciência por trás da performance.</p>
          </div>
          <Button variant="outline" className="hidden md:flex border-white/20 text-white hover:bg-white hover:text-black font-display tracking-wider">
            VER TODOS OS EPISÓDIOS
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group cursor-pointer">
            <div className="aspect-video bg-gray-900 relative overflow-hidden mb-6 border border-white/10">
              <img src="/images/003.webp" alt="Story 1" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                  <Play className="w-8 h-8 ml-1" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 text-xs font-bold font-display tracking-wider text-white">
                DOC • 12 MIN
              </div>
            </div>
            <h3 className="font-display font-bold text-3xl mb-2 group-hover:text-primary transition-colors">A CIÊNCIA DO FOCO</h3>
            <p className="text-gray-400">Como a neurociência influenciou o design das lentes Zuno Focus™ para reduzir a fadiga mental em ultramaratonas.</p>
          </div>

          <div className="group cursor-pointer">
            <div className="aspect-video bg-gray-900 relative overflow-hidden mb-6 border border-white/10">
              <img src="/images/005.webp" alt="Story 2" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                  <Play className="w-8 h-8 ml-1" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 text-xs font-bold font-display tracking-wider text-white">
                SERIES • EP. 04
              </div>
            </div>
            <h3 className="font-display font-bold text-3xl mb-2 group-hover:text-primary transition-colors">URBAN RUNNERS: TOKYO</h3>
            <p className="text-gray-400">Acompanhamos a crew Midnight Runners pelas ruas de neon de Tóquio testando o novo protótipo Night Vision.</p>
          </div>
        </div>
      </section>

      {/* Archive / Past Drops */}
      <section className="py-20 border-t border-white/10">
        <div className="container">
          <h2 className="font-display font-bold text-3xl mb-12 text-center text-gray-500">ARQUIVO DE DROPS</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-60 hover:opacity-100 transition-opacity">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-white/5 border border-white/10 p-6 flex flex-col justify-between group hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="font-display text-xs text-gray-500">DROP #00{i}</span>
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-center">
                  <img src={`/images/00${i}.webp`} alt="Archive" className="w-full h-32 object-contain mb-4 filter grayscale group-hover:grayscale-0 transition-all" />
                  <h4 className="font-display font-bold text-white">PHANTOM {i}</h4>
                  <span className="text-xs text-red-500 font-display tracking-wider">SOLD OUT</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
