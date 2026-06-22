import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Hero from './components/Hero';
import Stats from './components/Stats';
import UpcomingLaunches from './components/UpcomingLaunches';
import Globe3D from './components/Globe3D';
import Timeline from './components/Timeline';
import RocketGallery from './components/RocketGallery';
import LaunchHistory from './components/LaunchHistory';
import SearchOverlay from './components/SearchOverlay';
import ConsoleModal from './components/ConsoleModal';
import ShaderBackground from './components/ShaderBackground';
import { Search, Radio } from 'lucide-react';
import { UPCOMING_LAUNCHES } from './data/mockLaunchData';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeLaunch, setActiveLaunch] = useState(
    UPCOMING_LAUNCHES.reduce((prev, curr) => {
      return new Date(curr.launchDate) < new Date(prev.launchDate) ? curr : prev;
    })
  );
  const [centerView, setCenterView] = useState('globe'); // 'globe' | 'console'
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'rockets' | 'history' | 'timeline'
  const [aborted, setAborted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock effect
  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  const formatUTC = (date) => {
    return date.toUTCString().replace('GMT', 'UTC').split(' ').slice(4, 5).join('');
  };

  const handleSelectLaunch = (launch) => {
    setActiveLaunch(launch);
    setCenterView('console');
  };

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className={`relative bg-[#020204] text-slate-100 h-screen overflow-hidden flex flex-col selection:bg-orange-500/30 selection:text-white transition-all duration-500 ${
      aborted ? 'animate-shake animate-pulse-red' : ''
    }`}>
      {/* Interactive WebGL Shader Background underlay */}
      <ShaderBackground />

      {/* Dark overlay to ensure perfect readability of text */}
      <div className="fixed inset-0 bg-[#020204]/35 pointer-events-none z-0" />

      {/* HUD HEADER */}
      <header className="relative z-10 h-14 bg-space-black/80 border-b border-white/10 flex items-center justify-between px-6 select-none shrink-0 backdrop-blur-md">
        {/* Brand */}
        <div className="flex items-center gap-2 text-left">
          <Radio size={14} className="text-neon-cyan animate-pulse" />
          <h1 className="text-xs font-black font-display tracking-widest text-white uppercase flex items-center gap-1.5">
            OBSIDIAN <span className="text-neon-cyan drop-shadow-[0_0_8px_rgba(255,158,0,0.3)]">HUNT</span> // MISSION CONTROL
          </h1>
        </div>

        {/* Global HUD Status Indicators */}
        <div className="hidden md:flex items-center gap-6 text-[9px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>GND: OK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>COMMS: ACTV</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${aborted ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
            <span className={aborted ? 'text-rose-400' : ''}>
              {aborted ? 'ABORT_ALERT' : 'STATUS: NOMINAL'}
            </span>
          </div>
        </div>

        {/* Right Header Side (Clock & Search) */}
        <div className="flex items-center gap-4">
          {/* UTC Clock */}
          <div className="text-xs font-bold text-slate-200 font-mono tracking-wider">
            UTC {formatUTC(currentTime)}
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded font-mono text-[9px] text-slate-300 hover:text-white cursor-pointer transition-all"
          >
            <Search size={10} />
            <span>SEARCH [⌘K]</span>
          </button>
        </div>
      </header>

      {/* MAIN HUD CONTAINER */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-h-0 overflow-y-auto lg:overflow-hidden select-none">
        
        {/* LEFT COLUMN: Telemetry Controls & Stats (col-span-3) */}
        <section className="lg:col-span-3 h-full flex flex-col gap-4 min-h-0">
          <div className="flex-1 bg-cyber-slate/10 border border-white/10 rounded-lg p-4 backdrop-blur-md overflow-y-auto min-h-0">
            <Hero isWidget={true} />
          </div>
          <div className="bg-cyber-slate/10 border border-white/10 rounded-lg p-4 backdrop-blur-md shrink-0">
            <Stats isWidget={true} />
          </div>
        </section>

        {/* CENTER COLUMN: Interactive Globe / Console (col-span-6) */}
        <section className="lg:col-span-6 h-full flex flex-col gap-4 min-h-0">
          {/* Views Toggler Header */}
          <div className="bg-space-black/70 border border-white/10 rounded-lg p-2.5 flex items-center justify-between shrink-0 backdrop-blur-md">
            <div className="text-left">
              <span className="text-[8px] text-slate-500 block uppercase">CENTER RADAR CONSOLE</span>
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1 mt-0.5 animate-fade-in">
                {centerView === 'globe' ? (
                  <>🌐 EARTH ORBITAL GRID</>
                ) : (
                  <>🕹️ {activeLaunch?.missionName} TELEMETRY CORE</>
                )}
              </span>
            </div>

            {/* Toggle buttons */}
            <div className="flex gap-1.5">
              <button
                onClick={() => setCenterView('globe')}
                className={`px-3 py-1.5 border text-[9px] font-bold font-mono rounded cursor-pointer transition-all ${
                  centerView === 'globe'
                    ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                }`}
              >
                ORBITAL RADAR
              </button>
              {activeLaunch && (
                <button
                  onClick={() => setCenterView('console')}
                  className={`px-3 py-1.5 border text-[9px] font-bold font-mono rounded cursor-pointer transition-all ${
                    centerView === 'console'
                      ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  FLIGHT DIRECTORS DESK
                </button>
              )}
            </div>
          </div>

          {/* View Container */}
          <div className="flex-1 min-h-0 relative">
            {centerView === 'globe' ? (
              <div className="w-full h-full bg-cyber-slate/10 border border-white/10 rounded-lg p-4 backdrop-blur-md overflow-hidden">
                <Globe3D isWidget={true} />
              </div>
            ) : (
              activeLaunch && (
                <ConsoleModal
                  isInline={true}
                  launch={activeLaunch}
                  onClose={() => setCenterView('globe')}
                  onAbortStateChange={(val) => setAborted(val)}
                />
              )
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Tabbed Listings (col-span-3) */}
        <section className="lg:col-span-3 h-full flex flex-col gap-4 min-h-0">
          {/* Tab Selection Header */}
          <div className="bg-space-black/70 border border-white/10 rounded-lg p-1.5 flex items-center justify-between shrink-0 backdrop-blur-md">
            {['upcoming', 'rockets', 'history', 'timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center py-1.5 border border-transparent text-[8px] font-bold font-mono uppercase rounded cursor-pointer transition-all ${
                  activeTab === tab
                    ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20 glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'history' ? 'logs' : tab === 'timeline' ? 'milestones' : tab}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="flex-1 bg-cyber-slate/10 border border-white/10 rounded-lg p-4 backdrop-blur-md overflow-hidden min-h-0 flex flex-col">
            {activeTab === 'upcoming' && (
              <UpcomingLaunches 
                isWidget={true} 
                onSelectLaunch={handleSelectLaunch} 
              />
            )}
            {activeTab === 'rockets' && (
              <RocketGallery isWidget={true} />
            )}
            {activeTab === 'history' && (
              <LaunchHistory 
                isWidget={true} 
                onSelectLaunch={handleSelectLaunch} 
              />
            )}
            {activeTab === 'timeline' && (
              <Timeline 
                isWidget={true} 
                onSelectLaunch={handleSelectLaunch} 
              />
            )}
          </div>
        </section>
      </main>

      {/* Spotlight command search overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectLaunch={handleSelectLaunch}
      />
    </div>
  );
}
