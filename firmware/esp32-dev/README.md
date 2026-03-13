# ESP32 Dev Starter

This folder contains a simple starter project for an ESP32 Dev board.

Current hardware scope:
- 3 pumps

Starter behavior:
- Connects to Wi-Fi
- Exposes a small HTTP API
- Lets you turn Pump 1, Pump 2, and Pump 3 on or off

Important:
- This is only a starter scaffold for Phase 1.
- It does not change the current React app.
- Pin numbers are examples and can be updated later in `src/main.cpp` and `../../docs/hardware/PIN_MAP.md`.

Recommended next phase:
1. Confirm the real relay module type
2. Confirm safe GPIO pins for the ESP32 Dev board
3. Match the web command format to the firmware API

