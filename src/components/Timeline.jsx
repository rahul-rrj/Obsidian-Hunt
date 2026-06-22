import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, Calendar, Zap, Clock, Orbit, Target, ArrowRight, Link } from 'lucide-react';
import { UPCOMING_LAUNCHES } from '../data/mockLaunchData';

export default function Timeline({ onSelectLaunch, isWidget = false }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState({});
  const [activeNodeId, setActiveNodeId] = useState(null);
  
  const containerRef = useRef(null);
  const orbitRef = useRef(null);

  // Parse and map launches into timeline data structure
  const sortedLaunches = [...UPCOMING_LAUNCHES].sort(
    (a, b) => new Date(a.launchDate) - new Date(b.launchDate)
  );

  const timelineData = sortedLaunches.map((launch, idx) => {
    return {
      id: idx + 1,
      originalId: launch.id,
      title: launch.missionName,
      rocketName: launch.rocketName,
      date: new Date(launch.launchDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      content: launch.description,
      launchSite: launch.launchSite,
      targetOrbit: launch.targetOrbit,
      energy: launch.payloadMass ? Math.min(100, Math.round((launch.payloadMass / 22800) * 100)) : 80,
      status: idx === 0 ? 'in-progress' : idx < 3 ? 'completed' : 'pending',
      icon: idx % 3 === 0 ? Orbit : idx % 3 === 1 ? Target : Compass,
      relatedIds: []
    };
  });

  // Populate relatedIds based on sharing the same rocket type
  timelineData.forEach((item) => {
    const related = timelineData
      .filter((l) => l.rocketName === item.rocketName && l.id !== item.id)
      .map((l) => l.id);
    item.relatedIds = related;
  });

  const handleContainerClick = (e) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const currentItem = timelineData.find((item) => item.id === id);
        const relatedItems = currentItem ? currentItem.relatedIds : [];
        const newPulseEffect = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);
        if (!isWidget) centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  // Auto rotation loop using requestAnimationFrame for butter-smooth animation
  useEffect(() => {
    if (!autoRotate || isWidget) return;

    let animationFrameId;
    let lastTime = performance.now();

    const updateRotation = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      // Speed of rotation: approx 4 degrees per second (4 / 1000 = 0.004 degrees per ms)
      const speed = 0.004 * delta;

      setRotationAngle((prev) => (prev + speed) % 360);
      animationFrameId = requestAnimationFrame(updateRotation);
    };

    animationFrameId = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animationFrameId);
  }, [autoRotate]);

  const centerViewOnNode = (nodeId) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  // responsive layout parameters
  const [dimensions, setDimensions] = useState({
    radius: typeof window !== 'undefined' && window.innerWidth < 768 ? 125 : 185,
    size: typeof window !== 'undefined' && window.innerWidth < 768 ? 320 : 500
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        radius: window.innerWidth < 768 ? 125 : 185,
        size: window.innerWidth < 768 ? 320 : 500
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;

    const x = dimensions.radius * Math.cos(radian);
    const y = dimensions.radius * Math.sin(radian);

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.35,
      Math.min(1, 0.35 + 0.65 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'in-progress':
        return 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 animate-pulse';
      case 'pending':
        return 'bg-neutral-800 text-slate-400 border border-white/5';
      default:
        return 'bg-neutral-800 text-slate-400 border border-white/5';
    }
  };

  if (isWidget) {
    return (
      <div className="w-full h-full flex flex-col min-h-0 select-none font-mono">
        <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest">
          MISSION MILESTONE NODES
        </div>
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 min-h-0">
          {timelineData.map((item) => {
            const isExpanded = expandedItems[item.id];
            const Icon = item.icon;
            
            return (
              <div 
                key={item.id}
                className={`p-3 border rounded-lg transition-all duration-300 text-left ${
                  isExpanded 
                    ? 'bg-neon-cyan/5 border-neon-cyan/30 shadow-[0_0_15px_rgba(255,158,0,0.06)]' 
                    : 'bg-space-black/40 border-white/5 hover:border-white/10'
                }`}
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <div className={`p-1.5 rounded ${isExpanded ? 'bg-neon-cyan text-space-black' : 'bg-white/5 text-slate-400'}`}>
                      <Icon size={12} />
                    </div>
                    <span className="text-xs font-bold text-slate-200 truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${getStatusBadgeStyles(item.status)}`}>
                      {item.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 border-t border-white/5 pt-2 text-[10px] text-slate-400 overflow-hidden"
                  >
                    <p className="font-sans leading-relaxed mb-3">{item.content}</p>
                    <div className="flex flex-col gap-1 text-[9px] bg-space-black/55 p-2 rounded border border-white/5">
                      <div className="flex justify-between">
                        <span>LAUNCH SITE</span>
                        <span className="text-slate-200">{item.launchSite.split(',')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ORBIT DEPOT</span>
                        <span className="text-slate-200">{item.targetOrbit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VEHICLE</span>
                        <span className="text-neon-cyan">{item.rocketName}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const originalLaunch = sortedLaunches.find((l) => l.id === item.originalId);
                        if (originalLaunch) onSelectLaunch(originalLaunch);
                      }}
                      className="w-full mt-3 py-1 bg-neon-cyan hover:bg-neon-cyan/90 text-space-black font-extrabold text-[10px] rounded transition-all text-center flex items-center justify-center gap-1 cursor-pointer glow-cyan"
                    >
                      <Compass size={10} /> ACCESS FLIGHT DESK
                    </button>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section 
      id="timeline" 
      className="py-24 px-6 border-b border-white/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[700px]"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-10 relative z-20 pointer-events-none select-none">
        <div className="text-[10px] text-rocket-orange font-bold tracking-widest uppercase mb-1">
          TRAJECTORY ANALYSIS & SCHEDULE
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-display text-white uppercase">
          RADIAL ORBITAL TIMELINE
        </h2>
        <div className="h-[1px] w-20 bg-neon-cyan mx-auto mt-4 shadow-[0_0_8px_rgba(255,158,0,0.8)]" />
      </div>

      {/* Orbit Visualization */}
      <div 
        className="relative flex items-center justify-center z-10 select-none"
        style={{
          width: `${dimensions.size}px`,
          height: `${dimensions.size}px`
        }}
      >
        <div
          ref={orbitRef}
          className="absolute w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
          style={{ perspective: '1000px' }}
        >
          {/* Central Sun/Glow Core representing Mission Control */}
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-rocket-orange via-neon-cyan to-amber-500 animate-pulse flex items-center justify-center z-10 shadow-[0_0_50px_rgba(255,158,0,0.25)] border border-neon-cyan/20">
            <div className="absolute inset-[-10px] rounded-full border border-white/10 animate-ping opacity-20" />
            <div className="absolute inset-[-20px] rounded-full border border-white/5 animate-ping opacity-10" style={{ animationDelay: '0.4s' }} />
            <div className="w-10 h-10 rounded-full bg-[#020204]/90 flex items-center justify-center border border-white/10">
              <Clock size={16} className="text-neon-cyan animate-pulse" />
            </div>
          </div>

          {/* Dotted Radial Orbit Track */}
          <div 
            className="absolute rounded-full border border-dashed border-white/10"
            style={{
              width: `${dimensions.radius * 2}px`,
              height: `${dimensions.radius * 2}px`
            }}
          />

          {/* Render Orbiting Launches */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 100 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity
            };

            return (
              <div
                key={item.id}
                className={`absolute ${autoRotate ? 'transition-none' : 'transition-all duration-700 ease-out'}`}
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Node Glow Halo */}
                <div
                  className={`absolute rounded-full -inset-3 transition-opacity ${
                    isPulsing ? 'animate-pulse opacity-100' : 'opacity-0 hover:opacity-40'
                  }`}
                  style={{
                    background: 'radial-gradient(circle, rgba(255,158,0,0.15) 0%, transparent 70%)',
                    width: `${item.energy * 0.4 + 48}px`,
                    height: `${item.energy * 0.4 + 48}px`,
                    left: `-${(item.energy * 0.4 + 48 - 36) / 2}px`,
                    top: `-${(item.energy * 0.4 + 48 - 36) / 2}px`
                  }}
                />

                {/* Main Interactive Button Node */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border cursor-pointer transition-all duration-300 ${
                    isExpanded
                      ? 'bg-neon-cyan text-space-black border-white shadow-[0_0_20px_rgba(255,158,0,0.5)] scale-125'
                      : isPulsing
                      ? 'bg-rocket-orange/20 border-rocket-orange text-rocket-orange animate-pulse scale-110'
                      : 'bg-[#020204] border-white/20 text-slate-400 hover:text-white hover:border-white/40'
                  }`}
                >
                  <Icon size={14} className={isExpanded ? 'animate-spin-slow' : ''} />
                </div>

                {/* Node Title Label */}
                <div
                  className={`absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold tracking-widest transition-all duration-300 pointer-events-none uppercase ${
                    isExpanded ? 'text-neon-cyan scale-110 font-black' : 'text-slate-500'
                  }`}
                >
                  {item.title.split(' ')[0]}
                </div>

                {/* Detail Card Overlay */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute top-14 left-1/2 -translate-x-1/2 w-64 bg-neutral-950/95 border border-neon-cyan/30 backdrop-blur-md p-4 rounded shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-left z-50 font-mono scanlines"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Anchor line */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-neon-cyan/40" />
                    
                    <div className="flex items-center justify-between text-[9px] border-b border-white/10 pb-2 mb-2">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${getStatusBadgeStyles(item.status)}`}>
                        {item.status.replace('-', ' ')}
                      </span>
                      <span className="text-slate-400">{item.date}</span>
                    </div>

                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">
                      {item.title}
                    </h4>

                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed mb-4">
                      {item.content}
                    </p>

                    {/* Specifications */}
                    <div className="bg-space-black/55 p-2.5 rounded border border-white/5 text-[9px] text-slate-400 flex flex-col gap-1.5 mb-4">
                      <div className="flex justify-between">
                        <span>LAUNCH_SITE</span>
                        <span className="text-white">{item.launchSite.split(',')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TARGET_ORBIT</span>
                        <span className="text-white">{item.targetOrbit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VEHICLE</span>
                        <span className="text-neon-cyan">{item.rocketName}</span>
                      </div>
                    </div>

                    {/* Energy/Payload indicators */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[9px] text-slate-500 mb-1">
                        <span className="flex items-center gap-1"><Zap size={9} /> PAYLOAD RATING</span>
                        <span className="font-bold text-white">{item.energy}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rocket-orange to-neon-cyan"
                          style={{ width: `${item.energy}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer Call Actions */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                      {item.relatedIds.length > 0 && (
                        <div className="flex flex-col gap-1 text-[8px] text-slate-500">
                          <span className="flex items-center gap-0.5"><Link size={8} /> CONNECTED FLIGHTS</span>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relId) => {
                              const relatedItem = timelineData.find((l) => l.id === relId);
                              return (
                                <button
                                  key={relId}
                                  onClick={() => toggleItem(relId)}
                                  className="px-1.5 py-0.5 bg-neutral-900 border border-white/10 hover:border-neon-cyan/40 text-slate-300 hover:text-white rounded text-[8px] flex items-center gap-0.5 cursor-pointer"
                                >
                                  {relatedItem?.title.split(' ')[0]} <ArrowRight size={6} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={() => {
                          const originalLaunch = sortedLaunches.find((l) => l.id === item.originalId);
                          if (originalLaunch) onSelectLaunch(originalLaunch);
                        }}
                        className="w-full py-1.5 bg-neon-cyan hover:bg-neon-cyan/90 text-space-black font-extrabold text-[10px] rounded transition-all text-center flex items-center justify-center gap-1 glow-cyan cursor-pointer mt-1"
                      >
                        <Compass size={10} /> ACCESS FLIGHT DESK
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
