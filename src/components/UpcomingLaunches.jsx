import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Orbit, Clock, Terminal } from 'lucide-react';
import { UPCOMING_LAUNCHES } from '../data/mockLaunchData';
import ImageReveal from './ImageReveal';

// Individual Countdown Timer Component for each card
function CardCountdown({ launchDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(launchDate) - +new Date();
    let timeLeftObj = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

    if (difference > 0) {
      timeLeftObj = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      };
    }
    return timeLeftObj;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [launchDate]);

  if (timeLeft.expired) {
    return <span className="text-rose-500 font-bold tracking-widest">LIFTOFF COMPLETE</span>;
  }

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5 text-xs text-neon-cyan font-mono font-semibold">
      <Clock size={12} className="animate-pulse" />
      <span>{pad(timeLeft.days)}d : {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s</span>
    </div>
  );
}

export default function UpcomingLaunches({ onSelectLaunch, isWidget = false }) {
  if (isWidget) {
    return (
      <div className="w-full h-full flex flex-col min-h-0 select-none">
        <div className="text-[10px] text-slate-500 mb-2 font-mono uppercase tracking-widest">
          FLIGHT SCHEDULE MANIFESTS ({UPCOMING_LAUNCHES.length})
        </div>
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 min-h-0">
          {UPCOMING_LAUNCHES.map((launch) => (
            <div
              key={launch.id}
              className="bg-cyber-slate/30 border border-white/10 hover:border-neon-cyan/40 backdrop-blur-md rounded-lg overflow-hidden group flex flex-col transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(255,158,0,0.08)] shrink-0"
            >
              <div className="h-32 overflow-hidden relative border-b border-white/5">
                <img 
                  src={launch.image} 
                  alt={launch.missionName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/40 to-transparent" />
                
                {/* Site ID Badge */}
                <span className="absolute top-2 left-2 bg-space-black/75 border border-white/15 px-1.5 py-0.5 rounded text-[8px] text-slate-300 font-mono">
                  {launch.rocketName}
                </span>

                {/* Countdown Ticking */}
                <div className="absolute bottom-2 left-2 bg-space-black/80 backdrop-blur-sm border border-neon-cyan/20 px-2 py-0.5 rounded">
                  <CardCountdown launchDate={launch.launchDate} />
                </div>
              </div>

              {/* Content Body */}
              <div className="p-3 flex flex-col text-left">
                <h3 className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors truncate font-display">
                  {launch.missionName}
                </h3>
                <p className="text-[10px] text-slate-400 font-sans line-clamp-2 mt-1 leading-relaxed">
                  {launch.description}
                </p>

                {/* Card Footer Actions */}
                <button
                  onClick={() => onSelectLaunch(launch)}
                  className="w-full mt-3 bg-white/5 hover:bg-neon-cyan hover:text-space-black border border-white/10 hover:border-neon-cyan text-[10px] font-display font-extrabold py-1.5 rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Terminal size={10} /> MISSION DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="upcoming" className="py-20 px-6 max-w-7xl mx-auto select-none border-b border-white/5 relative">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left relative z-10">
        <div>
          <div className="text-[10px] text-neon-cyan font-bold tracking-widest uppercase mb-1">
            FLIGHT SCHEDULE MANIFEST
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white uppercase">
            UPCOMING MISSIONS
          </h2>
        </div>
        <div className="text-slate-500 text-[10px] font-mono mt-2 md:mt-0">
          SWIPE LEFT/RIGHT TO INSPECT MANIFESTS // TOTAL: {UPCOMING_LAUNCHES.length}
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth select-none relative z-10 snap-x snap-mandatory">
        {UPCOMING_LAUNCHES.map((launch, idx) => (
          <motion.div
            key={launch.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -6 }}
            className="snap-start shrink-0 w-80 md:w-96 bg-cyber-slate/30 border border-white/10 hover:border-neon-cyan/40 backdrop-blur-md rounded-lg overflow-hidden group flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,158,0,0.1)]"
          >
            <div className="h-44 overflow-hidden relative border-b border-white/5">
              <ImageReveal 
                src={launch.image} 
                alt={launch.missionName}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/40 to-transparent" />
              
              {/* Site ID Badge */}
              <span className="absolute top-4 left-4 bg-space-black/75 border border-white/15 px-2 py-0.5 rounded text-[9px] text-slate-300 font-mono">
                {launch.rocketName}
              </span>

              {/* Countdown Ticking */}
              <div className="absolute bottom-4 left-4 bg-space-black/80 backdrop-blur-sm border border-neon-cyan/20 px-3 py-1 rounded glow-cyan">
                <CardCountdown launchDate={launch.launchDate} />
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between text-left">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-1 mb-1 font-display">
                  {launch.missionName}
                </h3>
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-3">
                  MANUFACTURER: {launch.manufacturer}
                </div>
                <p className="text-xs text-slate-400 font-sans line-clamp-3 mb-5 leading-relaxed h-12">
                  {launch.description}
                </p>
              </div>

              {/* Data specifications */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-4 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-neon-cyan/70 shrink-0" />
                  <span className="truncate">PAD: {launch.launchSite}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Orbit size={12} className="text-neon-cyan/70 shrink-0" />
                  <span className="truncate">ORBIT: {launch.targetOrbit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-neon-cyan/70 shrink-0" />
                  <span>DATE: {new Date(launch.launchDate).toLocaleString()}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <button
                onClick={() => onSelectLaunch(launch)}
                className="w-full mt-5 bg-white/5 hover:bg-neon-cyan hover:text-space-black border border-white/10 hover:border-neon-cyan text-xs font-display font-extrabold py-2.5 rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Terminal size={12} /> MISSION DETAILS
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
