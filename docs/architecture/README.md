# Architecture

## Phase 1 structure

The repository now has three future-facing areas:

- `web/`
  Reserved for the React dashboard package
- `firmware/esp32-dev/`
  Starter firmware for an ESP32 Dev board
- `docs/`
  Shared project documentation

## Current reality

The current React dashboard still runs from the repository root.
Nothing has been moved yet.

## Target direction

Later phases should separate responsibilities like this:

- Web dashboard
  Shows plant status, controls pumps, and keeps Thai, Lao, and English support
- Firmware
  Runs on ESP32 Dev and controls 3 pumps first
- Docs
  Stores architecture, pin map, API contracts, and setup notes

## Integration idea

Simple command flow:

1. User taps a control in the React dashboard
2. Web app sends an HTTP request to the ESP32
3. ESP32 turns a pump on or off
4. ESP32 returns a simple JSON status response

This is intentionally simple for the first hardware phase.

