import React from 'react';
import { Cpu, Scale, Database, ShieldCheck } from 'lucide-react';

export function StatusFooter({ connectionMode, isConnected, sensorName, unitSymbol = '°C' }) {
  const getDataSourceLabel = (mode) => {
    switch (mode) {
      case 'serial':
        return 'ESP32 / CanSat (USB Serial)';
      case 'websocket':
        return 'ESP32 / CanSat (WebSocket)';
      case 'rest':
        return 'ESP32 / CanSat (REST API)';
      case 'simulation':
      default:
        return 'ESP32 / CanSat (Simulated)';
    }
  };

  return (
    <footer className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="glass-panel-accent rounded-3xl p-5 border border-cyan-500/35 bg-[#070c19]/90 relative overflow-hidden">
        
        {/* HUD Corner Brackets */}
        <div className="hud-corner-tl"></div>
        <div className="hud-corner-tr"></div>
        <div className="hud-corner-bl"></div>
        <div className="hud-corner-br"></div>

        <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400 mb-3 border-b border-cyan-500/20 pb-2 flex items-center justify-between">
          <span>SYSTEM & HARDWARE STATUS</span>
          <span className="text-[10px] text-slate-500">CANSAT SUBSYSTEM v1.0</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Sensor */}
          <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Sensor</div>
              <div className="text-xs font-mono font-bold text-slate-200 truncate max-w-[140px]" title={sensorName}>
                {sensorName || 'Temperature Sensor'}
              </div>
            </div>
          </div>

          {/* Unit */}
          <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Unit</div>
              <div className="text-xs font-mono font-bold text-cyan-300">
                {unitSymbol} ({unitSymbol === '°F' ? 'Fahrenheit' : unitSymbol === 'K' ? 'Kelvin' : 'Celsius'})
              </div>
            </div>
          </div>

          {/* Data Source */}
          <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Data Source</div>
              <div className="text-xs font-mono font-bold text-slate-200 truncate">
                {getDataSourceLabel(connectionMode)}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">System Status</div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
                <span className={isConnected ? 'text-emerald-400' : 'text-rose-400'}>
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
