#include <WiFi.h>
#include <WebServer.h>

// ESP32 Dev starter for first real pump testing.
// This file is intentionally simple so a beginner can edit it safely.

// ------------------------------------------------------------
// Wi-Fi settings
// Change these two values to your real Wi-Fi network before upload.
// ------------------------------------------------------------
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// ------------------------------------------------------------
// Pump output pins
// Change these constants if your relay inputs use different GPIO pins.
// These starter pins are documented in docs/hardware/PIN_MAP.md.
// ------------------------------------------------------------
const int PUMP_1_PIN = 25;
const int PUMP_2_PIN = 26;
const int PUMP_3_PIN = 27;

// ------------------------------------------------------------
// Relay logic
// Many relay boards are active LOW:
// - LOW  = relay ON
// - HIGH = relay OFF
// If your relay board behaves backwards, swap these values.
// ------------------------------------------------------------
const int RELAY_ON = LOW;
const int RELAY_OFF = HIGH;

WebServer server(80);

struct PumpConfig {
  int id;
  int pin;
  const char* label;
};

PumpConfig pumps[] = {
  {1, PUMP_1_PIN, "Pump 1"},
  {2, PUMP_2_PIN, "Pump 2"},
  {3, PUMP_3_PIN, "Pump 3"},
};

const size_t PUMP_COUNT = sizeof(pumps) / sizeof(pumps[0]);

PumpConfig* findPumpById(int pumpId) {
  for (size_t i = 0; i < PUMP_COUNT; i++) {
    if (pumps[i].id == pumpId) {
      return &pumps[i];
    }
  }

  return nullptr;
}

void setPumpState(const PumpConfig& pump, bool isOn) {
  digitalWrite(pump.pin, isOn ? RELAY_ON : RELAY_OFF);
}

bool getPumpState(const PumpConfig& pump) {
  return digitalRead(pump.pin) == RELAY_ON;
}

String buildStatusJson() {
  String json = "{";
  json += "\"device\":\"pump\",";
  json += "\"pump1\":";
  json += getPumpState(pumps[0]) ? "true" : "false";
  json += ",";
  json += "\"pump2\":";
  json += getPumpState(pumps[1]) ? "true" : "false";
  json += ",";
  json += "\"pump3\":";
  json += getPumpState(pumps[2]) ? "true" : "false";
  json += "}";
  return json;
}

String buildCommandJson(const PumpConfig& pump, const char* state) {
  String json = "{";
  json += "\"ok\":true,";
  json += "\"device\":\"pump\",";
  json += "\"id\":";
  json += pump.id;
  json += ",";
  json += "\"state\":\"";
  json += state;
  json += "\",";
  json += "\"pin\":";
  json += pump.pin;
  json += ",";
  json += "\"status\":";
  json += buildStatusJson();
  json += "}";
  return json;
}

void sendJsonError(int statusCode, const char* message) {
  String json = "{";
  json += "\"ok\":false,";
  json += "\"error\":\"";
  json += message;
  json += "\"}";

  server.send(statusCode, "application/json", json);
}

void logPumpState(const PumpConfig& pump, const char* state) {
  Serial.print("[COMMAND] ");
  Serial.print(pump.label);
  Serial.print(" -> ");
  Serial.print(state);
  Serial.print(" (GPIO ");
  Serial.print(pump.pin);
  Serial.println(")");
}

void handleRoot() {
  String json = "{";
  json += "\"ok\":true,";
  json += "\"message\":\"ESP32 Dev pump controller is running\"";
  json += "}";

  server.send(200, "application/json", json);
}

void handleStatus() {
  Serial.println("[HTTP] GET /status");
  server.send(200, "application/json", buildStatusJson());
}

void handleCommand() {
  Serial.println("[HTTP] GET /command");

  if (!server.hasArg("device") || !server.hasArg("id") || !server.hasArg("state")) {
    sendJsonError(400, "Use /command?device=pump&id=1&state=on");
    return;
  }

  String device = server.arg("device");
  String idText = server.arg("id");
  String state = server.arg("state");

  if (device != "pump") {
    sendJsonError(400, "Only device=pump is supported in Phase 2");
    return;
  }

  int pumpId = idText.toInt();
  PumpConfig* pump = findPumpById(pumpId);

  if (pump == nullptr) {
    sendJsonError(404, "Pump id not found. Use id=1, id=2, or id=3");
    return;
  }

  if (state == "on") {
    setPumpState(*pump, true);
    logPumpState(*pump, "on");
    server.send(200, "application/json", buildCommandJson(*pump, "on"));
    return;
  }

  if (state == "off") {
    setPumpState(*pump, false);
    logPumpState(*pump, "off");
    server.send(200, "application/json", buildCommandJson(*pump, "off"));
    return;
  }

  sendJsonError(400, "State must be on or off");
}

void handleNotFound() {
  Serial.print("[HTTP] 404 ");
  Serial.println(server.uri());
  sendJsonError(404, "Route not found");
}

void connectToWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("[WIFI] Starting Wi-Fi connection");
  Serial.print("[WIFI] SSID: ");
  Serial.println(WIFI_SSID);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("[WIFI] Connected");
  Serial.print("[WIFI] IP address: ");
  Serial.println(WiFi.localIP());
}

void setupPumpPins() {
  Serial.println("[SETUP] Configuring pump pins");

  for (size_t i = 0; i < PUMP_COUNT; i++) {
    pinMode(pumps[i].pin, OUTPUT);
    setPumpState(pumps[i], false);

    Serial.print("[SETUP] ");
    Serial.print(pumps[i].label);
    Serial.print(" on GPIO ");
    Serial.print(pumps[i].pin);
    Serial.println(" -> default OFF");
  }
}

void setupRoutes() {
  server.on("/", HTTP_GET, handleRoot);
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/command", HTTP_GET, handleCommand);
  server.onNotFound(handleNotFound);
  server.begin();
  Serial.println("[SETUP] HTTP server started on port 80");
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("========================================");
  Serial.println("ESP32 Dev - 3 Pump Test Firmware");
  Serial.println("========================================");

  setupPumpPins();
  connectToWifi();
  setupRoutes();

  Serial.println("[READY] Open /status or /command in your browser");
}

void loop() {
  server.handleClient();
}
