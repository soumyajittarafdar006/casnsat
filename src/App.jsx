import React, { useState } from 'react';
import { Header } from './components/Header';
import { LiveEsp32ControlBar } from './components/LiveEsp32ControlBar';
import { CurrentTempCard } from './components/CurrentTempCard';
import { TempChartCard } from './components/TempChartCard';
import { StatusFooter } from './components/StatusFooter';
import { Esp32ConfigModal } from './components/Esp32ConfigModal';
import { DashboardSettingsModal } from './components/DashboardSettingsModal';
import { useSensorData } from './hooks/useSensorData';
import { useDashboardSettings } from './hooks/useDashboardSettings';

export default function App() {
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

        {/* ADVANCED ESP32 LIVE STREAM & CONSOLE INSPECTOR BAR */}
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

        <main className="pb-8">
          {/* CURRENT TEMPERATURE CARD WITH CIRCULAR GAUGE & THERMAL SPECTRUM */}
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

          {/* TEMPERATURE vs TIME GRAPH WITH TELEMETRY EXPORT & WINDOW SELECTORS */}
          <TempChartCard 
            history={history} 
            onClear={clearHistory} 
            formatTemp={formatTemp}
            unitSymbol={unitSymbol}
          />
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
