# Firmware API

This document describes the simple Phase 1 HTTP API for the ESP32 Dev starter.

## Base URL

Example:

```text
http://192.168.1.50
```

## Endpoints

### `GET /`

Health check endpoint.

Example response:

```text
ESP32 Dev pump controller is running.
```

### `GET /status`

Returns the current state of the 3 pumps.

Example response:

```json
{
  "pump1": false,
  "pump2": false,
  "pump3": false
}
```

### `GET /pump?id=pump1&state=on`

Turns a specific pump on or off.

Allowed values:
- `id`: `pump1`, `pump2`, `pump3`
- `state`: `on`, `off`

Example:

```text
GET /pump?id=pump2&state=off
```

Example response:

```json
{
  "pump1": false,
  "pump2": false,
  "pump3": true
}
```

## Notes for the future web app

- Keep requests simple and readable
- Return JSON for control and status endpoints
- Later phases can add authentication, sensor data, and scheduling

