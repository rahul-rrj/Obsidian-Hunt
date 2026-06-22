import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle2, XCircle, ChevronRight, RefreshCw, Calendar } from 'lucide-react';
import { HISTORICAL_LAUNCHES } from '../data/mockLaunchData';

export default function LaunchHistory({ onSelectLaunch, isWidget = false }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, SUCCESS, FAILED

  // Handle row click
  const handleHistoryClick = (launch) => {
    onSelectLaunch({
      id: launch.id,
      missionName: launch.missionName,
      rocketName: launch.rocketName,
      manufacturer: launch.manufacturer,
      launchSite: launch.launchSite,
      launchDate: launch.launchDate,
      targetOrbit: 'Varies',
      payload: launch.payload,
      status: launch.status,
      image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=800&q=80', // standard fallback
      description: launch.details,
      checklist: [
        { id: '1', name: 'Liftoff Ignition', status: 'GO', desc: 'Engines stable' },
        { id: '2', name: 'Max Q Transition', status: 'GO', desc: 'Structural load green' },
        { id: '3', name: 'Stage 1 Shutdown', status: 'GO', desc: 'Separation confirmed' },
        { id: '4', name: 'Orbital Insertion', status: launch.status === 'SUCCESS' ? 'GO' : 'FAILED', desc: launch.details }
      ],
      telemetryData: [
        { t: 0, speed: 0, altitude: 0 },
        { t: 150, speed: 6500, altitude: 140 }
      ]
    });
  };

  // Filter launches
  const filteredLaunches = HISTORICAL_LAUNCHES.filter((launch) => {
    const matchesSearch = 
      launch.missionName.toLowerCase().includes(search.toLowerCase()) ||
      launch.rocketName.toLowerCase().includes(search.toLowerCase()) ||
      launch.launchSite.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = 
      filter === 'ALL' || 
      (filter === 'SUCCESS' && launch.status === 'SUCCESS') ||
      (filter === 'FAILED' && launch.status === 'FAILED');

    return matchesSearch && matchesFilter;
  });

  if (isWidget) {
    return (
      <div className="w-full h-full flex flex-col min-h-0 select-none font-mono">
        {/* Search and Filters */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="relative w-full flex items-center bg-space-black border border-white/10 rounded px-2.5 py-1 focus-within:border-neon-cyan/50 transition-colors">
            <Search size={12} className="text-slate-500 mr-2 shrink-0" />
            <input 
              type="text"
              placeholder="Search historical logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none text-[11px] focus:outline-none text-slate-200 placeholder-slate-600"
            />
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-500">
            <span>FILTER:</span>
            <div className="flex gap-1">
              {['ALL', 'SUCCESS', 'FAILED'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-2 py-0.5 border rounded transition-all cursor-pointer ${
                    filter === type
                      ? 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30'
                      : 'bg-space-black/50 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical scroll list of logs */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 border border-white/5 rounded bg-cyber-slate/10 p-2">
          {filteredLaunches.map((launch) => (
            <div
              key={launch.id}
              onClick={() => handleHistoryClick(launch)}
              className="p-2 border border-white/5 rounded bg-space-black/40 hover:bg-neon-cyan/5 hover:border-neon-cyan/20 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="text-left max-w-[70%]">
                <div className="text-[11px] font-bold text-slate-200 group-hover:text-neon-cyan truncate">
                  {launch.missionName}
                </div>
                <div className="text-[9px] text-slate-500 truncate mt-0.5">
                  {launch.rocketName} • {new Date(launch.launchDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[8px] border uppercase ${
                  launch.status === 'SUCCESS'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {launch.status}
                </span>
                <ChevronRight size={12} className="text-slate-600 group-hover:text-neon-cyan group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
          {filteredLaunches.length === 0 && (
            <div className="text-center text-[10px] text-slate-500 py-6">
              NO RECORDS LOGGED IN COORD
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section id="history" className="py-20 px-6 max-w-7xl mx-auto select-none border-b border-white/5 relative font-mono">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left relative z-10">
        <div>
          <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">
            ARCHIVAL TELEMETRY DATABASE
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white uppercase">
            LAUNCH HISTORY
          </h2>
        </div>
        <div className="text-slate-500 text-[10px] mt-2 md:mt-0">
          RECORDS LOGGED // TOTAL DEPLOYED: {HISTORICAL_LAUNCHES.length}
        </div>
      </div>

      {/* Filters HUD */}
      <div className="bg-cyber-slate/15 border border-white/10 rounded-t-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-center relative z-10 bg-space-black/40">
        {/* Search input */}
        <div className="relative w-full md:max-w-xs flex items-center bg-space-black border border-white/10 rounded px-3 py-1.5 focus-within:border-neon-cyan/50 transition-colors">
          <Search size={14} className="text-slate-500 mr-2 shrink-0" />
          <input 
            type="text"
            placeholder="Filter database..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none text-xs focus:outline-none text-slate-200 placeholder-slate-600"
          />
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto justify-end">
          <span className="text-[10px] text-slate-500 flex items-center gap-1"><Filter size={10} /> STREAM_FILTER:</span>
          {['ALL', 'SUCCESS', 'FAILED'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 border text-[10px] rounded transition-all cursor-pointer ${
                filter === type
                  ? 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30 shadow-[0_0_8px_rgba(255,158,0,0.1)]'
                  : 'bg-space-black/50 text-slate-400 border-white/10 hover:border-white/20'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table Database Renders */}
      <div className="bg-cyber-slate/5 border-x border-b border-white/10 rounded-b-lg overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-space-black/30 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              <th className="p-4">Mission name</th>
              <th className="p-4">Rocket</th>
              <th className="p-4">Launch Date</th>
              <th className="p-4">Launch Site</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLaunches.map((launch) => (
              <motion.tr
                key={launch.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleHistoryClick(launch)}
                className="hover:bg-neon-cyan/5 transition-colors cursor-pointer group"
              >
                {/* Mission Name */}
                <td className="p-4 font-bold text-slate-200 group-hover:text-neon-cyan transition-colors">
                  {launch.missionName}
                </td>
                
                {/* Rocket Class */}
                <td className="p-4 text-slate-400">
                  {launch.rocketName}
                </td>

                {/* Date */}
                <td className="p-4 text-slate-400">
                  {new Date(launch.launchDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>

                {/* Site */}
                <td className="p-4 text-slate-400 truncate max-w-[150px]">
                  {launch.launchSite.split(',')[0]}
                </td>

                {/* Status Badge */}
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] uppercase border ${
                    launch.status === 'SUCCESS'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {launch.status === 'SUCCESS' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                    {launch.status}
                  </span>
                </td>

                {/* Action button */}
                <td className="p-4 text-right">
                  <button className="text-slate-500 group-hover:text-neon-cyan transition-colors flex items-center gap-0.5 ml-auto">
                    REPORT <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </td>
              </motion.tr>
            ))}

            {filteredLaunches.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  NO HISTORICAL RECORDS FOUND IN GRID AZIMUTH
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
