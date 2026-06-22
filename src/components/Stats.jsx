import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, CalendarRange } from 'lucide-react';

function CountUpNumber({ endValue, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [endValue, duration]);

  return <span className="tabular-nums">{count}{suffix}</span>;
}

export default function Stats({ isWidget = false }) {
  const statsItems = [
    {
      label: 'TOTAL LAUNCHES',
      value: 342,
      suffix: '',
      icon: Rocket,
      accent: 'text-neon-cyan',
      glow: 'shadow-[0_0_15px_rgba(255,158,0,0.15)] border-neon-cyan/20 bg-neon-cyan/5',
      desc: 'Cumulative orbital insertions'
    },
    {
      label: 'SUCCESS RATE',
      value: 98,
      suffix: '%',
      icon: ShieldCheck,
      accent: 'text-emerald-400',
      glow: 'shadow-[0_0_15px_rgba(52,211,153,0.15)] border-emerald-500/20 bg-emerald-500/5',
      desc: 'Flawless mission delivery'
    },
    {
      label: 'UPCOMING MISSIONS',
      value: 47,
      suffix: '',
      icon: CalendarRange,
      accent: 'text-rocket-orange',
      glow: 'shadow-[0_0_15px_rgba(255,107,0,0.15)] border-rocket-orange/20 bg-rocket-orange/5',
      desc: 'Active launch Manifest'
    }
  ];

  if (isWidget) {
    return (
      <div className="w-full flex flex-col gap-2.5 font-mono relative z-10">
        {statsItems.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border backdrop-blur-md flex items-center justify-between transition-all duration-300 ${stat.glow}`}
            >
              <div className="text-left">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">
                  {stat.label}
                </div>
                <div className={`text-2xl font-bold font-display ${stat.accent}`}>
                  <CountUpNumber endValue={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[9px] text-slate-400">
                  {stat.desc}
                </div>
              </div>
              <div className={`p-2 rounded bg-space-black/50 border border-white/5 ${stat.accent} filter drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]`}>
                <Icon size={16} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full py-10 px-6 max-w-7xl mx-auto relative select-none font-mono">
      {/* Dense grid pattern */}
      <div className="absolute inset-0 cyber-grid-dense opacity-5 pointer-events-none" />

      {/* Floating Panel Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {statsItems.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-lg border backdrop-blur-md flex items-center justify-between transition-all duration-300 ${stat.glow}`}
            >
              <div className="text-left">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                  {stat.label}
                </div>
                <div className={`text-4xl font-extrabold font-display my-1.5 ${stat.accent}`}>
                  <CountUpNumber endValue={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] text-slate-400">
                  {stat.desc}
                </div>
              </div>
              <div className={`p-3 rounded bg-space-black/50 border border-white/5 ${stat.accent} filter drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]`}>
                <Icon size={24} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
