import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, Gauge, Zap, Orbit, Award } from 'lucide-react';
import { ROCKETS } from '../data/mockLaunchData';
import FlippingCard from './FlippingCard';

// Normalization helpers for specifications progress bars
const getThrustPercent = (thrustStr) => {
  const val = parseInt(thrustStr.replace(/[^0-9]/g, ''), 10);
  return Math.min(100, Math.max(10, Math.round((val / 75000) * 100)));
};

const getHeightPercent = (heightStr) => {
  const val = parseInt(heightStr.replace(/[^0-9]/g, ''), 10);
  return Math.min(100, Math.max(10, Math.round((val / 130) * 100)));
};

const getMassPercent = (massStr) => {
  const val = parseInt(massStr.replace(/[^0-9]/g, ''), 10);
  return Math.min(100, Math.max(10, Math.round((val / 5000000) * 100)));
};

const getPayloadPercent = (payloadStr) => {
  if (!payloadStr) return 40;
  const val = parseInt(payloadStr.replace(/[^0-9]/g, ''), 10);
  return Math.min(100, Math.max(15, Math.round((val / 250000) * 100)));
};

export default function RocketGallery({ isWidget = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ROCKETS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ROCKETS.length) % ROCKETS.length);
  };

  const activeRocket = ROCKETS[currentIndex];

  if (isWidget) {
    return (
      <div className="w-full h-full flex flex-col min-h-0 select-none font-mono">
        {/* Header selector */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <div className="text-[10px] text-rocket-orange font-bold tracking-widest uppercase">
            FLEET SPECS
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrev} 
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[10px] text-slate-300 font-bold">{activeRocket.name}</span>
            <button 
              onClick={handleNext} 
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Chassis card */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 min-h-0">
          <div className="relative h-36 rounded-lg overflow-hidden border border-white/10 shrink-0">
            <img
              src={activeRocket.image}
              alt={activeRocket.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-space-black/90 via-space-black/20 to-transparent" />
            <div className="absolute bottom-2 left-2 z-10 text-left">
              <span className="text-[8px] font-bold text-rocket-orange uppercase tracking-widest block">Operator</span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{activeRocket.manufacturer}</span>
            </div>
            <div className="absolute bottom-2 right-2 bg-space-black/80 backdrop-blur-sm border border-emerald-500/20 px-2 py-0.5 rounded text-[8px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              {activeRocket.successRate}% OK
            </div>
          </div>

          {/* Details / Specifications */}
          <div className="flex flex-col gap-3">
            <div className="bg-space-black/40 border border-white/5 rounded p-3 text-[11px] text-slate-300 leading-relaxed text-left">
              <span className="text-[9px] text-slate-500 block uppercase font-bold mb-1">Fleet Description</span>
              {activeRocket.description}
            </div>

            {/* Metrics */}
            <div className="flex flex-col gap-2 border border-white/5 bg-space-black/25 rounded p-3 text-xs">
              {/* Height */}
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">VEHICLE HEIGHT</span>
                <span className="text-white font-bold">{activeRocket.height}</span>
              </div>
              <div className="h-1 bg-space-black rounded-full overflow-hidden">
                <div className="h-full bg-neon-cyan rounded-full" style={{ width: `${getHeightPercent(activeRocket.height)}%` }} />
              </div>

              {/* Mass */}
              <div className="flex justify-between items-center text-[10px] mt-1">
                <span className="text-slate-400">LAUNCH MASS</span>
                <span className="text-white font-bold">{activeRocket.mass}</span>
              </div>
              <div className="h-1 bg-space-black rounded-full overflow-hidden">
                <div className="h-full bg-neon-cyan rounded-full" style={{ width: `${getMassPercent(activeRocket.mass)}%` }} />
              </div>

              {/* Thrust */}
              <div className="flex justify-between items-center text-[10px] mt-1">
                <span className="text-slate-400">BOOSTER THRUST</span>
                <span className="text-white font-bold">{activeRocket.thrust}</span>
              </div>
              <div className="h-1 bg-space-black rounded-full overflow-hidden">
                <div className="h-full bg-rocket-orange rounded-full" style={{ width: `${getThrustPercent(activeRocket.thrust)}%` }} />
              </div>

              {/* Payload */}
              <div className="flex justify-between items-center text-[10px] mt-1">
                <span className="text-slate-400">LEO PAYLOAD CAPACITY</span>
                <span className="text-white font-bold">{activeRocket.payloadLEO}</span>
              </div>
              <div className="h-1 bg-space-black rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${getPayloadPercent(activeRocket.payloadLEO)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="rockets" className="py-20 px-6 max-w-7xl mx-auto select-none border-b border-white/5 relative font-mono">
      <div className="absolute inset-0 cyber-grid-dense opacity-5 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left relative z-10">
        <div>
          <div className="text-[10px] text-rocket-orange font-bold tracking-widest uppercase mb-1">
            ACTIVE FLEET SPECIFICATIONS
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white uppercase">
            LAUNCH VEHICLES
          </h2>
        </div>
        <div className="text-slate-500 text-[10px] mt-2 md:mt-0">
          INDEX RANGE // {currentIndex + 1} OF {ROCKETS.length} FLEETS ACTIVE
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Flipping Rocket Card (col-5) */}
        <div className="lg:col-span-5 relative h-[380px] md:h-[480px]">
          <FlippingCard
            className="w-full h-full"
            front={
              <div className="relative w-full h-full bg-cyber-slate/15 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center group shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeRocket.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    src={activeRocket.image}
                    alt={activeRocket.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/40 to-transparent" />

                {/* Overlays on Front face */}
                <div className="absolute top-4 left-4 z-10 text-left">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">FLEET CLASS</span>
                  <span className="text-xl font-bold font-display text-white uppercase tracking-wider glow-cyan">{activeRocket.name}</span>
                </div>

                <div className="absolute top-4 right-4 z-10 bg-space-black/75 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded text-[8px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SYSTEM READY
                </div>

                <div className="absolute bottom-16 left-4 right-4 z-10 text-left">
                  <span className="text-[9px] font-bold text-rocket-orange uppercase tracking-wider block">LAUNCH OPERATOR</span>
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{activeRocket.manufacturer}</span>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1"><Award size={10} className="text-neon-cyan" /> {activeRocket.successRate}% Success</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1"><Orbit size={10} /> Active Staging</span>
                  </div>
                </div>

                {/* Micro-Interaction Indicator */}
                <div className="absolute bottom-20 right-4 z-10">
                  <span className="text-[8px] text-slate-400 font-mono tracking-widest bg-space-black/90 border border-white/10 px-2 py-1 rounded flex items-center gap-1 animate-pulse">
                    <Info size={10} className="text-neon-cyan" /> SCAN CHASSIS (HOVER)
                  </span>
                </div>
              </div>
            }
            back={
              <div className="relative w-full h-full bg-nebula-navy border border-rocket-orange/30 rounded-lg overflow-hidden p-6 text-left flex flex-col justify-between shadow-2xl scanlines">
                <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

                {/* Back Header */}
                <div className="flex justify-between items-start border-b border-white/10 pb-3 z-10">
                  <div>
                    <span className="text-[8px] text-rocket-orange font-bold tracking-widest uppercase">COCKPIT ENGINE TELEMETRY</span>
                    <h4 className="text-lg font-bold font-display text-white">{activeRocket.name} CORE</h4>
                  </div>
                  <span className="text-[8px] font-mono border border-rocket-orange/50 px-2 py-0.5 rounded text-rocket-orange animate-pulse">DIAGNOSTIC STATUS // ONLINE</span>
                </div>

                {/* Custom glowing cockpit gauges */}
                <div className="grid grid-cols-2 gap-4 py-4 z-10 flex-1">
                  {/* Gauge 1: Thrust */}
                  <div className="bg-space-black/60 border border-white/5 rounded p-3 flex flex-col justify-between hover:border-rocket-orange/20 transition-all duration-300">
                    <div>
                      <span className="text-[8px] text-slate-500 block uppercase font-mono">THRUST CAPABILITY</span>
                      <span className="text-sm font-bold text-white mt-1 block tabular-nums">{activeRocket.thrust}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[8px] text-slate-500 mb-1">
                        <span>LOAD</span>
                        <span>{getThrustPercent(activeRocket.thrust)}%</span>
                      </div>
                      <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-rocket-orange to-neon-cyan h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${getThrustPercent(activeRocket.thrust)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gauge 2: Height */}
                  <div className="bg-space-black/60 border border-white/5 rounded p-3 flex flex-col justify-between hover:border-rocket-orange/20 transition-all duration-300">
                    <div>
                      <span className="text-[8px] text-slate-500 block uppercase font-mono">VEHICLE HEIGHT</span>
                      <span className="text-sm font-bold text-white mt-1 block tabular-nums">{activeRocket.height}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[8px] text-slate-500 mb-1">
                        <span>SCALE</span>
                        <span>{getHeightPercent(activeRocket.height)}%</span>
                      </div>
                      <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-rocket-orange to-neon-cyan h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${getHeightPercent(activeRocket.height)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gauge 3: Mass */}
                  <div className="bg-space-black/60 border border-white/5 rounded p-3 flex flex-col justify-between hover:border-rocket-orange/20 transition-all duration-300">
                    <div>
                      <span className="text-[8px] text-slate-500 block uppercase font-mono">LIFT MASS</span>
                      <span className="text-sm font-bold text-white mt-1 block truncate tabular-nums">{activeRocket.mass}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[8px] text-slate-500 mb-1">
                        <span>MASS</span>
                        <span>{getMassPercent(activeRocket.mass)}%</span>
                      </div>
                      <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-rocket-orange to-neon-cyan h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${getMassPercent(activeRocket.mass)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gauge 4: Payload */}
                  <div className="bg-space-black/60 border border-white/5 rounded p-3 flex flex-col justify-between hover:border-rocket-orange/20 transition-all duration-300">
                    <div>
                      <span className="text-[8px] text-slate-500 block uppercase font-mono">PAYLOAD LEO</span>
                      <span className="text-sm font-bold text-white mt-1 block truncate tabular-nums">{activeRocket.payloadLeo}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[8px] text-slate-500 mb-1">
                        <span>VOLUME</span>
                        <span>{getPayloadPercent(activeRocket.payloadLeo)}%</span>
                      </div>
                      <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-rocket-orange to-neon-cyan h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${getPayloadPercent(activeRocket.payloadLeo)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Footer */}
                <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[8px] text-slate-400 z-10 font-mono">
                  <span className="truncate max-w-[180px]">PROP: {activeRocket.propellant.split('/')[0]}</span>
                  <span className="text-rocket-orange font-bold uppercase">STAGES: {activeRocket.stages}</span>
                </div>
              </div>
            }
          />

          {/* Navigation Overlay Buttons (Absolute positioned above card) */}
          <div className="absolute inset-x-4 bottom-4 flex justify-between items-center z-30 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Avoid triggering card flip on click
                handlePrev();
              }}
              className="p-2 bg-space-black/80 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan/30 rounded text-slate-300 hover:text-neon-cyan transition-all pointer-events-auto cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[9px] bg-space-black/90 px-3 py-1 rounded border border-white/10 text-slate-300 uppercase tracking-widest font-mono pointer-events-auto">
              {activeRocket.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Avoid triggering card flip on click
                handleNext();
              }}
              className="p-2 bg-space-black/80 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan/30 rounded text-slate-300 hover:text-neon-cyan transition-all pointer-events-auto cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: Engineering specs HUD Panel (col-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRocket.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-cyber-slate/20 border border-neon-cyan/20 backdrop-blur-md p-6 rounded-lg relative overflow-hidden scanlines flex-1"
            >
              {/* Top metadata tags */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight font-display">{activeRocket.name}</h3>
                  <span className="text-[9px] text-slate-500 block uppercase mt-0.5">MANUFACTURER: {activeRocket.manufacturer}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase">SUCCESS RATING</span>
                  <span className="text-sm font-bold text-emerald-400 font-display tabular-nums mt-0.5">{activeRocket.successRate}%</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-6">
                {activeRocket.description}
              </p>

              {/* Specifications HUD Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">HEIGHT</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block tabular-nums">{activeRocket.height}</span>
                </div>
                <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">DIAMETER</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block tabular-nums">{activeRocket.diameter}</span>
                </div>
                <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">LIFT MASS</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block truncate tabular-nums">{activeRocket.mass}</span>
                </div>
                <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">PROPULSION THRUST</span>
                  <span className="text-sm font-bold text-neon-cyan mt-1 block tabular-nums">{activeRocket.thrust}</span>
                </div>
                <div className="bg-space-black/55 p-3 border border-white/5 rounded col-span-1 sm:col-span-2">
                  <span className="text-[9px] text-slate-500 block uppercase">PAYLOAD TO LEO</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block truncate tabular-nums">{activeRocket.payloadLeo}</span>
                </div>
              </div>

              {/* Extra specifications telemetry values */}
              <div className="border-t border-white/5 pt-4 text-[10px] text-slate-400 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1"><Gauge size={10} /> PROPELLANT TYPE</span>
                  <span className="text-slate-300 font-bold truncate max-w-xs">{activeRocket.propellant}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1"><Zap size={10} /> STAGING ARCHITECTURE</span>
                  <span className="text-slate-300 font-bold">{activeRocket.stages}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
