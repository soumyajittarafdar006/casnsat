import { useState, useEffect, useCallback } from 'react';
import { sensorService } from '../services/sensorService';

export function useSensorData(maxPoints = 50) {
  const [currentTemp, setCurrentTemp] = useState(26.5);
  const [lastUpdated, setLastUpdated] = useState('--:--:--');
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isSimulating, setIsSimulating] = useState(true);
  const [connectionMode, setConnectionMode] = useState('simulation');
  const [packetCount, setPacketCount] = useState(0);
  const [stats, setStats] = useState({ min: 26.5, max: 26.5, avg: 26.5, count: 0 });

  useEffect(() => {
    // Start simulation by default on launch
    sensorService.startSimulation(2000);

    // Subscribe to telemetry stream
    const unsubscribeData = sensorService.subscribe((data) => {
      setCurrentTemp(data.temperature);
      setLastUpdated(data.timestamp);

      setHistory((prev) => {
        const nextHistory = [...prev, { time: data.timestamp, temp: data.temperature }];
        if (nextHistory.length > maxPoints) {
          nextHistory.shift();
        }

        // Calculate telemetry stats
        const temps = nextHistory.map((d) => d.temp);
        const minVal = Math.min(...temps);
        const maxVal = Math.max(...temps);
        const avgVal = temps.reduce((acc, curr) => acc + curr, 0) / temps.length;

        setStats({
          min: parseFloat(minVal.toFixed(1)),
          max: parseFloat(maxVal.toFixed(1)),
          avg: parseFloat(avgVal.toFixed(1)),
          count: nextHistory.length
        });

        return nextHistory;
      });
    });

    // Subscribe to connectivity status
    const unsubscribeStatus = sensorService.subscribeStatus(({ isConnected, mode, packetCount }) => {
      setIsConnected(isConnected);
      setConnectionMode(mode);
      setIsSimulating(mode === 'simulation');
      if (packetCount !== undefined) setPacketCount(packetCount);
    });

    return () => {
      unsubscribeData();
      unsubscribeStatus();
      sensorService.stopAll();
    };
  }, [maxPoints]);

  const toggleSimulation = useCallback((enable) => {
    setIsSimulating(enable);
    sensorService.toggleSimulation(enable);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const connectSerial = useCallback(async (baudRate = 115200) => {
    await sensorService.connectSerial(baudRate);
  }, []);

  const connectWebSocket = useCallback((url) => {
    sensorService.connectWebSocket(url);
  }, []);

  const connectRestApi = useCallback((url) => {
    sensorService.connectRestApi(url);
  }, []);

  const sendManualTelemetry = useCallback((tempVal) => {
    sensorService.sendManualTelemetry(tempVal);
  }, []);

  return {
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
  };
}
