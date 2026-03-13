# ESP32 Dev Quick Start

This guide is for the first real hardware test with 3 pumps.

## What you need

- 1 ESP32 Dev board
- USB cable for data
- 3-channel relay module or 3 separate relay channels
- External power for the pumps
- A computer with PlatformIO in VS Code
- Wi-Fi network details

## Important safety note

Do not connect a pump directly to an ESP32 GPIO pin.
Use a relay module or proper driver hardware.

## Step 1: Connect the ESP32

Starter relay input mapping:

- Pump 1 relay input -> GPIO 25
- Pump 2 relay input -> GPIO 26
- Pump 3 relay input -> GPIO 27

Also connect:

- ESP32 `GND` -> relay `GND`
- ESP32 `5V` or `3V3` -> relay control power only if your relay module supports it

Before powering pumps, confirm the relay module voltage and wiring requirements.

## Step 2: Edit Wi-Fi

Open:

`firmware/esp32-dev/src/main.cpp`

Find these lines:

```cpp
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
```

Replace them with your real Wi-Fi name and password.

## Step 3: Change pump pins if needed

In the same file, find:

```cpp
const int PUMP_1_PIN = 25;
const int PUMP_2_PIN = 26;
const int PUMP_3_PIN = 27;
```

Change only these constants if your relay inputs use different GPIO pins.

## Step 4: Upload firmware

In VS Code with PlatformIO:

1. Open the project folder
2. Open `firmware/esp32-dev`
3. Connect the ESP32 by USB
4. Build the project
5. Upload the project
6. Open the serial monitor at `115200`

Expected serial output includes:

- startup banner
- pump pin setup
- Wi-Fi connection status
- IP address

## Step 5: Find the ESP32 IP

In the serial monitor, look for a line like:

```text
[WIFI] IP address: 192.168.1.50
```

Use that IP in your browser tests.

## Step 6: Test from browser

Example status URL:

```text
http://192.168.1.50/status
```

Example Pump 1 ON URL:

```text
http://192.168.1.50/command?device=pump&id=1&state=on
```

Example Pump 1 OFF URL:

```text
http://192.168.1.50/command?device=pump&id=1&state=off
```

## Step 7: Watch serial logs while testing

When you open a command URL, the serial monitor should show logs such as:

```text
[HTTP] GET /command
[COMMAND] Pump 1 -> on (GPIO 25)
```

## If the relay works backwards

Open:

`firmware/esp32-dev/src/main.cpp`

Find:

```cpp
const int RELAY_ON = LOW;
const int RELAY_OFF = HIGH;
```

If your relay turns on when it should be off, swap the values:

```cpp
const int RELAY_ON = HIGH;
const int RELAY_OFF = LOW;
```

