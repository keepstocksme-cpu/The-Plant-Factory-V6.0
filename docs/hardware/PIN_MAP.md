# ESP32 Dev Pin Map

This is a starter pin map for the first hardware scope.

## Scope

- Board: ESP32 Dev
- Outputs: 3 pump relay channels

## Starter mapping

| Device | ESP32 Pin | Notes |
| --- | --- | --- |
| Pump 1 Relay | GPIO 25 | Example starter pin |
| Pump 2 Relay | GPIO 26 | Example starter pin |
| Pump 3 Relay | GPIO 27 | Example starter pin |

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

