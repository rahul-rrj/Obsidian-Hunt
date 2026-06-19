import React, { useState, useEffect } from 'react';
import { Search, Compass, Terminal, ShieldCheck, Activity } from 'lucide-react';

export default function Navbar({ onSearchClick, activeSection, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());

  // Listen to scroll to apply blur effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update clock UTC time
  useEffect(() => {
    const clock = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  // Listen to keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearchClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchClick]);

  const navItems = [
    { label: 'Upcoming', id: 'upcoming' },
    { label: 'Featured', id: 'featured' },
    { label: 'Interactive Globe', id: 'globe' },
    { label: 'Timeline', id: 'timeline' },
    { label: 'Vehicles', id: 'rockets' },
    { label: 'Database', id: 'history' }
  ];

  const handleLinkClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 font-mono border-b ${
      scrolled 
        ? 'bg-space-black/75 backdrop-blur-xl border-neon-cyan/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3' 
        : 'bg-transparent border-transparent py-5'
    }`}>
      {/* Top micro-hud bar */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-[9px] text-slate-500 mb-2 select-none md:flex hidden">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Activity size={10} className="text-neon-cyan animate-pulse" /> NETWORK // SPACEX_CORE</span>
          <span>LATENCY // 24ms</span>
          <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-emerald-400" /> SECURE NODE // SSL_TRUE</span>
        </div>
        <div className="flex items-center gap-4">
          <span>TIME_REF_UTC // {time.toISOString().substring(11, 19)}</span>
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block" /> SYS_STATUS // GO
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Branding Logo */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
        >
          <div className="text-2xl filter drop-shadow-[0_0_8px_rgba(0,240,255,0.4)] group-hover:scale-110 transition-transform duration-300">🚀</div>
          <div>
            <div className="text-sm font-black tracking-widest text-slate-100 font-display">OBSIDIAN HUNT</div>
            <div className="text-[8px] text-neon-cyan/50 tracking-wider">MISSION COMMAND CENTER</div>
          </div>
        </button>

        {/* Center: Scroll Navigation Items */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`px-3 py-1.5 rounded border border-transparent transition-all hover:text-neon-cyan ${
                activeSection === item.id 
                  ? 'text-neon-cyan bg-neon-cyan/5 border-neon-cyan/20' 
                  : 'hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: Search Console Trigger */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onSearchClick}
            className="flex items-center gap-2.5 bg-cyber-slate/50 hover:bg-neon-cyan/10 border border-white/10 hover:border-neon-cyan/30 px-3 py-1.5 rounded text-xs text-slate-400 hover:text-neon-cyan transition-all"
          >
            <Search size={14} className="text-neon-cyan/70" />
            <span className="hidden sm:inline">Search Telemetry...</span>
            <kbd className="hidden sm:inline-block bg-white/5 px-1 py-0.5 rounded text-[9px] text-slate-500 border border-white/5">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </nav>
  );
}
