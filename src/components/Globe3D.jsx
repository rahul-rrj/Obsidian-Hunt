import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { Globe, MapPin, Layers } from 'lucide-react';
import { LAUNCH_SITES } from '../data/mockLaunchData';

export default function Globe3D({ isWidget = false }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedSite, setSelectedSite] = useState(LAUNCH_SITES[0]); // Default to Kennedy Space Center
  const [hoveredSite, setHoveredSite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store parsed halftone dots in ref to avoid recalculation
  const dotsRef = useRef([]);
  const landFeaturesRef = useRef(null);
  const projectionRef = useRef(null);
  const rotationRef = useRef([0, -25]); // Initial rotation angles [longitude, latitude]

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Define responsive dimensions
    let width = container.clientWidth;
    let height = container.clientHeight || 450;
    let radius = Math.min(width, height) / 2.3;

    // Scale canvas for High-DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(dpr, dpr);

    // Initialize projection
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate(rotationRef.current);

    projectionRef.current = projection;

    const path = d3.geoPath().projection(projection).context(context);

    // Polygon inclusion helpers for halftone dots
    const pointInPolygon = (point, polygon) => {
      const [x, y] = point;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    };

    const pointInFeature = (point, feature) => {
      const geometry = feature.geometry;
      if (geometry.type === 'Polygon') {
        const coordinates = geometry.coordinates;
        if (!pointInPolygon(point, coordinates[0])) return false;
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false;
        }
        return true;
      } else if (geometry.type === 'MultiPolygon') {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) return true;
          }
        }
        return false;
      }
      return false;
    };

    const generateDotsInPolygon = (feature, dotSpacing = 16) => {
      const dots = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;

      // Density step size
      const stepSize = dotSpacing * 0.12;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point = [lng, lat];
          if (pointInFeature(point, feature)) {
            dots.push(point);
          }
        }
      }
      return dots;
    };

    let animationFrameId;
    let t = 0;

    const render = () => {
      t += 0.05;
      context.clearRect(0, 0, width, height);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;

      // Draw ocean space (Globe Base)
      context.beginPath();
      context.arc(width / 2, height / 2, currentScale, 0, 2 * Math.PI);
      context.fillStyle = '#020204'; // Ocean void color
      context.fill();

      // Outer atmosphere halo glow (glowing orange border ring)
      context.strokeStyle = 'rgba(255, 158, 0, 0.3)';
      context.lineWidth = 2.5 * scaleFactor;
      context.stroke();

      // Soft inner glow layer
      context.beginPath();
      context.arc(width / 2, height / 2, currentScale - 1, 0, 2 * Math.PI);
      context.strokeStyle = 'rgba(255, 64, 0, 0.15)';
      context.lineWidth = 5 * scaleFactor;
      context.stroke();

      if (landFeaturesRef.current) {
        // Draw graticule grid (Longitude/Latitude wireframe lines)
        const graticule = d3.geoGraticule()();
        context.beginPath();
        path(graticule);
        context.strokeStyle = 'rgba(255, 158, 0, 0.04)';
        context.lineWidth = 0.8 * scaleFactor;
        context.stroke();

        // Draw land border outlines
        context.beginPath();
        landFeaturesRef.current.features.forEach((feature) => {
          path(feature);
        });
        context.strokeStyle = 'rgba(255, 158, 0, 0.15)';
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        // Draw Dotted Land Mass (Halftone Points)
        context.fillStyle = 'rgba(255, 158, 0, 0.65)';
        dotsRef.current.forEach((dot) => {
          // Check visible front hemisphere projection bounds
          const projected = projection(dot);
          if (projected) {
            const [x, y] = projected;
            // Draw only if dot is inside the circular clipping radius
            const dist = Math.hypot(x - width / 2, y - height / 2);
            if (dist < currentScale) {
              context.beginPath();
              context.arc(x, y, 1.3 * scaleFactor, 0, 2 * Math.PI);
              context.fill();
            }
          }
        });
      }

      // Draw Launch Sites & Trajectory curves
      const center = [-projection.rotate()[0], -projection.rotate()[1]];
      
      LAUNCH_SITES.forEach((site) => {
        // Calculate geodesic distance to center to check hemisphere visibility
        const isVisible = d3.geoDistance([site.lng, site.lat], center) < Math.PI / 2;
        if (isVisible) {
          const projected = projection([site.lng, site.lat]);
          if (projected) {
            const [x, y] = projected;

            // Draw interactive glowing ring
            const pulse = 8 + Math.sin(t * 4) * 3;
            context.beginPath();
            context.arc(x, y, pulse, 0, 2 * Math.PI);
            context.fillStyle = site.id === 'starbase' ? 'rgba(255, 64, 0, 0.18)' : 'rgba(255, 158, 0, 0.15)';
            context.fill();

            // Draw pin core dot
            context.beginPath();
            context.arc(x, y, 3.5, 0, 2 * Math.PI);
            context.fillStyle = selectedSite.id === site.id
              ? '#ff4000'
              : site.id === 'starbase' ? '#ff4000' : '#ffa200';
            context.fill();

            // Draw text tag label
            context.fillStyle = selectedSite.id === site.id ? '#ffffff' : '#94a3b8';
            context.font = selectedSite.id === site.id ? 'bold 10px monospace' : '9px monospace';
            context.fillText(site.name.split(' ')[0], x + 8, y + 3);

            // Draw active geodesic trajectory curves emerging into orbit
            const destLng = site.lng + 30;
            const destLat = site.lat + 15;
            const pDest = projection([destLng, destLat]);

            if (pDest) {
              const dx = pDest[0] - x;
              const dy = pDest[1] - y;
              
              // Calculate normal vectors to bend the curve outwards
              const mx = (x + pDest[0]) / 2 - dy * 0.35;
              const my = (y + pDest[1]) / 2 + dx * 0.35;

              context.beginPath();
              context.moveTo(x, y);
              context.quadraticCurveTo(mx, my, pDest[0], pDest[1]);
              context.strokeStyle = selectedSite.id === site.id 
                ? 'rgba(255, 64, 0, 0.55)' 
                : 'rgba(255, 158, 0, 0.22)';
              context.lineWidth = selectedSite.id === site.id ? 2 : 1;
              context.stroke();

              // Draw terminal satellite/orbit node
              context.beginPath();
              context.arc(pDest[0], pDest[1], 1.8, 0, 2 * Math.PI);
              context.fillStyle = selectedSite.id === site.id ? '#ff4000' : '#ffa200';
              context.fill();
            }
          }
        }
      });
    };

    // Load geometry and generate land mas dots
    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json'
        );
        if (!response.ok) throw new Error('Geodesic datalink timeout');
        
        const landData = await response.json();
        landFeaturesRef.current = landData;

        // Generate landmass halftone dots
        const dots = [];
        landData.features.forEach((feature) => {
          const generated = generateDotsInPolygon(feature, 16);
          generated.forEach(([lng, lat]) => {
            dots.push([lng, lat]);
          });
        });

        dotsRef.current = dots;
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Geodesic connection failed');
        setIsLoading(false);
      }
    };

    // Auto-spin parameters
    let autoRotate = true;
    const rotationSpeed = 0.18;

    const autoSpin = () => {
      if (autoRotate) {
        rotationRef.current[0] += rotationSpeed;
        projection.rotate(rotationRef.current);
        render();
      }
      animationFrameId = requestAnimationFrame(autoSpin);
    };

    // Interactions
    const handleMouseDown = (event) => {
      autoRotate = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation = [...rotationRef.current];

      const handleMouseMove = (moveEvent) => {
        const sensitivity = 0.25;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        rotationRef.current[0] = startRotation[0] + dx * sensitivity;
        rotationRef.current[1] = Math.max(-60, Math.min(60, startRotation[1] - dy * sensitivity));

        projection.rotate(rotationRef.current);
        render();
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        // Resume auto-rotation after 2 seconds of inactivity
        setTimeout(() => {
          autoRotate = true;
        }, 2000);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    // Mouse wheel zoom
    const handleWheel = (event) => {
      event.preventDefault();
      const scaleFactor = event.deltaY > 0 ? 0.93 : 1.07;
      const newRadius = Math.max(radius * 0.4, Math.min(radius * 3.5, projection.scale() * scaleFactor));
      projection.scale(newRadius);
      render();
    };

    // Mouse hover coordinates checking
    const handleMouseMoveHover = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const center = [-projection.rotate()[0], -projection.rotate()[1]];
      let foundSite = null;

      LAUNCH_SITES.forEach((site) => {
        const isVisible = d3.geoDistance([site.lng, site.lat], center) < Math.PI / 2;
        if (isVisible) {
          const projected = projection([site.lng, site.lat]);
          if (projected) {
            const [x, y] = projected;
            const dist = Math.hypot(mouseX - x, mouseY - y);
            if (dist < 12) {
              foundSite = site;
            }
          }
        }
      });

      setHoveredSite(foundSite);
      canvas.style.cursor = foundSite ? 'pointer' : 'grab';
    };

    // Mouse click selection checking
    const handleCanvasClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      const center = [-projection.rotate()[0], -projection.rotate()[1]];
      let clickedSite = null;
      let minDistance = 14;

      LAUNCH_SITES.forEach((site) => {
        const isVisible = d3.geoDistance([site.lng, site.lat], center) < Math.PI / 2;
        if (isVisible) {
          const projected = projection([site.lng, site.lat]);
          if (projected) {
            const [x, y] = projected;
            const dist = Math.hypot(clickX - x, clickY - y);
            if (dist < minDistance) {
              minDistance = dist;
              clickedSite = site;
            }
          }
        }
      });

      if (clickedSite) {
        setSelectedSite(clickedSite);
      }
    };

    // Resize Handler
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight || 450;
      radius = Math.min(width, height) / 2.3;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.scale(dpr, dpr);

      projection.scale(radius).translate([width / 2, height / 2]);
      render();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousemove', handleMouseMoveHover);
    canvas.addEventListener('click', handleCanvasClick);
    window.addEventListener('resize', handleResize);

    // Initial sequence
    loadWorldData().then(() => {
      autoSpin();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousemove', handleMouseMoveHover);
      canvas.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isWidget) {
    return (
      <div className="w-full h-full flex flex-col min-h-0 select-none font-mono">
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left Side: Globe Canvas Container (col-span-7) */}
          <div 
            ref={containerRef}
            className="col-span-1 lg:col-span-7 bg-space-black/45 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center relative min-h-0"
          >
            {/* Header readout */}
            <div className="absolute top-3 left-3 text-[9px] text-slate-500 font-mono flex items-center gap-1.5 z-20">
              <Globe size={10} className="text-neon-cyan animate-pulse" />
              <span>DRAG ROTATE // SCROLL ZOOM</span>
            </div>

            {isLoading && (
              <div className="absolute inset-0 bg-[#020204]/90 flex flex-col items-center justify-center text-[10px] font-mono text-neon-cyan z-20">
                <div className="animate-spin h-4 w-4 border-2 border-neon-cyan border-t-transparent rounded-full mb-2" />
                <span>LINKING GEODESIC...</span>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 bg-[#020204]/90 flex flex-col items-center justify-center text-[10px] font-mono text-rose-400 p-2 text-center z-20">
                <span>ERROR: {error}</span>
              </div>
            )}

            {/* Interactive Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing z-10"
            />

            {/* Floating Hover HUD Tooltip */}
            {hoveredSite && (
              <div 
                className="absolute top-3 right-3 bg-cyber-slate/90 border border-neon-cyan/30 text-white font-mono text-[8px] px-2 py-1 rounded shadow-lg pointer-events-none z-30"
              >
                <div className="font-bold uppercase text-neon-cyan">{hoveredSite.name}</div>
                <div className="text-slate-400 mt-0.5">{hoveredSite.location}</div>
              </div>
            )}
          </div>

          {/* Right Side: Site Info details HUD (col-span-5) */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-3 text-left font-mono min-h-0">
            <div className="flex flex-col gap-1.5 shrink-0">
              <span className="text-[9px] text-slate-500 uppercase font-bold">SELECT DATA STREAM:</span>
              <div className="flex flex-wrap gap-1">
                {LAUNCH_SITES.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className={`px-2 py-1 border text-[9px] rounded transition-all cursor-pointer ${
                      selectedSite.id === site.id
                        ? 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40 shadow-[0_0_8px_rgba(255,158,0,0.15)]'
                        : 'bg-cyber-slate/20 text-slate-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {site.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Site Data Card */}
            <motion.div
              key={selectedSite.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 bg-cyber-slate/25 border border-neon-cyan/20 backdrop-blur-md p-3.5 rounded-lg relative overflow-y-auto scanlines animate-fade-in-up flex flex-col justify-between gap-2.5 min-h-0"
            >
              {/* Corner glows */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-neon-cyan/5 rounded-full blur-xl pointer-events-none" />

              {/* Site Name and Location */}
              <div className="flex items-start justify-between border-b border-white/10 pb-2 shrink-0">
                <div className="max-w-[70%]">
                  <h3 className="text-xs font-bold text-white uppercase flex items-center gap-1 truncate">
                    <MapPin size={12} className="text-neon-cyan" /> {selectedSite.name}
                  </h3>
                  <span className="text-[9px] text-slate-400 mt-0.5 block truncate">{selectedSite.location}</span>
                </div>
                <span className={`text-[8px] px-1.5 py-0.5 rounded shrink-0 ${
                  selectedSite.status === 'GO'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse'
                }`}>
                  SYS_{selectedSite.status}
                </span>
              </div>

              {/* Main Stats of Site */}
              <div className="grid grid-cols-2 gap-2.5 shrink-0 text-[10px] text-slate-400">
                <div className="bg-space-black/55 p-2 border border-white/5 rounded">
                  <span className="text-[8px] text-slate-500 uppercase block">Success</span>
                  <span className="text-sm font-bold text-emerald-400 font-display tabular-nums">
                    {selectedSite.successRate}%
                  </span>
                </div>
                <div className="bg-space-black/55 p-2 border border-white/5 rounded">
                  <span className="text-[8px] text-slate-500 uppercase block">Launches</span>
                  <span className="text-sm font-bold text-slate-200 font-display tabular-nums">
                    {selectedSite.totalLaunches}
                  </span>
                </div>
              </div>

              {/* Description details */}
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed flex-1 overflow-y-auto">
                {selectedSite.description}
              </p>

              {/* Active scheduled missions */}
              <div className="border-t border-white/5 pt-2 text-[9px] shrink-0">
                <span className="text-slate-500 block mb-1 uppercase font-bold flex items-center gap-0.5">
                  <Layers size={9} className="text-neon-cyan" /> Active Manifests
                </span>
                <div className="flex flex-col gap-1">
                  {selectedSite.activeMissions.map((m, idx) => (
                    <div key={idx} className="bg-space-black/40 border border-white/5 p-1 rounded flex items-center justify-between text-slate-300">
                      <span>{m}</span>
                      <span className="text-neon-cyan/70 text-[7px] tracking-wider">ACTIVE FEED</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="globe" className="py-20 px-6 max-w-7xl mx-auto select-none border-b border-white/5 relative">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      {/* Title */}
      <div className="text-left mb-12 relative z-10">
        <div className="text-[10px] text-neon-cyan font-bold tracking-widest uppercase mb-1">
          GLOBAL REACH TELEMETRY
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-display text-white uppercase">
          INTERACTIVE DOTTED GLOBE
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Globe Canvas Container */}
        <div 
          ref={containerRef}
          className="col-span-1 lg:col-span-7 bg-space-black/45 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center relative min-h-[400px] md:min-h-[500px]"
        >
          {/* Header readout */}
          <div className="absolute top-4 left-4 text-[10px] text-slate-500 font-mono flex items-center gap-1.5 z-20">
            <Globe size={12} className="text-neon-cyan animate-pulse" />
            <span>DRAG GLOBE TO ROTATE • SCROLL TO ZOOM</span>
          </div>

          {isLoading && (
            <div className="absolute inset-0 bg-[#020204]/90 flex flex-col items-center justify-center text-xs font-mono text-neon-cyan z-20">
              <div className="animate-spin h-5 w-5 border-2 border-neon-cyan border-t-transparent rounded-full mb-3" />
              <span>ESTABLISHING GEODESIC LINK...</span>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-[#020204]/90 flex flex-col items-center justify-center text-xs font-mono text-rose-400 p-4 text-center z-20">
              <span>LINK ERROR: {error}</span>
            </div>
          )}

          {/* Interactive Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-[400px] md:h-[500px] cursor-grab active:cursor-grabbing z-10"
          />

          {/* Floating Hover HUD Tooltip */}
          {hoveredSite && (
            <div 
              className="absolute top-4 right-4 bg-cyber-slate/90 border border-neon-cyan/30 text-white font-mono text-[9px] px-2.5 py-1.5 rounded shadow-lg pointer-events-none z-30"
            >
              <div className="font-bold uppercase text-neon-cyan">{hoveredSite.name}</div>
              <div className="text-slate-400 mt-0.5">{hoveredSite.location}</div>
            </div>
          )}
        </div>

        {/* Right Side: Site Info details HUD */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-5 text-left font-mono">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-slate-500">SELECT DATA STREAM:</span>
            
            {/* Site selector buttons */}
            <div className="flex flex-wrap gap-2">
              {LAUNCH_SITES.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={`px-3 py-1.5 border text-xs rounded transition-all cursor-pointer ${
                    selectedSite.id === site.id
                      ? 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40 shadow-[0_0_10px_rgba(255,158,0,0.15)]'
                      : 'bg-cyber-slate/20 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {site.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Site Data Card */}
          <motion.div
            key={selectedSite.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-cyber-slate/25 border border-neon-cyan/20 backdrop-blur-md p-6 rounded-lg relative overflow-hidden scanlines animate-fade-in-up"
          >
            {/* Corner glows */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-neon-cyan/5 rounded-full blur-xl pointer-events-none" />

            {/* Site Name and Location */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                  <MapPin size={14} className="text-neon-cyan" /> {selectedSite.name}
                </h3>
                <span className="text-[10px] text-slate-400 mt-1 block">{selectedSite.location}</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded ${
                selectedSite.status === 'GO'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse'
              }`}>
                SYS_{selectedSite.status}
              </span>
            </div>

            {/* Main Stats of Site */}
            <div className="grid grid-cols-2 gap-4 mb-5 text-xs text-slate-400">
              <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                <span className="text-[9px] text-slate-500 uppercase block mb-1">Success Rate</span>
                <span className="text-lg font-bold text-emerald-400 font-display tabular-nums">
                  {selectedSite.successRate}%
                </span>
              </div>
              <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                <span className="text-[9px] text-slate-500 uppercase block mb-1">Total Launches</span>
                <span className="text-lg font-bold text-slate-200 font-display tabular-nums">
                  {selectedSite.totalLaunches}
                </span>
              </div>
            </div>

            {/* Description details */}
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-5">
              {selectedSite.description}
            </p>

            {/* Active scheduled missions */}
            <div className="border-t border-white/5 pt-4 text-[10px]">
              <span className="text-slate-500 block mb-2 uppercase font-bold flex items-center gap-1">
                <Layers size={10} className="text-neon-cyan" /> Active Manifests from pad
              </span>
              <div className="flex flex-col gap-1.5">
                {selectedSite.activeMissions.map((m, idx) => (
                  <div key={idx} className="bg-space-black/40 border border-white/5 p-2 rounded flex items-center justify-between text-slate-300">
                    <span>{m}</span>
                    <span className="text-neon-cyan/70 text-[8px]">ACTIVE TELEMETRY</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
