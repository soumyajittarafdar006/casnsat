import React, { useState, useEffect } from 'react';
import { Satellite, Radio, Settings2, Sliders, Maximize2, Minimize2, Clock, Edit2, Check } from 'lucide-react';

export function Header({ 
  isConnected, 
  isSimulating, 
  toggleSimulation, 
  onOpenEsp32Settings,
  onOpenDashboardSettings,
  title,
  subtitle,
  unit,
  onUpdateUnit,
  onUpdateTitles,
  connectionMode 
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [metSeconds, setMetSeconds] = useState(0);
  const [utcTime, setUtcTime] = useState('');
  
  // Inline Title Editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);
  const [editableSubtitle, setEditableSubtitle] = useState(subtitle);

  useEffect(() => {
    setEditableTitle(title);
    setEditableSubtitle(subtitle);
  }, [title, subtitle]);

  // Mission Elapsed Time (MET) Counter & UTC Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setMetSeconds((prev) => prev + 1);
      
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hrs}:${mins}:${secs} UTC`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatMet = (totalSecs) => {
    const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `T+${hrs}:${mins}:${secs}`;
  };

  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleSaveTitleInline = () => {
    setIsEditingTitle(false);
    if (onUpdateTitles) {
      onUpdateTitles(editableTitle, editableSubtitle);
    }
  };

  return (
    <header className="w-full glass-panel border-b border-cyan-500/30 bg-[#050914]/90 backdrop-blur-md sticky top-0 z-40 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: CanSat Aerospace Branding & MET Clock */}
        <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-950 via-slate-900 to-cyan-900 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.3)] group">
            <Satellite className="w-6 h-6 text-cyan-400 transform group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-cyan-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-cyan-400' : 'bg-rose-500'}`}></span>
            </span>
          </div>

          <div>
            {isEditingTitle ? (
              <div className="flex flex-col gap-1 my-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    className="bg-slate-950 border border-cyan-500 text-slate-100 px-2 py-0.5 rounded text-sm font-display font-bold font-mono focus:outline-none"
                    placeholder="Dashboard Title"
                  />
                  <button
                    onClick={handleSaveTitleInline}
                    className="p-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500"
                    title="Save title"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={editableSubtitle}
                  onChange={(e) => setEditableSubtitle(e.target.value)}
                  className="bg-slate-950 border border-cyan-500/50 text-cyan-300 px-2 py-0.5 rounded text-xs font-sans focus:outline-none"
                  placeholder="Dashboard Subtitle"
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                  <h1 className="text-lg sm:text-xl font-display font-black tracking-wider text-slate-100 uppercase flex items-center gap-2">
                    {title || 'CANSAT TEMPERATURE MONITORING SYSTEM'}
                  </h1>
                  <Edit2 className="w-3.5 h-3.5 text-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/90 border border-cyan-500/40 rounded shadow-[0_0_10px_rgba(0,240,255,0.15)]">
                    MISSION CONTROL
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-sans text-cyan-400/90 font-medium tracking-wide mt-0.5">
                  <span className="flex items-center gap-1 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    {subtitle || 'Real-Time Ground Station Dashboard'}
                  </span>
                  <span className="hidden sm:inline text-slate-600">•</span>
                  <span className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-cyan-300/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {formatMet(metSeconds)} ({utcTime})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls & Connection Status */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
          
          {/* Direct Temperature Unit Switcher Pill (°C / °F / K) */}
          <div className="flex items-center bg-slate-950/90 border border-cyan-500/30 p-1 rounded-xl text-xs font-mono font-bold shadow-inner">
            <button
              onClick={() => onUpdateUnit && onUpdateUnit('C')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                unit === 'C' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.4)] font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Celsius"
            >
              °C
            </button>
            <button
              onClick={() => onUpdateUnit && onUpdateUnit('F')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                unit === 'F' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.4)] font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Fahrenheit"
            >
              °F
            </button>
            <button
              onClick={() => onUpdateUnit && onUpdateUnit('K')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                unit === 'K' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.4)] font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Kelvin"
            >
              K
            </button>
          </div>

          {/* Connection Status Indicator */}
          <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wide transition-all duration-300 ${
            isConnected 
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
              : 'bg-rose-950/60 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
          }`}>
            {isConnected ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>CONNECTED</span>
              </>
            ) : (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span>DISCONNECTED</span>
              </>
            )}
          </div>

          {/* Simulation Toggle Control */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-cyan-500/30 px-3 py-1.5 rounded-xl shadow-inner">
            <span className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
              Simulation:
            </span>
            <button
              onClick={() => toggleSimulation(!isSimulating)}
              className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isSimulating ? 'bg-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-slate-800'
              }`}
              title={isSimulating ? 'Disable simulated data' : 'Enable simulated data'}
            >
              <span className="sr-only">Toggle Simulation</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out font-mono text-[9px] flex items-center justify-center font-bold text-cyan-300 ${
                  isSimulating ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {isSimulating ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* Fullscreen Mode Toggle */}
          <button
            onClick={toggleFullscreenMode}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-all hidden sm:flex items-center justify-center"
            title="Toggle Fullscreen Ground Station View"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* User Customization Settings Button */}
          <button
            onClick={onOpenDashboardSettings}
            className="p-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 hover:text-cyan-100 transition-all"
            title="Customize Dashboard Titles, Units & Limits"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
          </button>

          {/* ESP32 Hardware Config Button */}
          <button
            onClick={onOpenEsp32Settings}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 text-xs font-mono font-semibold transition-all shadow-[0_0_12px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            title="Configure ESP32 / Data Source"
          >
            <Settings2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">ESP32 Setup</span>
          </button>

        </div>
      </div>
    </header>
  );
}
