# ESP32 Dev Pin Map

This is the active starter pin map for the first real ESP32 Dev test.

## Scope

- Board: ESP32 Dev
- Outputs: 3 pump relay channels

## Active mapping used by the firmware

| Device | ESP32 Pin | Notes |
| --- | --- | --- |
| Pump 1 Relay | GPIO 25 | Used in `firmware/esp32-dev/src/main.cpp` |
| Pump 2 Relay | GPIO 26 | Used in `firmware/esp32-dev/src/main.cpp` |
| Pump 3 Relay | GPIO 27 | Used in `firmware/esp32-dev/src/main.cpp` |

## Wiring summary

- Relay input for Pump 1 -> GPIO 25
- Relay input for Pump 2 -> GPIO 26
- Relay input for Pump 3 -> GPIO 27
- ESP32 GND -> relay GND

Do not connect pump power directly to the ESP32.

## Important warnings

- Confirm the real relay board input logic before power-on
- Many relay modules are active LOW
- Do not power pumps directly from ESP32 GPIO pins
- Use a proper relay module or driver circuit
- Share ground correctly if required by the relay design

## To confirm before hardware testing

1. Relay board voltage
2. Active LOW vs active HIGH logic
3. Safe shared ground wiring
4. Pump power supply size
5. Emergency stop strategy

## Beginner note

If you need different pins later, only change these constants:

```cpp
const int PUMP_1_PIN = 25;
const int PUMP_2_PIN = 26;
const int PUMP_3_PIN = 27;
```
