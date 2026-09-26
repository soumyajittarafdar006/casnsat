import React, { useState } from 'react';
import { Cable, Wifi, Send, CheckCircle2, Cpu, Zap, Activity, Terminal, X, Copy } from 'lucide-react';

export function LiveEsp32ControlBar({ 
  connectionMode, 
  isConnected, 
  packetCount, 
  connectSerial, 
  connectWebSocket, 
  sendManualTelemetry,
  onOpenSettings,
  history = []
}) {
  const [testTemp, setTestTemp] = useState('28.5');
  const [isSerialLoading, setIsSerialLoading] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleQuickSerial = async () => {
    setIsSerialLoading(true);
    try {
      await connectSerial(115200);
    } catch (err) {
      alert(err.message || 'Could not connect via Web Serial. Ensure ESP32 is connected via USB.');
    } finally {
      setIsSerialLoading(false);
    }
  };

  const handleSendTest = (e) => {
    e.preventDefault();
    const val = parseFloat(testTemp);
    if (!isNaN(val)) {
      sendManualTelemetry(val);
    }
  };

  const handleCopyLogs = () => {
    const text = history.map((h) => `[${h.time}] ${h.temp} °C`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full max-w-4xl mx-auto mt-4 px-4">
      <div className="glass-panel-accent rounded-3xl p-4 border border-cyan-500/35 bg-[#060b18]/95 shadow-[0_4px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
        
        {/* HUD Corner Brackets */}
        <div className="hud-corner-tl"></div>
        <div className="hud-corner-tr"></div>
        <div className="hud-corner-bl"></div>
        <div className="hud-corner-br"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Active Mode Status Badge */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              connectionMode !== 'simulation' && isConnected
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-cyan-950/70 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
            }`}>
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-100">
                  ESP32 HARDWARE INTERFACE
                </span>
                {connectionMode !== 'simulation' && (
                  <span className="px-2 py-0.5 text-[9px] font-mono font-extrabold text-emerald-300 bg-emerald-950 border border-emerald-500/50 rounded-full animate-pulse">
                    LIVE STREAM ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-cyan-400/90">
                SOURCE: <strong className="text-cyan-200 uppercase">{connectionMode}</strong> • PACKETS: <strong className="text-cyan-300">{packetCount}</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions & Live Test Inputs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            {/* Quick Web Serial USB Button */}
            <button
              onClick={handleQuickSerial}
              disabled={isSerialLoading}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-extrabold transition-all shadow-md ${
                connectionMode === 'serial' && isConnected
                  ? 'bg-emerald-900/80 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
              }`}
              title="Connect ESP32 directly via USB Serial"
            >
              <Cable className="w-4 h-4 text-cyan-400" />
              <span>{isSerialLoading ? 'Connecting...' : 'Connect ESP32 (USB)'}</span>
            </button>

            {/* Console Inspector Toggle */}
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-mono font-bold transition-all"
              title="View Raw Telemetry Console Stream"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Console</span>
            </button>

            {/* Quick Test Manual Packet Sender */}
            <form onSubmit={handleSendTest} className="flex items-center gap-1.5 bg-slate-950/90 border border-cyan-500/25 px-2.5 py-1 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase hidden sm:inline">Test °C:</span>
              <input
                type="number"
                step="0.1"
                value={testTemp}
                onChange={(e) => setTestTemp(e.target.value)}
                className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-0.5 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400 text-center font-bold"
                placeholder="28.5"
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono flex items-center gap-1 transition-all"
                title="Send test packet"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

          </div>

        </div>

        {/* Telemetry Console Inspector Drawer */}
        {showConsole && (
          <div className="mt-4 pt-3 border-t border-cyan-500/20 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Terminal className="w-4 h-4" />
                RAW TELEMETRY PACKET STREAM (INSPECTOR)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLogs}
                  className="flex items-center gap-1 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy Stream'}</span>
                </button>
                <button
                  onClick={() => setShowConsole(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300/90 h-32 overflow-y-auto space-y-1">
              {history.length === 0 ? (
                <div className="text-slate-600">Waiting for incoming telemetry packets...</div>
              ) : (
                history.slice(-10).map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-slate-500">[RX {h.time}]</span>
                    <span className="text-cyan-400 font-bold">{`{"temperature": ${h.temp}, "timestamp": "${h.time}"}`}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
