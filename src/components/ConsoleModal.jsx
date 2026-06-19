import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ShieldAlert, Cpu, Terminal, Compass, TrendingUp, RefreshCw } from 'lucide-react';

export default function ConsoleModal({ launch, onClose }) {
  if (!launch) return null;

  const canvasRef = useRef(null);
  const [simulationActive, setSimulationActive] = useState(false);
  const [aborted, setAborted] = useState(false);
  
  // Real-time ticking telemetry values
  const [sec, setSec] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [stage, setStage] = useState('BOOSTER_PROPULSION');

  // Trigger checklist completion indices
  const [checklistIndex, setChecklistIndex] = useState(3); // Start with some completed

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Telemetry Simulation ticks
  useEffect(() => {
    if (!simulationActive || aborted) return;

    const timer = setInterval(() => {
      setSec((prevSec) => {
        const nextSec = prevSec + 2;
        
        // Staging updates
        if (nextSec < 60) {
          setStage('BOOSTER_PROPULSION');
          setChecklistIndex(3);
        } else if (nextSec < 150) {
          setStage('HOT_STAGING_SEPARATION');
          setChecklistIndex(4);
        } else if (nextSec < 240) {
          setStage('VACUUM_PROPULSION');
          setChecklistIndex(5);
        } else {
          setStage('ORBITAL_INSERTION_COMPLETE');
          setChecklistIndex(6);
          setSimulationActive(false);
          clearInterval(timer);
        }

        // Parabolic curves for speed & altitude
        // Speed up to orbital velocity (27,000 km/h)
        const targetSpeed = Math.min(27000, Math.floor(Math.pow(nextSec, 1.45) * 8.5));
        setSpeed(targetSpeed);

        // Altitude up to low earth orbit (apogee ~200km)
        const targetAlt = Math.min(220, parseFloat((Math.pow(nextSec, 1.25) * 0.25).toFixed(2)));
        setAltitude(targetAlt);

        return nextSec;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [simulationActive, aborted]);

  // Canvas Telemetry curve drawer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let t = 0;
    let animId;

    const draw = () => {
      t += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Black Void Background
      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Alarm coloring if aborted
      if (aborted) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Cyber Grid
      ctx.strokeStyle = aborted ? 'rgba(239, 68, 68, 0.06)' : 'rgba(0, 240, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw historical path based on ticks
      ctx.strokeStyle = aborted ? '#ef4444' : '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const maxTicks = 240;
      const progressWidth = (sec / maxTicks) * canvas.width;
      
      ctx.moveTo(0, canvas.height - 30);
      
      const curvePoints = [];
      const totalPoints = 50;
      for (let i = 0; i <= totalPoints; i++) {
        const ptX = (i / totalPoints) * progressWidth;
        const ptT = (i / totalPoints) * sec;
        // Parabolic height curve
        const ptY = canvas.height - 30 - Math.min(100, Math.pow(ptT, 1.1) * 0.4);
        curvePoints.push({ x: ptX, y: ptY });
      }

      if (curvePoints.length > 1) {
        ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
        for (let i = 1; i < curvePoints.length; i++) {
          ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
        }
        ctx.stroke();

        // Draw current pulse tip
        const tip = curvePoints[curvePoints.length - 1];
        ctx.fillStyle = aborted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 240, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 6 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw abort alerts
      if (aborted) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('WARNING: TRAJECTORY TERMINATED', canvas.width / 2 - 90, canvas.height / 2);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, [sec, aborted]);

  const handleInitiate = () => {
    setAborted(false);
    setSec(0);
    setSpeed(0);
    setAltitude(0);
    setStage('BOOSTER_PROPULSION');
    setChecklistIndex(3);
    setSimulationActive(true);
  };

  const handleAbort = () => {
    setSimulationActive(false);
    setAborted(true);
    setStage('MISSION_ABORTED_SHUTDOWN');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 font-mono select-none">
        {/* Backdrop glass */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020204]/90 backdrop-blur-sm"
        />

        {/* Screen vibration on abort */}
        <motion.div
          animate={aborted ? {
            x: [0, -4, 4, -4, 4, 0],
            y: [0, 4, -4, 4, -4, 0]
          } : {}}
          transition={{ duration: 0.4 }}
          className={`w-full max-w-4xl bg-cyber-slate/90 border rounded-lg shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden ${
            aborted ? 'border-rose-500/40 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'border-neon-cyan/20 shadow-[0_0_50px_rgba(0,240,255,0.15)]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-space-black/60 shrink-0">
            <div>
              <span className="text-[9px] text-slate-500 block uppercase">FLIGHT DIRECTORS TELEMETRY CORE</span>
              <h2 className="text-sm font-bold text-white uppercase flex items-center gap-1.5 mt-0.5">
                <Terminal size={14} className="text-neon-cyan" /> {launch.missionName}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-rose-500 border border-transparent hover:border-white/10 p-1 rounded transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Grid Panels scrollable */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left side: Checklist and specs (col-7) */}
            <div className="md:col-span-7 flex flex-col gap-6 text-left">
              {/* Mission Specs Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-space-black/55 p-3.5 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">Rocket fleet</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block">{launch.rocketName}</span>
                </div>
                <div className="bg-space-black/55 p-3.5 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">Launch Site</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block truncate">{launch.launchSite.split(',')[0]}</span>
                </div>
                <div className="bg-space-black/55 p-3.5 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">Target Orbit</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block">{launch.targetOrbit}</span>
                </div>
                <div className="bg-space-black/55 p-3.5 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">Payload cargo</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block truncate">{launch.payload}</span>
                </div>
              </div>

              {/* Status Sequence Checklist */}
              <div className="bg-space-black/45 border border-white/5 rounded p-5">
                <span className="text-[10px] text-slate-500 block uppercase font-bold mb-3 border-b border-white/5 pb-2">
                  LAUNCH STAGE CHECKLIST
                </span>
                <div className="flex flex-col gap-2.5">
                  {launch.checklist?.map((step, idx) => {
                    const isChecked = idx < checklistIndex;
                    return (
                      <div 
                        key={step.id} 
                        className={`flex items-center justify-between text-xs transition-colors ${
                          isChecked ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${
                            isChecked ? 'bg-emerald-400' : 'bg-slate-700'
                          }`} />
                          <span>{step.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 italic shrink-0 hidden sm:inline">
                          {isChecked ? '✓ GO' : '○ STBY'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right side: Live Telemetry Canvas & Controllers (col-5) */}
            <div className="md:col-span-5 flex flex-col justify-between gap-6">
              
              {/* Telemetry monitor readings */}
              <div className={`p-4 border rounded relative overflow-hidden scanlines bg-space-black/60 ${
                aborted ? 'border-rose-500/20' : 'border-neon-cyan/20'
              }`}>
                {/* Visual state headers */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-white/5 pb-2 mb-3">
                  <span className="flex items-center gap-1.5"><Compass size={12} className="text-neon-cyan" /> ORBITAL_TRAJ_FLOW</span>
                  <span className={aborted ? 'text-rose-400' : 'text-neon-cyan animate-pulse'}>
                    {aborted ? '▲ TERMINATED' : simulationActive ? '● SIM_RUNNING' : '■ TELEMETRY_STBY'}
                  </span>
                </div>

                {/* Values */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-[10px] text-slate-400">FLIGHT TIME:</span>
                  <span className="text-slate-100 font-bold tabular-nums">{sec}s</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[10px] text-slate-400">VELOCITY:</span>
                  <span className="text-slate-100 font-bold tabular-nums">{speed.toLocaleString()} km/h</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[10px] text-slate-400">ALTITUDE:</span>
                  <span className="text-slate-100 font-bold tabular-nums">{altitude.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[10px] text-slate-400">SYS_STAGE:</span>
                  <span className={`font-bold text-[10px] uppercase ${aborted ? 'text-rose-400' : 'text-neon-cyan'}`}>
                    {stage}
                  </span>
                </div>
              </div>

              {/* HTML Canvas */}
              <div className="border border-white/5 bg-space-black rounded overflow-hidden h-36">
                <canvas 
                  ref={canvasRef} 
                  width={350} 
                  height={144} 
                  className="w-full h-full block"
                />
              </div>

              {/* Flight controllers desk actions */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <button
                  onClick={handleInitiate}
                  className="flex items-center justify-center gap-1.5 bg-neon-cyan hover:bg-neon-cyan/90 text-space-black font-display font-extrabold text-xs py-3 rounded transition-all cursor-pointer glow-cyan"
                >
                  <Play size={12} /> INITIATE FLIGHT
                </button>
                <button
                  onClick={handleAbort}
                  className="flex items-center justify-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:border-rose-500/50 font-display font-extrabold text-xs py-3 rounded transition-all cursor-pointer"
                >
                  <ShieldAlert size={12} /> ABORT COMMAND
                </button>
              </div>

            </div>
          </div>

          {/* HUD status footer bar */}
          <div className="bg-space-black/80 px-6 py-2.5 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-500 shrink-0">
            <span>SYS_LINK: PRIMARY_ACTIVE</span>
            <span className="text-neon-cyan/40">OBSIDIAN HUNT OPERATIONS TERMINAL</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
