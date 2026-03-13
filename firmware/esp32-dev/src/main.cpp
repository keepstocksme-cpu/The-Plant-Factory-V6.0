#include <WiFi.h>
#include <WebServer.h>

// Simple ESP32 Dev starter for 3 pump outputs.
// Update these values before flashing to real hardware.
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Example GPIO mapping for 3 pump relay channels.
// Confirm these pins against the real board and relay module.
const int PUMP_1_PIN = 25;
const int PUMP_2_PIN = 26;
const int PUMP_3_PIN = 27;

// Many relay boards are active LOW.
// Change these values if your relay logic is different.
const int RELAY_ON = LOW;
const int RELAY_OFF = HIGH;

WebServer server(80);

struct PumpConfig {
  const char* id;
  int pin;
};

PumpConfig pumps[] = {
  {"pump1", PUMP_1_PIN},
  {"pump2", PUMP_2_PIN},
  {"pump3", PUMP_3_PIN},
};

const size_t PUMP_COUNT = sizeof(pumps) / sizeof(pumps[0]);

PumpConfig* findPump(const String& pumpId) {
  for (size_t i = 0; i < PUMP_COUNT; i++) {
    if (pumpId == pumps[i].id) {
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

  for (size_t i = 0; i < PUMP_COUNT; i++) {
    json += "\"";
    json += pumps[i].id;
    json += "\":";
    json += getPumpState(pumps[i]) ? "true" : "false";

    if (i + 1 < PUMP_COUNT) {
      json += ",";
    }
  }

  json += "}";
  return json;
}

void handleRoot() {
  server.send(200, "text/plain", "ESP32 Dev pump controller is running.");
}

void handleStatus() {
  server.send(200, "application/json", buildStatusJson());
}

void handlePumpSet() {
  if (!server.hasArg("id") || !server.hasArg("state")) {
    server.send(400, "application/json", "{\"error\":\"Use /pump?id=pump1&state=on\"}");
    return;
  }

  String pumpId = server.arg("id");
  String state = server.arg("state");
  PumpConfig* pump = findPump(pumpId);

  if (pump == nullptr) {
    server.send(404, "application/json", "{\"error\":\"Pump not found\"}");
    return;
  }

  if (state == "on") {
    setPumpState(*pump, true);
  } else if (state == "off") {
    setPumpState(*pump, false);
  } else {
    server.send(400, "application/json", "{\"error\":\"State must be on or off\"}");
    return;
  }

  server.send(200, "application/json", buildStatusJson());
}

void connectToWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Connected. IP address: ");
  Serial.println(WiFi.localIP());
}

void setupPumpPins() {
  for (size_t i = 0; i < PUMP_COUNT; i++) {
    pinMode(pumps[i].pin, OUTPUT);
    setPumpState(pumps[i], false);
  }
}

void setupRoutes() {
  server.on("/", HTTP_GET, handleRoot);
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/pump", HTTP_GET, handlePumpSet);
  server.begin();
}

void setup() {
  Serial.begin(115200);
  setupPumpPins();
  connectToWifi();
  setupRoutes();
}

void loop() {
  server.handleClient();
}

