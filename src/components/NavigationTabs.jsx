import React from 'react';
import { Activity, LineChart, Cable, Sliders } from 'lucide-react';

export function NavigationTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', label: 'Telemetry Overview', icon: Activity },
    { id: 'graph', label: 'Temperature Graph', icon: LineChart },
    { id: 'esp32', label: 'ESP32 Hardware', icon: Cable },
    { id: 'settings', label: 'Ground Settings', icon: Sliders }
  ];

  return (
    <nav className="w-full max-w-4xl mx-auto mt-4 px-4">
      <div className="glass-panel-accent rounded-2xl p-1.5 border border-cyan-500/30 bg-[#060b18]/90 shadow-[0_0_20px_rgba(0,240,255,0.1)] flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all duration-300 flex-1 whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
