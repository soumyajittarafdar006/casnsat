import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine
} from 'recharts';
import { LineChart as ChartIcon, Trash2, Pause, Play, Download, Activity } from 'lucide-react';

// Advanced Tooltip
const CustomTooltip = ({ active, payload, label, unitSymbol }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#050a16]/95 border border-cyan-500/50 p-3.5 rounded-xl shadow-[0_0_25px_rgba(0,240,255,0.3)] backdrop-blur-lg">
        <div className="text-[11px] font-mono text-cyan-400 font-bold mb-1.5 border-b border-cyan-500/25 pb-1 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            TIMESTAMP: {label}
          </span>
          <span className="text-[10px] text-slate-400">TELEMETRY FRAME</span>
        </div>
        <div className="text-sm font-mono font-bold text-slate-100 flex items-center justify-between gap-6 mt-1">
          <span className="text-slate-400 font-sans text-xs">TEMPERATURE:</span>
          <span className="text-cyan-300 text-lg font-black">{data.displayTemp} {unitSymbol}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function TempChartCard({ history, onClear, formatTemp, unitSymbol = '°C' }) {
  const [isPaused, setIsPaused] = useState(false);
  const [windowLimit, setWindowLimit] = useState(30);

  // Map history to current selected unit
  const formattedHistory = history.map((d) => ({
    ...d,
    displayTemp: formatTemp ? formatTemp(d.temp) : d.temp
  }));

  const temps = formattedHistory.map((d) => d.displayTemp);
  const minTemp = temps.length > 0 ? Math.floor(Math.min(...temps) - 2) : 18;
  const maxTemp = temps.length > 0 ? Math.ceil(Math.max(...temps) + 2) : 36;
  const avgTemp = temps.length > 0 ? parseFloat((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)) : 25;

  const displayData = windowLimit === 0 ? formattedHistory : formattedHistory.slice(-windowLimit);

  // Export CSV file
  const handleExportCSV = () => {
    if (!history || history.length === 0) return;
    let csvContent = `data:text/csv;charset=utf-8,Timestamp,Temperature_${unitSymbol.replace('°', '')}\n`;
    formattedHistory.forEach((row) => {
      csvContent += `${row.time},${row.displayTemp}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CanSat_Temperature_Telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="glass-panel-accent rounded-3xl p-5 sm:p-7 relative overflow-hidden border border-cyan-500/35 shadow-[0_0_35px_rgba(0,240,255,0.08)]">
        
        {/* HUD Corner Brackets */}
        <div className="hud-corner-tl"></div>
        <div className="hud-corner-tr"></div>
        <div className="hud-corner-bl"></div>
        <div className="hud-corner-br"></div>

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <ChartIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                  REAL-TIME TELEMETRY GRAPH
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-mono font-extrabold text-cyan-300 bg-cyan-950 border border-cyan-500/40 rounded">
                  LIVE STREAM
                </span>
              </div>
              <p className="text-base font-display font-black tracking-wider text-slate-100">
                TEMPERATURE vs TIME
              </p>
            </div>
          </div>

          {/* Graph Controls */}
          <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
            
            {/* History Window View Selectors */}
            <div className="flex items-center bg-slate-950/80 border border-cyan-500/20 p-1 rounded-xl text-xs font-mono">
              <button
                onClick={() => setWindowLimit(15)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  windowLimit === 15 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                15P
              </button>
              <button
                onClick={() => setWindowLimit(30)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  windowLimit === 30 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                30P
              </button>
              <button
                onClick={() => setWindowLimit(0)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  windowLimit === 0 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ALL
              </button>
            </div>

            {/* Pause/Resume Toggle */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all ${
                isPaused 
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                  : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:border-cyan-500/40'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-mono font-semibold transition-all"
              title="Export telemetry log as CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">EXPORT CSV</span>
            </button>

            {/* Clear Chart Buffer */}
            <button
              onClick={onClear}
              className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all"
              title="Clear Chart Buffer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Chart Container */}
        <div className="w-full h-[330px] sm:h-[400px] pt-2">
          {displayData.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 border border-dashed border-cyan-500/20 rounded-2xl bg-slate-950/40">
              <Activity className="w-10 h-10 text-cyan-500/40 animate-pulse mb-2" />
              <p className="font-mono text-xs text-cyan-400/80">AWAITING LIVE CANSAT TELEMETRY PACKETS...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={displayData}
                margin={{ top: 15, right: 15, left: -20, bottom: 25 }}
              >
                <defs>
                  <linearGradient id="cyberGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="2 2" 
                  stroke="#1e293b" 
                  vertical={false} 
                />

                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                  tickLine={{ stroke: '#334155' }}
                  dy={10}
                />

                <YAxis 
                  domain={[minTemp, maxTemp]} 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                  tickLine={{ stroke: '#334155' }}
                  unit={unitSymbol}
                  dx={-5}
                />

                <Tooltip content={<CustomTooltip unitSymbol={unitSymbol} />} />

                {/* Average baseline line */}
                {temps.length > 0 && (
                  <ReferenceLine 
                    y={avgTemp} 
                    stroke="#38bdf8" 
                    strokeDasharray="4 4" 
                    strokeOpacity={0.6} 
                    label={{ value: `AVG: ${avgTemp}${unitSymbol}`, fill: '#38bdf8', fontSize: 10, position: 'right', fontFamily: 'JetBrains Mono' }}
                  />
                )}

                <Area
                  type="monotone"
                  dataKey="displayTemp"
                  stroke="#00f0ff"
                  strokeWidth={3}
                  dot={{ r: 3.5, fill: '#00f0ff', stroke: '#030610', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#00f0ff', stroke: '#ffffff', strokeWidth: 2.5 }}
                  fillOpacity={1}
                  fill="url(#cyberGlow)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Axis Labels */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2 px-2 border-t border-slate-800/80 pt-2.5">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            X-AXIS: TIME (HH:MM:SS)
          </span>
          <span className="flex items-center gap-1">
            Y-AXIS: TEMPERATURE ({unitSymbol})
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          </span>
        </div>

      </div>
    </section>
  );
}
