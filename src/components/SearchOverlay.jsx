import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar, Rocket, History, Globe } from 'lucide-react';
import { UPCOMING_LAUNCHES, HISTORICAL_LAUNCHES, ROCKETS } from '../data/mockLaunchData';

export default function SearchOverlay({ isOpen, onClose, onSelectLaunch }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Filter items
  const filteredUpcoming = query
    ? UPCOMING_LAUNCHES.filter(l => 
        l.missionName.toLowerCase().includes(query.toLowerCase()) ||
        l.rocketName.toLowerCase().includes(query.toLowerCase()) ||
        l.launchSite.toLowerCase().includes(query.toLowerCase())
      )
    : UPCOMING_LAUNCHES.slice(0, 3);

  const filteredHistory = query
    ? HISTORICAL_LAUNCHES.filter(l => 
        l.missionName.toLowerCase().includes(query.toLowerCase()) ||
        l.rocketName.toLowerCase().includes(query.toLowerCase()) ||
        l.launchSite.toLowerCase().includes(query.toLowerCase())
      )
    : HISTORICAL_LAUNCHES.slice(0, 3);

  const filteredRockets = query
    ? ROCKETS.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(query.toLowerCase())
      )
    : ROCKETS.slice(0, 2);

  const hasResults = filteredUpcoming.length > 0 || filteredHistory.length > 0 || filteredRockets.length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 font-mono select-none">
        {/* Glass backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020204]/80 backdrop-blur-sm"
        />

        {/* Search Modal Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-cyber-slate/90 border border-neon-cyan/20 backdrop-blur-xl rounded-lg shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden relative z-10"
        >
          {/* Input Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-space-black/50">
            <Search className="text-neon-cyan/60 shrink-0" size={20} />
            <input 
              ref={inputRef}
              type="text"
              placeholder="Search missions, rockets, launch sites..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
            />
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-neon-cyan transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Results Lists */}
          <div className="max-h-[350px] overflow-y-auto p-4 flex flex-col gap-5">
            {/* Upcoming Section */}
            {filteredUpcoming.length > 0 && (
              <div>
                <div className="text-[10px] text-neon-cyan/50 font-bold uppercase tracking-wider mb-2">
                  Upcoming Missions
                </div>
                <div className="flex flex-col gap-1">
                  {filteredUpcoming.map((launch) => (
                    <button
                      key={launch.id}
                      onClick={() => {
                        onSelectLaunch(launch);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded hover:bg-neon-cyan/10 border border-transparent hover:border-neon-cyan/20 transition-all flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar size={14} className="text-neon-cyan" />
                        <div>
                          <div className="font-semibold text-slate-100">{launch.missionName}</div>
                          <div className="text-[10px] text-slate-400">{launch.rocketName} • {launch.launchSite}</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 px-2 py-0.5 rounded uppercase">
                        {launch.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Historical Section */}
            {filteredHistory.length > 0 && (
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                  Historical Records
                </div>
                <div className="flex flex-col gap-1">
                  {filteredHistory.map((launch) => (
                    <button
                      key={launch.id}
                      onClick={() => {
                        // Create a formatted launch detail object to open in modal
                        onSelectLaunch({
                          ...launch,
                          description: launch.details,
                          checklist: [
                            { id: '1', name: 'Liftoff', status: 'GO', desc: 'Successful Ascent' },
                            { id: '2', name: 'Stage Separation', status: 'GO', desc: 'Successful separation' },
                            { id: '3', name: 'Orbit Insertion', status: 'GO', desc: 'Mission accomplished' }
                          ],
                          telemetryData: [
                            { t: 0, speed: 0, altitude: 0 },
                            { t: 100, speed: 7800, altitude: 220 }
                          ]
                        });
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <History size={14} className="text-slate-400" />
                        <div>
                          <div className="font-semibold text-slate-200">{launch.missionName}</div>
                          <div className="text-[10px] text-slate-500">{launch.rocketName} • {launch.launchSite}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] border px-2 py-0.5 rounded uppercase ${
                        launch.status === 'SUCCESS' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {launch.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rockets Section */}
            {filteredRockets.length > 0 && (
              <div>
                <div className="text-[10px] text-rocket-orange/50 font-bold uppercase tracking-wider mb-2">
                  Launch Vehicles
                </div>
                <div className="flex flex-col gap-1">
                  {filteredRockets.map((rocket) => (
                    <button
                      key={rocket.id}
                      onClick={() => {
                        // Redirect or mock detail display
                        onSelectLaunch({
                          id: rocket.id,
                          missionName: `${rocket.name} Specifications`,
                          rocketName: rocket.name,
                          manufacturer: rocket.manufacturer,
                          launchSite: 'Multidirectional Pads',
                          launchDate: 'N/A - active fleet',
                          targetOrbit: `LEO: ${rocket.payloadLeo} | GTO: ${rocket.payloadGto}`,
                          payload: `Thrust: ${rocket.thrust} | Mass: ${rocket.mass}`,
                          status: 'ACTIVE',
                          image: rocket.image,
                          description: rocket.description,
                          checklist: [
                            { id: '1', name: 'Propellant: ' + rocket.propellant, status: 'GO', desc: 'Valid fuel parameters' },
                            { id: '2', name: 'Stages: ' + rocket.stages, status: 'GO', desc: 'Configuration load' },
                            { id: '3', name: 'Diameter: ' + rocket.diameter + ' | Height: ' + rocket.height, status: 'GO', desc: 'Structural specs' }
                          ],
                          telemetryData: [
                            { t: 0, speed: 0, altitude: 0 }
                          ]
                        });
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded hover:bg-rocket-orange/10 border border-transparent hover:border-rocket-orange/20 transition-all flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <Rocket size={14} className="text-rocket-orange" />
                        <div>
                          <div className="font-semibold text-slate-200">{rocket.name}</div>
                          <div className="text-[10px] text-slate-500">Fleet Class Heavy • {rocket.manufacturer}</div>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400">SPECS AVAILABLE</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!hasResults && (
              <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <span>NO DATA RECORDS MATCHING "{query}"</span>
                <span className="text-[10px] text-neon-cyan/50">SECURE RADAR RANGE CLEAR</span>
              </div>
            )}
          </div>

          {/* Footer controls hint */}
          <div className="bg-space-black/80 px-4 py-2 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500">
            <span>PRESS <kbd className="bg-white/5 px-1 py-0.5 rounded text-slate-400">ESC</kbd> TO CLOSE</span>
            <span className="text-neon-cyan/40">OBSIDIAN HUNT TELEMETRY DATABASE</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
