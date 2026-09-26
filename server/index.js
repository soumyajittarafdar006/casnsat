/**
 * CanSat Ground Station Full-Stack Merged Server
 * Serves the React Frontend (dist/), HTTP REST API, and WebSocket Real-Time Stream on Port 3001.
 */

import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { telemetryStore } from './telemetryStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

// Serve static compiled React Frontend build
app.use(express.static(distPath));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Broadcast telemetry packet to all connected WebSocket clients
function broadcast(packet) {
  const data = JSON.stringify(packet);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// REST API 1: GET Latest Telemetry Reading
app.get('/api/telemetry/latest', (req, res) => {
  const latest = telemetryStore.getLatest();
  const stats = telemetryStore.getStats();
  res.json({
    success: true,
    data: latest,
    stats: stats
  });
});

// REST API 2: GET Telemetry History
app.get('/api/telemetry/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const history = telemetryStore.getHistory(limit);
  res.json({
    success: true,
    count: history.length,
    data: history
  });
});

// REST API 3: POST ESP32 Live Telemetry Packet
app.post('/api/telemetry', (req, res) => {
  const { temperature, timestamp, temp } = req.body;
  const tempVal = temperature !== undefined ? temperature : temp;

  if (tempVal === undefined || isNaN(Number(tempVal))) {
    return res.status(400).json({ success: false, error: 'Invalid temperature value provided.' });
  }

  const packet = telemetryStore.addReading(tempVal, timestamp, 'ESP32_HTTP');
  broadcast(packet);

  res.json({
    success: true,
    message: 'Telemetry packet received and broadcasted.',
    packet: packet
  });
});

// REST API 4: System Status
app.get('/api/status', (req, res) => {
  res.json({
    system: 'CanSat Temperature Ground Station Merged Server',
    status: 'Online',
    port: PORT,
    websocketClients: wss.clients.size,
    stats: telemetryStore.getStats()
  });
});

// Fallback: Catch-all handler for React SPA routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// WebSocket Connection Handler
wss.on('connection', (ws) => {
  console.log('[Ground Station Backend] New Web Client Connected via WebSocket.');

  const history = telemetryStore.getHistory(50);
  ws.send(JSON.stringify({ type: 'INIT_HISTORY', data: history }));

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed.temperature !== undefined) {
        const packet = telemetryStore.addReading(parsed.temperature, parsed.timestamp, 'WebSocket_Client');
        broadcast(packet);
      }
    } catch {}
  });

  ws.on('close', () => {
    console.log('[Ground Station Backend] Web Client Disconnected.');
  });
});

// Default Background Telemetry Generator (Active when simulation is ON)
let currentSimTemp = 26.5;
setInterval(() => {
  const noise = (Math.random() - 0.48) * 0.4;
  currentSimTemp += noise;
  if (currentSimTemp > 33.0) currentSimTemp = 30.5;
  if (currentSimTemp < 20.0) currentSimTemp = 23.0;

  const packet = telemetryStore.addReading(currentSimTemp, null, 'Backend_Simulator');
  broadcast(packet);
}, 2000);

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 CANSAT FULL-STACK MERGED GROUND STATION LIVE`);
  console.log(`🌐 MERGED DASHBOARD: http://localhost:${PORT}`);
  console.log(`📡 REST API ENDPOINT: http://localhost:${PORT}/api/status`);
  console.log(`🔌 WEBSOCKET STREAM:  ws://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
