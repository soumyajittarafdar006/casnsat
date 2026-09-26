/**
 * CanSat Ground Station In-Memory Telemetry Data Store
 */

class TelemetryStore {
  constructor(maxSize = 500) {
    this.maxSize = maxSize;
    this.history = [];
    this.packetCount = 0;
    this.startTime = Date.now();
    this.lastReceivedTime = null;
  }

  addReading(temperature, timestamp = null, source = 'ESP32') {
    const numericTemp = parseFloat(Number(temperature).toFixed(1));
    if (isNaN(numericTemp)) return null;

    const formattedTimestamp = timestamp || this.getFormattedTimestamp();
    const packet = {
      id: ++this.packetCount,
      temperature: numericTemp,
      timestamp: formattedTimestamp,
      source: source,
      receivedAt: new Date().toISOString()
    };

    this.history.push(packet);
    if (this.history.length > this.maxSize) {
      this.history.shift();
    }
    this.lastReceivedTime = Date.now();

    return packet;
  }

  getHistory(limit = 100) {
    return this.history.slice(-limit);
  }

  getLatest() {
    return this.history[this.history.length - 1] || null;
  }

  getStats() {
    if (this.history.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0 };
    }
    const temps = this.history.map((h) => h.temperature);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;

    return {
      min: parseFloat(min.toFixed(1)),
      max: parseFloat(max.toFixed(1)),
      avg: parseFloat(avg.toFixed(1)),
      count: this.history.length,
      packetCount: this.packetCount,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000)
    };
  }

  getFormattedTimestamp() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  }
}

export const telemetryStore = new TelemetryStore();
