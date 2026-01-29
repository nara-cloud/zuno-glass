import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const calculateTimeLeft = (): TimeLeft => {
    // Set launch date to March 3rd, 2026
    const launchDate = new Date('2026-03-03T00:00:00');
    const now = new Date();
    const difference = launchDate.getTime() - now.getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="relative">
        <div className="font-display font-bold text-4xl md:text-6xl text-white tabular-nums tracking-wider">
          {value.toString().padStart(2, '0')}
        </div>
        <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      </div>
      <span className="font-body text-xs md:text-sm text-gray-400 mt-2 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center items-center py-8 animate-in-up delay-300">
      <TimeUnit value={timeLeft.days} label="Dias" />
      <div className="text-2xl md:text-4xl text-primary font-bold mb-6">:</div>
      <TimeUnit value={timeLeft.hours} label="Horas" />
      <div className="text-2xl md:text-4xl text-primary font-bold mb-6">:</div>
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <div className="text-2xl md:text-4xl text-primary font-bold mb-6">:</div>
      <TimeUnit value={timeLeft.seconds} label="Seg" />
    </div>
  );
}
