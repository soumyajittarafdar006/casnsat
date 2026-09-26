import React, { useState } from 'react';
import { X, Sliders, RotateCcw, Save, Thermometer, Type, Bell, Cpu, BarChart2 } from 'lucide-react';

export function DashboardSettingsModal({ isOpen, onClose, settings, updateSettings, resetSettings }) {
  const [formData, setFormData] = useState({ ...settings });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
    onClose();
  };

  const handleReset = () => {
    resetSettings();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-accent max-w-2xl w-full rounded-3xl p-6 sm:p-7 relative shadow-2xl border border-cyan-500/40 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-black uppercase tracking-wider text-cyan-400">
                CUSTOMIZE DASHBOARD SETTINGS
              </h2>
              <p className="text-xs text-slate-300 font-sans">
                Edit titles, temperature units, sensor specs, and thermal thresholds
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Section 1: Dashboard Titles */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-cyan-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
              <Type className="w-4 h-4 text-cyan-400" />
              <span>DASHBOARD TITLES & BRANDING</span>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Header Main Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400 font-bold"
                placeholder="CANSAT TEMPERATURE MONITORING SYSTEM"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Header Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                placeholder="Real-Time Ground Station Dashboard"
              />
            </div>
          </div>

          {/* Section 2: Temperature Unit & Sensor Metadata */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-cyan-500/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span>TEMPERATURE UNIT & SENSOR SPECIFICATIONS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Temperature Display Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400 font-bold"
                >
                  <option value="C">°C (Celsius)</option>
                  <option value="F">°F (Fahrenheit)</option>
                  <option value="K">K (Kelvin)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Sensor Model Name</label>
                <input
                  type="text"
                  value={formData.sensorName}
                  onChange={(e) => handleChange('sensorName', e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                  placeholder="Temperature Sensor (DS18B20)"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Thermal Warning Thresholds */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-cyan-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>THERMAL THRESHOLD LIMITS (°C)</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Cold Threshold (°C)</label>
                <input
                  type="number"
                  value={formData.minTempThreshold}
                  onChange={(e) => handleChange('minTempThreshold', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Elevated Threshold (°C)</label>
                <input
                  type="number"
                  value={formData.maxTempThreshold}
                  onChange={(e) => handleChange('maxTempThreshold', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Graph Buffer & Simulation Speed */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-cyan-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>GRAPH BUFFER & TRANSMISSION SPEED</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Max Graph Buffer Points</label>
                <select
                  value={formData.maxGraphPoints}
                  onChange={(e) => handleChange('maxGraphPoints', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value={30}>30 Points</option>
                  <option value={60}>60 Points</option>
                  <option value={100}>100 Points</option>
                  <option value={200}>200 Points</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Simulation Speed</label>
                <select
                  value={formData.simulationSpeedMs}
                  onChange={(e) => handleChange('simulationSpeedMs', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value={1000}>Fast (1 second)</option>
                  <option value={2000}>Normal (2 seconds)</option>
                  <option value={4000}>Slow (4 seconds)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
