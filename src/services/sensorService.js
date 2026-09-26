/**
 * CanSat Telemetry Service Layer
 * Fully supports live incoming streams from ESP32 via:
 * 1. Web Serial API (Direct USB Cable - 115200 Baud)
 * 2. WebSockets (Wi-Fi real-time stream)
 * 3. REST API (HTTP polling)
 * 4. Simulation Mode (Demo generator)
 */

class SensorService {
  constructor() {
    this.mode = 'simulation'; // 'simulation' | 'serial' | 'websocket' | 'rest'
    this.isSimulating = true;
    this.simulationInterval = null;
    this.restInterval = null;
    this.webSocket = null;
    this.port = null;
    this.reader = null;
    
    this.listeners = new Set();
    this.statusListeners = new Set();
    this.packetCount = 0;
    
    // Base simulation temperature state
    this.simTemp = 26.5;
    this.lastDataTime = Date.now();
    this.isConnected = true;
    
    // Watchdog to detect dropped ESP32 connections
    this.watchdogTimer = setInterval(() => {
      if (Date.now() - this.lastDataTime > 5000 && this.isConnected && !this.isSimulating) {
        this.setConnected(false);
      }
    }, 2000);
  }

  // Subscribe to raw telemetry updates: { temperature, timestamp, source }
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Subscribe to connection status changes (boolean, mode, packetCount)
  subscribeStatus(callback) {
    this.statusListeners.add(callback);
    callback({ isConnected: this.isConnected, mode: this.mode, packetCount: this.packetCount });
    return () => this.statusListeners.delete(callback);
  }

  // Notify listeners with validated temperature telemetry payload
  notifyData(rawPayload) {
    const parsed = this.parseTelemetryPayload(rawPayload);
    if (parsed && typeof parsed.temperature === 'number' && !isNaN(parsed.temperature)) {
      this.lastDataTime = Date.now();
      this.packetCount++;
      
      if (!this.isConnected) {
        this.setConnected(true);
      }

      const payload = {
        temperature: parseFloat(parsed.temperature.toFixed(1)),
        timestamp: parsed.timestamp || this.getFormattedTimestamp(),
        source: this.mode,
        packetCount: this.packetCount
      };

      this.listeners.forEach((cb) => cb(payload));
      this.notifyStatusListeners();
    }
  }

  // Robust Telemetry Parser for all standard ESP32 output formats
  parseTelemetryPayload(data) {
    if (!data) return null;

    // Case 1: Already an object e.g. { temperature: 27.5, timestamp: "21:42:15" }
    if (typeof data === 'object') {
      const tempVal = data.temperature ?? data.temp ?? data.t;
      if (tempVal !== undefined) {
        return {
          temperature: parseFloat(tempVal),
          timestamp: data.timestamp || data.time
        };
      }
    }

    // Case 2: String payload (Serial text / JSON string / CSV)
    if (typeof data === 'string') {
      const trimmed = data.trim();
      if (!trimmed) return null;

      // Sub-case 2a: JSON string
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          const jsonObj = JSON.parse(trimmed);
          return this.parseTelemetryPayload(jsonObj);
        } catch {}
      }

      // Sub-case 2b: CSV e.g. "27.5,21:42:15"
      if (trimmed.includes(',')) {
        const parts = trimmed.split(',');
        const tempNum = parseFloat(parts[0]);
        if (!isNaN(tempNum)) {
          return { temperature: tempNum, timestamp: parts[1]?.trim() };
        }
      }

