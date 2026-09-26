import React from 'react';
import { Thermometer, ArrowUpRight, ArrowDownRight, Activity, Clock, TrendingUp, TrendingDown, Minus, Flame, Snowflake } from 'lucide-react';

export function CurrentTempCard({ 
  temperature, 
  lastUpdated, 
  isConnected,
  stats,
  history = [],
  formatTemp,
  unitSymbol = '°C',
  minTempThreshold = 15,
  maxTempThreshold = 35
}) {
  const displayTemp = formatTemp ? formatTemp(temperature) : temperature;

  // Calculate rate of change / trend
  const getTrend = () => {
    if (!history || history.length < 2) return { label: 'STABLE', icon: Minus, color: 'text-cyan-400' };
    const latest = history[history.length - 1]?.temp ?? temperature;
    const previous = history[history.length - 4]?.temp ?? history[0]?.temp ?? temperature;
    const diff = parseFloat((latest - previous).toFixed(1));

    if (diff > 0.1) return { label: `+${diff}°/step`, icon: TrendingUp, color: 'text-amber-400' };
    if (diff < -0.1) return { label: `${diff}°/step`, icon: TrendingDown, color: 'text-cyan-300' };
    return { label: 'STABLE', icon: Minus, color: 'text-emerald-400' };
  };

  const trend = getTrend();
  const TrendIcon = trend.icon;

  // Temperature status classification based on user defined thresholds
  const getStatusBadge = (temp) => {
    if (!isConnected) return { label: 'OFFLINE', color: 'bg-slate-900 text-slate-500 border-slate-700' };
    if (temp < minTempThreshold) return { label: 'COLD ENVELOPE', color: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(0,240,255,0.2)]' };
    if (temp > maxTempThreshold) return { label: 'ELEVATED THERMAL', color: 'bg-rose-950/90 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.2)]' };
    return { label: 'NOMINAL THERMAL', color: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]' };
  };

  const status = getStatusBadge(temperature);

  // PercentageAlong thermal spectrum (-10°C to 50°C)
  const tempPercent = Math.min(Math.max(((temperature - (-10)) / (50 - (-10))) * 100, 0), 100);
  const strokeDashoffset = 250 - (tempPercent / 100) * 250;

  const formattedMin = formatTemp ? formatTemp(stats.min) : stats.min;
  const formattedAvg = formatTemp ? formatTemp(stats.avg) : stats.avg;
  const formattedMax = formatTemp ? formatTemp(stats.max) : stats.max;

  return (
    <section className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="glass-panel-accent rounded-3xl p-6 sm:p-8 relative overflow-hidden group border border-cyan-500/35 shadow-[0_0_35px_rgba(0,240,255,0.1)]">
        
        {/* HUD Corner Brackets */}
        <div className="hud-corner-tl"></div>
        <div className="hud-corner-tr"></div>
        <div className="hud-corner-bl"></div>
        <div className="hud-corner-br"></div>

        {/* Header row */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Thermometer className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                  PRIMARY TELEMETRY READOUT
                </h2>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              </div>
              <p className="text-base font-display font-black tracking-wider text-slate-100">
                CURRENT TEMPERATURE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-extrabold tracking-wider ${status.color}`}>
              {status.label}
            </div>
          </div>
        </div>

        {/* Central Prominent Display with Dynamic Circular HUD Gauge Arc */}
        <div className="relative flex flex-col items-center justify-center py-2">
          
          <div className="relative flex items-center justify-center">
            <svg className="w-64 h-36 sm:w-72 sm:h-40 overflow-visible" viewBox="0 0 100 60">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#0f172a"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#tempGradient)"
                strokeWidth="7"
                strokeDasharray="250"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Number & Unit */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-6xl sm:text-7xl md:text-8xl font-display font-black tracking-tight font-mono text-cyan-300 drop-shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all duration-300">
                  {typeof displayTemp === 'number' ? displayTemp.toFixed(1) : displayTemp}
                </span>
                <span className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-cyan-400">
                  {unitSymbol}
                </span>
              </div>
            </div>

          </div>

          {/* Trend & Timestamp */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/25 text-xs font-mono font-bold">
              <TrendIcon className={`w-3.5 h-3.5 ${trend.color}`} />
              <span className="text-slate-400">TREND:</span>
              <span className={trend.color}>{trend.label}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-950/80 px-3.5 py-1 rounded-full border border-cyan-500/25">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Last updated: <strong className="text-cyan-300 font-extrabold">{lastUpdated}</strong></span>
            </div>
          </div>

          {/* Visual Thermal Spectrum Bar */}
          <div className="w-full max-w-md mt-6">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1 text-cyan-400"><Snowflake className="w-3 h-3" /> COLD ({minTempThreshold}°C)</span>
              <span className="text-slate-500">THERMAL SPECTRUM</span>
              <span className="flex items-center gap-1 text-rose-400">HOT ({maxTempThreshold}°C) <Flame className="w-3 h-3" /></span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full border border-cyan-500/20 relative overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-rose-500 opacity-60"></div>
              <div 
                className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_#ffffff] transition-all duration-500 transform -translate-x-1/2"
                style={{ left: `${tempPercent}%` }}
              ></div>
            </div>
          </div>

        </div>

        {/* Bottom Statistics Bar */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-800/80 text-center">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-cyan-500/15">
            <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">MIN TEMP</span>
            <div className="flex items-center justify-center gap-1 text-base font-mono font-bold text-cyan-300 mt-0.5">
              <ArrowDownRight className="w-4 h-4 text-cyan-400" />
              {formattedMin} {unitSymbol}
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-cyan-500/15">
            <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">AVG TEMP</span>
            <div className="flex items-center justify-center gap-1 text-base font-mono font-bold text-cyan-200 mt-0.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              {formattedAvg} {unitSymbol}
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-cyan-500/15">
            <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">MAX TEMP</span>
            <div className="flex items-center justify-center gap-1 text-base font-mono font-bold text-rose-300 mt-0.5">
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
              {formattedMax} {unitSymbol}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
