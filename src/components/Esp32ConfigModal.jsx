import React, { useState } from 'react';
import { X, Cable, Wifi, Globe, Play, CheckCircle2, Code2, AlertTriangle } from 'lucide-react';

export function Esp32ConfigModal({ 
  isOpen, 
  onClose, 
  connectionMode,
  connectSerial,
  connectWebSocket,
  connectRestApi,
  toggleSimulation
}) {
  const [activeTab, setActiveTab] = useState('serial');
  const [wsUrl, setWsUrl] = useState('ws://192.168.1.100:81/ws');
  const [restUrl, setRestUrl] = useState('http://192.168.1.100/api/temp');
  const [baudRate, setBaudRate] = useState(115200);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSerialConnect = async () => {
    setErrorMsg('');
    try {
      await connectSerial(Number(baudRate));
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect via Web Serial');
    }
  };

  const handleWsConnect = () => {
    setErrorMsg('');
    try {
      connectWebSocket(wsUrl);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect to WebSocket');
    }
  };

  const handleRestConnect = () => {
    setErrorMsg('');
    try {
      connectRestApi(restUrl);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect to REST API');
    }
  };

  const handleEnableSimulation = () => {
    toggleSimulation(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-accent max-w-xl w-full rounded-2xl p-6 relative shadow-2xl border border-cyan-500/40">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Cable className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400">
                HARDWARE DATA SOURCE
              </h2>
              <p className="text-xs text-slate-300 font-sans">
                Connect ESP32 / CanSat telemetry stream
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <button
            onClick={() => setActiveTab('serial')}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-mono font-semibold transition-all ${
              activeTab === 'serial' 
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Cable className="w-3.5 h-3.5" />
            <span>USB Serial</span>
          </button>

          <button
            onClick={() => setActiveTab('websocket')}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-mono font-semibold transition-all ${
              activeTab === 'websocket' 
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>WebSocket</span>
          </button>

          <button
            onClick={() => setActiveTab('rest')}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-mono font-semibold transition-all ${
              activeTab === 'rest' 
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>REST API</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'serial' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Connect your ESP32 directly to your PC via USB cable. Select the Baud Rate matching your Arduino sketch.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Baud Rate</label>
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(e.target.value)}
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
              >
                <option value={115200}>115200 Baud (Recommended)</option>
                <option value={9600}>9600 Baud</option>
                <option value={57600}>57600 Baud</option>
              </select>
            </div>

            <button
              onClick={handleSerialConnect}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2"
            >
              <Cable className="w-4 h-4" />
              <span>Select Serial Port & Connect</span>
            </button>
          </div>
        )}

        {activeTab === 'websocket' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Stream live telemetry packets directly from your ESP32 WebSocket server over Wi-Fi.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">WebSocket URL</label>
              <input
                type="text"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                placeholder="ws://192.168.1.100:81/ws"
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              onClick={handleWsConnect}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2"
            >
              <Wifi className="w-4 h-4" />
              <span>Connect WebSocket</span>
            </button>
          </div>
        )}

        {activeTab === 'rest' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Poll telemetry data from an ESP32 web server REST API endpoint.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">REST API Endpoint</label>
              <input
                type="text"
                value={restUrl}
                onChange={(e) => setRestUrl(e.target.value)}
                placeholder="http://192.168.1.100/api/temp"
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-2.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              onClick={handleRestConnect}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>Start Polling Endpoint</span>
            </button>
          </div>
        )}

        {/* Expected Payload Format Note */}
        <div className="mt-5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
            <Code2 className="w-3.5 h-3.5" />
            <span>EXPECTED JSON PAYLOAD SCHEME</span>
          </div>
          <pre className="text-cyan-300/90 bg-slate-950 p-2 rounded border border-slate-800 text-[10px] mt-1 overflow-x-auto">
{`{
  "temperature": 27.5,
  "timestamp": "21:42:15"
}`}
          </pre>
        </div>

        {/* Footer: Switch back to simulation */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">Active mode: <strong>{connectionMode}</strong></span>
          <button
            onClick={handleEnableSimulation}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Switch to Demo Simulation</span>
          </button>
        </div>

      </div>
    </div>
  );
}