      // Sub-case 2c: Prefix label e.g. "TEMP: 27.5" or "Temperature = 27.5"
      const match = trimmed.match(/[-+]?\d*\.?\d+/);
      if (match) {
        const num = parseFloat(match[0]);
        if (!isNaN(num)) {
          return { temperature: num };
        }
      }
    }

    // Case 3: Direct number
    if (typeof data === 'number' && !isNaN(data)) {
      return { temperature: data };
    }

    return null;
  }

  setConnected(status) {
    this.isConnected = status;
    this.notifyStatusListeners();
  }

  notifyStatusListeners() {
    this.statusListeners.forEach((cb) => 
      cb({ isConnected: this.isConnected, mode: this.mode, packetCount: this.packetCount })
    );
  }

  getFormattedTimestamp() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  }

  // --- SIMULATION MODE ---
  startSimulation(intervalMs = 2000) {
    this.stopSimulation();
    this.isSimulating = true;
    this.mode = 'simulation';
    this.setConnected(true);

    this.notifyData({
      temperature: this.simTemp,
      timestamp: this.getFormattedTimestamp()
    });

    this.simulationInterval = setInterval(() => {
      const noise = (Math.random() - 0.48) * 0.5;
      this.simTemp += noise;
      if (this.simTemp > 33.0) this.simTemp = 30.5;
      if (this.simTemp < 20.0) this.simTemp = 23.0;

      this.notifyData({
        temperature: this.simTemp,
        timestamp: this.getFormattedTimestamp()
      });
    }, intervalMs);
  }

  stopSimulation() {
    this.isSimulating = false;
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  toggleSimulation(enable) {
    if (enable) {
      this.startSimulation();
    } else {
      this.stopSimulation();
      if (this.mode === 'simulation') {
        this.setConnected(false);
      }
    }
  }

  // --- WEB SERIAL (DIRECT USB TELEMETRY FROM ESP32) ---
  async connectSerial(baudRate = 115200) {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API is not supported in this browser. Please use Google Chrome, MS Edge, or Opera.');
    }
    this.stopAll();
    this.mode = 'serial';

    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate });
      this.setConnected(true);

      const textDecoder = new TextDecoderStream();
      this.port.readable.pipeTo(textDecoder.writable);
      const streamReader = textDecoder.readable.getReader();
      this.reader = streamReader;

      let buffer = '';
      while (true) {
        const { value, done } = await streamReader.read();
        if (done) break;
        buffer += value;
        
        const lines = buffer.split('\n');
        buffer = lines.pop(); // save incomplete line chunk

        for (let line of lines) {
          this.notifyData(line);
        }
      }
    } catch (error) {
      this.setConnected(false);
      throw error;
    }
  }

  // --- WEBSOCKET CONNECTION (ESP32 WI-FI) ---
  connectWebSocket(url = 'ws://192.168.1.100:81/ws') {
    this.stopAll();
    this.mode = 'websocket';

    try {
      this.webSocket = new WebSocket(url);
      
      this.webSocket.onopen = () => {
        this.setConnected(true);
      };

      this.webSocket.onmessage = (event) => {
        this.notifyData(event.data);
      };

      this.webSocket.onerror = () => {
        this.setConnected(false);
      };

      this.webSocket.onclose = () => {
        this.setConnected(false);
      };
    } catch (err) {
      this.setConnected(false);
      throw err;
    }
  }

  // --- REST API POLLING ---
  connectRestApi(url = 'http://192.168.1.100/api/temp', intervalMs = 2000) {
    this.stopAll();
    this.mode = 'rest';

    const fetchTemp = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP Error');
        const data = await res.json();
        this.notifyData(data);
      } catch (err) {
        this.setConnected(false);
      }
    };

    fetchTemp();
    this.restInterval = setInterval(fetchTemp, intervalMs);
  }

  // Manually push a test value into the stream
  sendManualTelemetry(tempValue) {
    this.notifyData({
      temperature: parseFloat(tempValue),
      timestamp: this.getFormattedTimestamp()
    });
  }

  stopAll() {
    this.stopSimulation();
    if (this.restInterval) {
      clearInterval(this.restInterval);
      this.restInterval = null;
    }
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
    if (this.reader) {
      this.reader.cancel().catch(() => {});
      this.reader = null;
    }
    if (this.port) {
      this.port.close().catch(() => {});
      this.port = null;
    }
  }
}

export const sensorService = new SensorService();
