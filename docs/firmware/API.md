# Firmware API

This is the Phase 2 HTTP API for first real testing on an ESP32 Dev board.

## Base URL

Replace the IP with your ESP32 IP from the serial monitor.

```text
http://192.168.1.50
```

## Endpoints

### `GET /`

Simple health check.

Example response:

```json
{
  "ok": true,
  "message": "ESP32 Dev pump controller is running"
}
```

### `GET /status`

Returns the current state of all 3 pumps.

Example response:

```json
{
  "device": "pump",
  "pump1": false,
  "pump2": false,
  "pump3": false
}
```

### `GET /command?device=pump&id=1&state=on`

Turns Pump 1 on.

### `GET /command?device=pump&id=1&state=off`

Turns Pump 1 off.

Allowed values:
- `device`: `pump`
- `id`: `1`, `2`, `3`
- `state`: `on`, `off`

Example success response:

```json
{
  "ok": true,
  "device": "pump",
  "id": 1,
  "state": "on",
  "pin": 25,
  "status": {
    "device": "pump",
    "pump1": true,
    "pump2": false,
    "pump3": false
  }
}
```

Example error response:

```json
{
  "ok": false,
  "error": "Pump id not found. Use id=1, id=2, or id=3"
}
```

## Browser test URLs

Replace `192.168.1.50` with your real ESP32 IP:

```text
http://192.168.1.50/status
http://192.168.1.50/command?device=pump&id=1&state=on
http://192.168.1.50/command?device=pump&id=1&state=off
http://192.168.1.50/command?device=pump&id=2&state=on
http://192.168.1.50/command?device=pump&id=3&state=off
```

## Serial monitor behavior

The firmware prints simple logs for:
- Wi-Fi connection
- Assigned IP address
- Pin setup
- Incoming HTTP requests
- Pump on/off commands

