/*
 * CanSat ESP32 Live Temperature Telemetry Transmitter
 * Compatible with CanSat Temperature Monitoring System Ground Station
 * 
 * Instructions:
 * 1. Connect ESP32 to PC via USB Cable OR Wi-Fi.
 * 2. Upload this sketch using Arduino IDE (Baud Rate: 115200).
 * 3. On Ground Station Dashboard (http://localhost:5173):
 *    - Click "Connect ESP32 (USB)" button on header.
 *    - Select your ESP32 Serial COM port.
 *    - Watch live temperature readings & real-time line graph update live!
 */

// Choose your sensor type:
// OPTION A: Analog Temperature Sensor (LM35 / TMP36) on GPIO 34
// OPTION B: DS18B20 Digital Sensor on GPIO 4
// OPTION C: Simulated ESP32 Telemetry (No external sensor required for testing)

#define SENSOR_MODE_ANALOG 0
#define SENSOR_MODE_SIMULATED 1

// Active Mode Selection (Change to SENSOR_MODE_ANALOG if using physical LM35/TMP36 sensor)
int currentSensorMode = SENSOR_MODE_SIMULATED;

const int ANALOG_PIN = 34; // ESP32 ADC1 Pin for Analog Sensor

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Send initial startup banner
  Serial.println("\n[CANSAT ESP32 GROUND STATION SUBSYSTEM READY]");
  Serial.println("[Baud Rate: 115200 Baud]");
}

// Function to read physical analog sensor (LM35 / TMP36)
float readAnalogSensor() {
  int rawADC = analogRead(ANALOG_PIN);
  float voltage = (rawADC / 4095.0) * 3.3;
  // LM35 Formula: 10mV per °C -> Temp = Voltage * 100
  float tempC = voltage * 100.0;
  return tempC;
}

// Function to simulate physical sensor telemetry if no hardware sensor attached
float readSimulatedSensor() {
  static float currentTemp = 27.2;
  float delta = ((float)random(-30, 31)) / 100.0;
  currentTemp += delta;
  if (currentTemp > 36.0) currentTemp = 31.0;
  if (currentTemp < 18.0) currentTemp = 22.5;
  return currentTemp;
}

String getTimestamp() {
  unsigned long seconds = millis() / 1000;
  int hrs = (seconds / 3600) % 24;
  int mins = (seconds / 60) % 60;
  int secs = seconds % 60;

  char buf[12];
  snprintf(buf, sizeof(buf), "%02d:%02d:%02d", hrs, mins, secs);
  return String(buf);
}

void loop() {
  float tempC = 0.0;

  if (currentSensorMode == SENSOR_MODE_ANALOG) {
    tempC = readAnalogSensor();
  } else {
    tempC = readSimulatedSensor();
  }

  String timeStr = getTimestamp();

  // Format JSON payload for ground station dashboard
  // {"temperature": 27.5, "timestamp": "21:42:15"}
  String jsonPayload = "{\"temperature\":" + String(tempC, 1) + ",\"timestamp\":\"" + timeStr + "\"}";

  // Transmit over USB Serial
  Serial.println(jsonPayload);

  // Send packet every 1.5 seconds
  delay(1500);
}
