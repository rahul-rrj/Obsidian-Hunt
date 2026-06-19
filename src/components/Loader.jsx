import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Cpu, Compass, Wifi } from 'lucide-react';

const BOOT_LOGS = [
  { text: 'INITIALIZING MISSION CONTROL HUB...', icon: Cpu },
  { text: 'ESTABLISHING DOWNLINK WITH SLC-40 / Cape Canaveral...', icon: Wifi },
  { text: 'SYNCHRONIZING ORBITAL TRAJECTORY ENGINES...', icon: Compass },
  { text: 'SECURING TERMINAL DATA STREAM (SSL/TLS)...', icon: Shield },
  { text: 'INTEGRATING SPACEX TELEMETRY FEED... RETRYING...', icon: Terminal },
  { text: 'API TIMEOUT (FALLING BACK TO SYSTEM BACKUP DATA)...', icon: Shield },
  { text: 'OBSIDIAN HUNT OS V4.8.1 ONLINE. GO FOR FLIGHT.', icon: Cpu },
];

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  // Loading progress ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Wait a short moment after reaching 100% to let the user see the complete state
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        // Accelerate/decelerate progression randomly for realistic loading simulation
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Log prints ticking
  useEffect(() => {
    if (activeLogIndex < BOOT_LOGS.length) {
      // Print logs as loading progresses
      const logThreshold = (activeLogIndex + 1) * (100 / BOOT_LOGS.length);
      if (progress >= logThreshold || progress === 100) {
        setLogs((prev) => [...prev, BOOT_LOGS[activeLogIndex]]);
        setActiveLogIndex((prev) => prev + 1);
      }
    }
  }, [progress, activeLogIndex]);

  return (
    <div className="fixed inset-0 bg-[#020204] z-50 flex flex-col items-center justify-center p-6 font-mono scanlines select-none">
      {/* Background neon grid lines */}
      <div className="absolute inset-0 cyber-grid opacity-15" />
      
      {/* Screen corners HUD layout */}
      <div className="absolute top-6 left-6 text-xs text-neon-cyan/40">SYS_BOOT // LV-426</div>
      <div className="absolute top-6 right-6 text-xs text-neon-cyan/40">TIME_REF_UTC // {new Date().toISOString().substring(11, 19)}</div>
      <div className="absolute bottom-6 left-6 text-xs text-neon-cyan/40">COORD_LOCK // 28.5721 N 80.6480 W</div>
      <div className="absolute bottom-6 right-6 text-xs text-neon-cyan/40">MODE_OPERATIONAL // SECURE_DOWNLINK</div>

      {/* Main Console Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-cyber-slate/30 border border-neon-cyan/20 backdrop-blur-md p-8 rounded-lg relative overflow-hidden"
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-pulse" />

        {/* Brand Icon Display */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl mb-3 filter drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            🚀
          </motion.div>
          <h2 className="text-xl font-bold tracking-widest text-slate-100 font-display">OBSIDIAN HUNT</h2>
          <div className="text-[10px] text-neon-cyan/60 mt-1 uppercase tracking-widest">MISSION CONTROL OPERATING SYSTEM</div>
        </div>

        {/* Shell Boot Logs */}
        <div className="h-44 bg-space-black/85 border border-white/5 rounded p-4 mb-6 overflow-y-auto text-[11px] leading-relaxed flex flex-col gap-1 text-emerald-400">
          <div className="text-slate-500 mb-2 border-b border-white/5 pb-1 flex items-center justify-between">
            <span>CONSOLE STATUS MONITOR</span>
            <span className="animate-pulse">● FEED ACTIVE</span>
          </div>
          {logs.map((log, idx) => {
            const Icon = log.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Icon size={12} className="text-neon-cyan" />
                <span>{log.text}</span>
              </motion.div>
            );
          })}
          {progress < 100 && (
            <div className="flex items-center gap-1 text-neon-cyan">
              <span className="animate-ping font-bold">_</span>
            </div>
          )}
        </div>

        {/* Loading Progress Percentage bar */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-neon-cyan/80">INITIALIZATION PROGRAM</span>
          <span className="text-neon-cyan font-bold tabular-nums">{progress}%</span>
        </div>
        <div className="h-[10px] bg-space-black border border-neon-cyan/20 rounded-full overflow-hidden p-[2px]">
          <motion.div 
            className="h-full bg-gradient-to-r from-neon-cyan/50 to-neon-cyan rounded-full glow-cyan"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
