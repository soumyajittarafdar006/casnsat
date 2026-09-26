import { useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
  title: 'CANSAT TEMPERATURE MONITORING SYSTEM',
  subtitle: 'Real-Time Ground Station Dashboard',
  unit: 'C', // 'C' | 'F' | 'K'
  sensorName: 'Temperature Sensor (DS18B20 / BMP280)',
  dataSourceLabel: 'ESP32 / CanSat',
  systemStatusText: 'Online',
  minTempThreshold: 15,
  maxTempThreshold: 35,
  spectrumMin: -10,
  spectrumMax: 50,
  maxGraphPoints: 60,
  simulationSpeedMs: 2000,
  enableSoundAlerts: false
};

export function useDashboardSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('cansat_dashboard_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cansat_dashboard_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Convert temperature helper according to selected unit (°C, °F, K)
  const formatTemp = (tempInCelsius) => {
    if (typeof tempInCelsius !== 'number' || isNaN(tempInCelsius)) return 0;
    if (settings.unit === 'F') {
      return parseFloat(((tempInCelsius * 9) / 5 + 32).toFixed(1));
    }
    if (settings.unit === 'K') {
      return parseFloat((tempInCelsius + 273.15).toFixed(1));
    }
    return parseFloat(tempInCelsius.toFixed(1));
  };

  const unitSymbol = settings.unit === 'F' ? '°F' : settings.unit === 'K' ? 'K' : '°C';

  return {
    settings,
    updateSettings,
    resetSettings,
    formatTemp,
    unitSymbol
  };
}
