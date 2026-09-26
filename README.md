# CanSat Temperature Monitoring System - Ground Station

A modern, responsive, aerospace-grade ground station web dashboard for real-time CanSat temperature telemetry monitoring.

Built with **React**, **Vite**, **Tailwind CSS**, **Recharts**, **Node.js**, **Express**, and **WebSockets**.

---

## 🚀 Features

- **Aerospace Ground Station Theme**: Dark navy/black theme with HUD brackets, scanlines, glowing cyan accents, and glassmorphism cards.
- **Current Temperature Readout**: Prominent temperature display (`°C`, `°F`, `K`), timestamp, status badge (`NOMINAL`, `COLD`, `ELEVATED`), circular SVG gauge meter, and statistics (Min, Avg, Max).
- **Interactive Temperature vs Time Line Graph**: Real-time smooth curve chart with tooltips, history window selectors (`15P`, `30P`, `ALL`), and CSV telemetry export.
- **Full-Stack Merged Server**: Node.js Express REST API + WebSocket Server + React Frontend served on a single port.
- **ESP32 Telemetry Connection**: Supports **Web Serial API** (USB cable plug-and-play), **WebSockets**, **REST API**, and built-in **Simulation Mode**.
- **Ready-to-Flash ESP32 Sketch**: Includes `hardware/CanSat_ESP32_Telemetry.ino` for uploading to ESP32 microcontrollers.
- **User Customizable**: Edit dashboard titles, temperature units (°C/°F/K), sensor specs, and thermal thresholds directly from the UI.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Merged Full-Stack Server
```bash
npm run server
```
- **Dashboard Link**: [http://localhost:3001](http://localhost:3001)
- **REST Status**: [http://localhost:3001/api/status](http://localhost:3001/api/status)
- **WebSocket Stream**: `ws://localhost:3001`

### 3. Run Vite Development Server (Optional for Dev)
```bash
npm run dev
```
- **Dev Link**: [http://localhost:5173](http://localhost:5173)

---

## 🔌 ESP32 Microcontroller Integration

1. Connect your **ESP32** to your PC using a USB cable.
2. Upload the Arduino sketch located at `hardware/CanSat_ESP32_Telemetry.ino` (Baud Rate: `115200`).
3. Open [http://localhost:3001](http://localhost:3001) in Chrome or Edge.
4. Click **`Connect ESP32 (USB)`** on the top toolbar and select your ESP32 COM port.
5. Watch live temperature telemetry stream to your dashboard!

---

## 📄 License
MIT License
