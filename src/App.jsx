import React, { useState } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { LiveEsp32ControlBar } from './components/LiveEsp32ControlBar';
import { CurrentTempCard } from './components/CurrentTempCard';
import { TempChartCard } from './components/TempChartCard';
import { StatusFooter } from './components/StatusFooter';
import { Esp32ConfigModal } from './components/Esp32ConfigModal';
import { DashboardSettingsModal } from './components/DashboardSettingsModal';
import { useSensorData } from './hooks/useSensorData';
import { useDashboardSettings } from './hooks/useDashboardSettings';
import { Cable, Wifi, Globe, Play, Code2, Save, RotateCcw, Sliders, Thermometer, Type, BarChart2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'graph' | 'esp32' | 'settings'
  const [isEsp32ModalOpen, setIsEsp32ModalOpen] = useState(false);
  const [isDashboardSettingsOpen, setIsDashboardSettingsOpen] = useState(false);

  const { settings, updateSettings, resetSettings, formatTemp, unitSymbol } = useDashboardSettings();

  const {
    currentTemp,
    lastUpdated,
    history,
    isConnected,
    isSimulating,
    connectionMode,
    packetCount,
    stats,
    toggleSimulation,
    clearHistory,
    connectSerial,
    connectWebSocket,
    connectRestApi,
    sendManualTelemetry
  } = useSensorData(settings.maxGraphPoints || 60);

  // Settings tab form state
  const [settingsForm, setSettingsForm] = useState({ ...settings });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen grid-bg scanlines flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      <div>
        {/* HEADER & CONNECTION STATUS & DIRECT UNIT/TITLE EDITORS */}
        <Header 
          isConnected={isConnected} 
          isSimulating={isSimulating}
          toggleSimulation={toggleSimulation}
          onOpenEsp32Settings={() => setIsEsp32ModalOpen(true)}
          onOpenDashboardSettings={() => setIsDashboardSettingsOpen(true)}
          title={settings.title}
          subtitle={settings.subtitle}
          unit={settings.unit}
          onUpdateUnit={(unit) => updateSettings({ unit })}
          onUpdateTitles={(title, subtitle) => updateSettings({ title, subtitle })}
          connectionMode={connectionMode}
        />

        {/* MAIN NAVIGATION TABS */}
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="pb-8">
          
          {/* TAB 1: TELEMETRY OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <LiveEsp32ControlBar 
                connectionMode={connectionMode}
                isConnected={isConnected}
                packetCount={packetCount}
                connectSerial={connectSerial}
                connectWebSocket={connectWebSocket}
                sendManualTelemetry={sendManualTelemetry}
                onOpenSettings={() => setIsEsp32ModalOpen(true)}
                history={history}
              />

              <CurrentTempCard 
                temperature={currentTemp} 
                lastUpdated={lastUpdated} 
                isConnected={isConnected}
                stats={stats}
                history={history}
                formatTemp={formatTemp}
                unitSymbol={unitSymbol}
                minTempThreshold={settings.minTempThreshold}
                maxTempThreshold={settings.maxTempThreshold}
              />

              <TempChartCard 
                history={history} 
                onClear={clearHistory} 
                formatTemp={formatTemp}
                unitSymbol={unitSymbol}
              />
            </div>
          )}

          {/* TAB 2: TEMPERATURE GRAPH */}
          {activeTab === 'graph' && (
            <div className="animate-fade-in">
              <TempChartCard 
                history={history} 
                onClear={clearHistory} 
                formatTemp={formatTemp}
                unitSymbol={unitSymbol}
              />

              <CurrentTempCard 
                temperature={currentTemp} 
                lastUpdated={lastUpdated} 
                isConnected={isConnected}
                stats={stats}
                history={history}
                formatTemp={formatTemp}
                unitSymbol={unitSymbol}
                minTempThreshold={settings.minTempThreshold}
                maxTempThreshold={settings.maxTempThreshold}
              />
            </div>
          )}

          {/* TAB 3: ESP32 HARDWARE SETUP & CODE */}
          {activeTab === 'esp32' && (
            <div className="w-full max-w-4xl mx-auto my-6 px-4 animate-fade-in space-y-6">
              <div className="glass-panel-accent rounded-3xl p-6 border border-cyan-500/35 bg-[#060b18]/95 relative overflow-hidden">
                <div className="hud-corner-tl"></div>
                <div className="hud-corner-tr"></div>
                <div className="hud-corner-bl"></div>
                <div className="hud-corner-br"></div>

                <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-4 mb-4">
                  <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                    <Cable className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400">
                      ESP32 TELEMETRY HARDWARE CONFIGURATION
                    </h2>
                    <p className="text-xs text-slate-300 font-sans">
                      Connect your ESP32 microcontroller to transmit live temperature readings
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* USB Serial Button */}
                  <button
                    onClick={() => connectSerial(115200)}
                    className="flex flex-col items-center justify-center p-5 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/50 text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] group"
                  >
                    <Cable className="w-8 h-8 text-cyan-400 mb-2 transform group-hover:scale-110 transition-transform" />
                    <span className="font-mono font-bold text-xs uppercase">Connect USB Serial</span>
                    <span className="text-[10px] text-slate-400 mt-1">115200 Baud Rate</span>
                  </button>

                  {/* WebSocket Connect */}
                  <button
                    onClick={() => connectWebSocket('ws://192.168.1.100:81/ws')}
                    className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all group"
                  >
                    <Wifi className="w-8 h-8 text-cyan-400 mb-2 transform group-hover:scale-110 transition-transform" />
                    <span className="font-mono font-bold text-xs uppercase">Wi-Fi WebSocket</span>
                    <span className="text-[10px] text-slate-400 mt-1">ws://192.168.1.100:81/ws</span>
                  </button>

                  {/* Demo Simulation Toggle */}
                  <button
                    onClick={() => toggleSimulation(true)}
                    className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all group"
                  >
                    <Play className="w-8 h-8 text-emerald-400 mb-2 transform group-hover:scale-110 transition-transform" />
                    <span className="font-mono font-bold text-xs uppercase">Demo Simulation</span>
                    <span className="text-[10px] text-slate-400 mt-1">Built-in Telemetry Test</span>
                  </button>
                </div>

                {/* Arduino Sketch Viewer */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold mb-2">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-4 h-4" />
                      READY-TO-FLASH ARDUINO C++ SKETCH (hardware/CanSat_ESP32_Telemetry.ino)
                    </span>
                  </div>
                  <pre className="text-cyan-300/90 text-[11px] font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800 overflow-x-auto max-h-60">
{`void loop() {
  float tempC = readTemperatureCelsius();
  String timeStr = getTimestamp();
  
  // JSON Payload sent to Ground Station:
  String jsonPayload = "{\\"temperature\\":" + String(tempC, 1) + ",\\"timestamp\\":\\"" + timeStr + "\\"}";
  Serial.println(jsonPayload);
  delay(1500);
}`}
                  </pre>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: GROUND SETTINGS */}
          {activeTab === 'settings' && (
            <div className="w-full max-w-4xl mx-auto my-6 px-4 animate-fade-in">
              <div className="glass-panel-accent rounded-3xl p-6 sm:p-8 border border-cyan-500/35 bg-[#060b18]/95 relative overflow-hidden">
                <div className="hud-corner-tl"></div>
                <div className="hud-corner-tr"></div>
                <div className="hud-corner-bl"></div>
                <div className="hud-corner-br"></div>

                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400">
                        GROUND STATION CONFIGURATION
                      </h2>
                      <p className="text-xs text-slate-300 font-sans">
                        Customize titles, temperature units, sensor model, and thermal thresholds
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  
                  {/* Branding */}
                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-cyan-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                      <Type className="w-4 h-4 text-cyan-400" />
                      <span>DASHBOARD TITLES & BRANDING</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Main Title</label>
                      <input
                        type="text"
                        value={settingsForm.title}
                        onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                        className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={settingsForm.subtitle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, subtitle: e.target.value })}
                        className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Temperature Unit & Sensor */}
                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-cyan-500/20 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                      <Thermometer className="w-4 h-4 text-cyan-400" />
                      <span>UNIT & SENSOR SPECIFICATIONS</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Temperature Unit</label>
                        <select
                          value={settingsForm.unit}
                          onChange={(e) => setSettingsForm({ ...settingsForm, unit: e.target.value })}
                          className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400 font-bold"
                        >
                          <option value="C">°C (Celsius)</option>
                          <option value="F">°F (Fahrenheit)</option>
                          <option value="K">K (Kelvin)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Sensor Model</label>
                        <input
                          type="text"
                          value={settingsForm.sensorName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, sensorName: e.target.value })}
                          className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Thermal Limits */}
                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-cyan-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                      <BarChart2 className="w-4 h-4 text-cyan-400" />
                      <span>THERMAL ENVELOPE THRESHOLDS (°C)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Cold Threshold (°C)</label>
                        <input
                          type="number"
                          value={settingsForm.minTempThreshold}
                          onChange={(e) => setSettingsForm({ ...settingsForm, minTempThreshold: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Elevated Threshold (°C)</label>
                        <input
                          type="number"
                          value={settingsForm.maxTempThreshold}
                          onChange={(e) => setSettingsForm({ ...settingsForm, maxTempThreshold: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={resetSettings}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono font-bold transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset Defaults</span>
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Settings</span>
                    </button>
                  </div>

                </form>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* SENSOR / SYSTEM STATUS FOOTER */}
      <StatusFooter 
        connectionMode={connectionMode} 
        isConnected={isConnected} 
        sensorName={settings.sensorName}
        unitSymbol={unitSymbol}
      />

      {/* ESP32 HARDWARE INTEGRATION MODAL */}
      <Esp32ConfigModal 
        isOpen={isEsp32ModalOpen} 
        onClose={() => setIsEsp32ModalOpen(false)} 
        connectionMode={connectionMode}
        connectSerial={connectSerial}
        connectWebSocket={connectWebSocket}
        connectRestApi={connectRestApi}
        toggleSimulation={toggleSimulation}
      />

      {/* USER CUSTOMIZABLE DASHBOARD SETTINGS MODAL */}
      <DashboardSettingsModal
        isOpen={isDashboardSettingsOpen}
        onClose={() => setIsDashboardSettingsOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
        resetSettings={resetSettings}
      />
    </div>
  );
}
