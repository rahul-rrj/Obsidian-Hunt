import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Compass, ArrowRight, Gauge, Radio, ShieldAlert } from 'lucide-react';
import { UPCOMING_LAUNCHES } from '../data/mockLaunchData';

export default function Hero({ onExploreClick, onWatchMission, isWidget = false }) {
  // Find nearest upcoming launch
  const nextLaunch = UPCOMING_LAUNCHES.reduce((prev, curr) => {
    return new Date(curr.launchDate) < new Date(prev.launchDate) ? curr : prev;
  });

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    altitude: 0,
    pitch: 0.0,
    yaw: 0.0,
    roll: 0.0,
    status: 'SYS_STABLE'
  });

  // Calculate remaining launch countdown time
  function calculateTimeLeft() {
    const difference = +new Date(nextLaunch.launchDate) - +new Date();
    let timeLeftObj = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeftObj = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeftObj;
  }

  // Ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [nextLaunch.launchDate]);

  // Telemetry simulations - updates frequently to feel alive
  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.1;
      setTelemetry(prev => {
        const speedDrift = Math.random() * 2 - 1;
        const altitudeDrift = Math.random() * 0.1 - 0.05;
        
        return {
          speed: Math.max(0, parseFloat((5600 + Math.sin(t) * 120 + speedDrift).toFixed(1))),
          altitude: Math.max(0, parseFloat((89.2 + Math.cos(t) * 2 + altitudeDrift).toFixed(2))),
          pitch: parseFloat((45.2 + Math.sin(t * 0.5) * 1.5).toFixed(2)),
          yaw: parseFloat((0.15 + Math.cos(t * 0.8) * 0.05).toFixed(3)),
          roll: parseFloat((0.02 + Math.sin(t * 0.4) * 0.01).toFixed(3)),
          status: Math.random() > 0.98 ? 'VIBRATION_ALERT' : 'SYS_STABLE'
        };
      });
    }, 150);

    return () => clearInterval(interval);
  }, [nextLaunch.id]);

  const padZero = (num) => String(num).padStart(2, '0');

  if (isWidget) {
    return (
      <div className="w-full flex flex-col gap-4 font-mono z-10 select-none">
        {/* Countdown Panel */}
        <div className="w-full bg-space-black/60 border border-white/10 backdrop-blur-md p-4 rounded-lg relative">
          <div className="absolute top-2 right-4 flex items-center gap-1 text-[8px] text-slate-500">
            <span>PAD: {nextLaunch.launchSite}</span>
            <span className="text-neon-cyan animate-pulse">● ACTIVE</span>
          </div>
          <div className="text-[9px] text-slate-500 mb-2 tracking-widest uppercase">
            NEXT LAUNCH COUNTDOWN
          </div>
          <div className="text-xs font-bold text-white mb-2 truncate">
            {nextLaunch.missionName} ({nextLaunch.rocketName})
          </div>
          {/* Timers */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-cyber-slate/40 border border-white/5 p-2 rounded">
              <div className="text-lg font-bold text-white font-mono tabular-nums">{padZero(timeLeft.days)}</div>
              <div className="text-[7px] text-slate-500 uppercase">DAYS</div>
            </div>
            <div className="bg-cyber-slate/40 border border-white/5 p-2 rounded">
              <div className="text-lg font-bold text-white font-mono tabular-nums">{padZero(timeLeft.hours)}</div>
              <div className="text-[7px] text-slate-500 uppercase">HRS</div>
            </div>
            <div className="bg-cyber-slate/40 border border-white/5 p-2 rounded">
              <div className="text-lg font-bold text-white font-mono tabular-nums">{padZero(timeLeft.minutes)}</div>
              <div className="text-[7px] text-slate-500 uppercase">MINS</div>
            </div>
            <div className="bg-cyber-slate/40 border border-white/5 p-2 rounded">
              <div className="text-lg font-bold text-neon-cyan font-mono tabular-nums drop-shadow-[0_0_8px_rgba(255,158,0,0.4)]">{padZero(timeLeft.seconds)}</div>
              <div className="text-[7px] text-slate-500 uppercase">SECS</div>
            </div>
          </div>
        </div>

        {/* Flight Telemetry HUD Widget */}
        <div className="w-full bg-cyber-slate/20 border border-neon-cyan/20 backdrop-blur-md rounded-lg p-4 font-mono overflow-hidden relative shadow-[inset_0_0_30px_rgba(255,158,0,0.05)] scanlines">
          {/* HUD Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Compass size={10} className="text-neon-cyan" /> TELEMETRY HUD // PRIMARY
            </span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
              telemetry.status === 'SYS_STABLE' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 glitch-text'
            }`}>
              {telemetry.status === 'SYS_STABLE' ? '● ONLINE' : '▲ WARN'}
            </span>
          </div>

          {/* Telemetry readouts */}
          <div className="grid grid-cols-2 gap-2 mb-3.5">
            <div className="bg-space-black/55 p-2 border border-white/5 rounded">
              <div className="text-[8px] text-slate-500 uppercase">VELOCITY</div>
              <div className="text-sm font-semibold text-slate-100 mt-0.5 tabular-nums">
                {parseFloat((telemetry.speed / 1225).toFixed(2))} <span className="text-[10px] text-slate-500 font-normal">M</span>
              </div>
              <div className="text-[8px] text-neon-cyan/70 mt-0.5 tabular-nums">{(telemetry.speed * 3.6).toFixed(0)} km/h</div>
            </div>
            <div className="bg-space-black/55 p-2 border border-white/5 rounded">
              <div className="text-[8px] text-slate-500 uppercase">ALTITUDE</div>
              <div className="text-sm font-semibold text-slate-100 mt-0.5 tabular-nums">
                {telemetry.altitude} <span className="text-[10px] text-slate-500 font-normal">km</span>
              </div>
              <div className="text-[8px] text-neon-cyan/70 mt-0.5">APOGEE</div>
            </div>
          </div>

          {/* Guidance vectors */}
          <div className="border border-white/5 bg-space-black/45 rounded p-2 flex flex-col gap-1.5 text-[10px] text-slate-300">
            <div className="flex justify-between items-center pb-1 border-b border-white/5 text-[9px]">
              <span className="text-slate-500">GUIDANCE VECTORS</span>
              <span className="text-slate-400">STAGING STABLE</span>
            </div>
            <div className="flex justify-between items-center">
              <span>PITCH</span>
              <span className="text-neon-cyan font-bold tabular-nums">{telemetry.pitch}°</span>
            </div>
            <div className="h-1 bg-space-black rounded-full overflow-hidden">
              <div className="h-full bg-neon-cyan rounded-full transition-all" style={{ width: `${(telemetry.pitch / 90) * 100}%` }} />
            </div>
            <div className="flex justify-between items-center">
              <span>YAW / ROLL</span>
              <span className="text-slate-300 tabular-nums">{telemetry.yaw}° / {telemetry.roll}°/s</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh flex flex-col justify-center items-center px-6 overflow-hidden starfield select-none pt-16">
      {/* Background Parallax Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
      </div>

      {/* Atmospheric Radial Glow Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Earth rotating in the background */}
      <div className="absolute right-[-15%] top-[10%] w-[600px] h-[600px] rounded-full border border-neon-cyan/10 bg-radial from-nebula-navy/40 to-space-black pointer-events-none z-0 hidden lg:block overflow-hidden">
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full border border-neon-cyan/5 shadow-[inset_0_0_80px_rgba(255,158,0,0.15)] animate-pulse" />
        {/* Continents overlay using custom spinning animation */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle, transparent 70%, rgba(2,2,4,0.8) 100%), url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: 'cover',
          }}
        />
      </div>

      {/* Dashboard Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none z-0" />

      {/* Mission Control Flight HUD Container */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 relative">
        {/* Left Side: Mission Launch Title & Counter */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-3 py-1 rounded bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-semibold mb-6 uppercase tracking-wider glow-cyan"
          >
            <Radio size={12} className="animate-pulse text-neon-cyan" />
            MISSION COUNTDOWN // T-MINUS
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black font-display tracking-tight text-white mb-4 uppercase leading-none"
          >
            OBSIDIAN <span className="text-neon-cyan font-bold drop-shadow-[0_0_15px_rgba(255,158,0,0.4)]">HUNT</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base text-slate-400 font-sans max-w-lg mb-8 leading-relaxed"
          >
            "Never Miss Humanity's Next Leap." Connect with real-time aerospace telemetry feeds, explore global spaceports, and track heavy rocket configurations.
          </motion.p>

          {/* NASA Countdown Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full max-w-xl bg-space-black/60 border border-white/10 backdrop-blur-md p-6 rounded-lg mb-8 relative"
          >
            {/* Visual indicators */}
            <div className="absolute top-2 right-4 flex items-center gap-1.5 text-[8px] text-slate-500">
              <span>PAD: {nextLaunch.launchSite}</span>
              <span className="text-neon-cyan">● ACTIVE</span>
            </div>
            <div className="text-[10px] text-slate-500 mb-3 tracking-widest uppercase">
              NEXT UPCOMING: {nextLaunch.missionName} ({nextLaunch.rocketName})
            </div>

            {/* Timers */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-cyber-slate/40 border border-white/5 p-3 rounded">
                <div className="text-2xl md:text-4xl font-extrabold text-white font-mono tabular-nums">{padZero(timeLeft.days)}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">DAYS</div>
              </div>
              <div className="bg-cyber-slate/40 border border-white/5 p-3 rounded">
                <div className="text-2xl md:text-4xl font-extrabold text-white font-mono tabular-nums">{padZero(timeLeft.hours)}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">HOURS</div>
              </div>
              <div className="bg-cyber-slate/40 border border-white/5 p-3 rounded">
                <div className="text-2xl md:text-4xl font-extrabold text-white font-mono tabular-nums">{padZero(timeLeft.minutes)}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">MINS</div>
              </div>
              <div className="bg-cyber-slate/40 border border-white/5 p-3 rounded">
                <div className="text-2xl md:text-4xl font-extrabold text-neon-cyan font-mono tabular-nums drop-shadow-[0_0_8px_rgba(255,158,0,0.4)]">{padZero(timeLeft.seconds)}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">SECS</div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onExploreClick}
              className="flex items-center gap-2 bg-neon-cyan hover:bg-neon-cyan/90 text-space-black font-display font-extrabold text-xs px-6 py-3.5 rounded transition-all cursor-pointer shadow-[0_0_20px_rgba(255,158,0,0.4)]"
            >
              EXPLORE MISSIONS <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onWatchMission(nextLaunch)}
              className="flex items-center gap-2 bg-transparent hover:bg-white/5 text-slate-100 hover:text-white border border-white/10 hover:border-white/20 font-display font-extrabold text-xs px-6 py-3.5 rounded transition-all cursor-pointer"
            >
              <Play size={14} className="text-rocket-orange animate-pulse" /> SIMULATE TELEMETRY
            </button>
          </motion.div>
        </div>

        {/* Right Side: Orbital Flight Console HUD */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-5 w-full bg-cyber-slate/20 border border-neon-cyan/20 backdrop-blur-md rounded-lg p-6 font-mono overflow-hidden relative shadow-[inset_0_0_30px_rgba(255,158,0,0.05)] scanlines"
        >
          {/* Neon cyber line border */}
          <div className="absolute top-0 left-0 w-8 h-[2px] bg-neon-cyan" />
          <div className="absolute top-0 left-0 w-[2px] h-8 bg-neon-cyan" />
          <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-neon-cyan" />
          <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-neon-cyan" />

          {/* HUD Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={12} className="text-neon-cyan" /> FLIGHT TELEMETRY HUD // PRIMARY
            </span>
            <span className={`text-[9px] px-2 py-0.5 rounded flex items-center gap-1 ${
              telemetry.status === 'SYS_STABLE' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 glitch-text'
            }`}>
              {telemetry.status === 'SYS_STABLE' ? '● ONLINE' : '▲ COMP_WARN'}
            </span>
          </div>

          {/* Telemetry readouts */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-space-black/55 p-3 border border-white/5 rounded">
              <div className="text-[9px] text-slate-500 uppercase">VELOCITY (MACH)</div>
              <div className="text-xl font-semibold text-slate-100 mt-1 tabular-nums">
                {parseFloat((telemetry.speed / 1225).toFixed(2))} <span className="text-xs text-slate-500">M</span>
              </div>
              <div className="text-[9px] text-neon-cyan/70 mt-1 tabular-nums">{(telemetry.speed * 3.6).toFixed(0)} km/h</div>
            </div>
            <div className="bg-space-black/55 p-3 border border-white/5 rounded">
              <div className="text-[9px] text-slate-500 uppercase">ALTITUDE (APOGEE)</div>
              <div className="text-xl font-semibold text-slate-100 mt-1 tabular-nums">
                {telemetry.altitude} <span className="text-xs text-slate-500">km</span>
              </div>
              <div className="text-[9px] text-neon-cyan/70 mt-1">THERMOSPHERE</div>
            </div>
          </div>

          {/* Telemetry Vector dials mock */}
          <div className="border border-white/5 bg-space-black/45 rounded p-4 mb-4 flex flex-col gap-2.5 text-xs text-slate-300">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-slate-500 text-[10px]">GUIDANCE VECTORS</span>
              <span className="text-slate-400 text-[10px]">STAGING STABLE</span>
            </div>
            <div className="flex justify-between items-center">
              <span>PITCH_DEGREE</span>
              <span className="text-neon-cyan font-bold tabular-nums">{telemetry.pitch}°</span>
            </div>
            <div className="h-1 bg-space-black rounded-full overflow-hidden">
              <div className="h-full bg-neon-cyan rounded-full transition-all" style={{ width: `${(telemetry.pitch / 90) * 100}%` }} />
            </div>

            <div className="flex justify-between items-center mt-1">
              <span>YAW_ANGLE</span>
              <span className="text-slate-300 tabular-nums">{telemetry.yaw}°</span>
            </div>
            <div className="flex justify-between items-center">
              <span>ROLL_RATE</span>
              <span className="text-slate-300 tabular-nums">{telemetry.roll}°/s</span>
            </div>
          </div>

          {/* Live System Console Logs printing inside HUD */}
          <div className="bg-space-black/85 border border-white/5 rounded p-3 text-[10px] text-emerald-400 h-28 overflow-y-auto leading-relaxed flex flex-col gap-0.5">
            <div>[04:22:11] Booster catch system checks... OK</div>
            <div className="text-slate-500">[04:22:12] Propellant loading: 98% complete</div>
            <div>[04:22:13] S1/S2 separation lock checks... GO</div>
            <div className="text-rose-400 flex items-center gap-1 font-semibold">
              <ShieldAlert size={10} /> [04:22:14] Wind shear warning, flight computer adjusting...
            </div>
            <div className="text-neon-cyan">[04:22:15] Auto sequence handoff to flight terminal...</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
