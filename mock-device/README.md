# MQTT Client Mock Device

## Usage

```bash
npm run dev <MQTT_CLIENT_ULID>

# Example
npm run dev ANTONIOMARTINEZCUSTOMULID1
```

In this case, the MQTT_CLIENT_ID will be the current system username and MQTT_BROKER_URL will be 'mqtt://localhost'.

### Power ON the device

Send MQTT message:

```
{
  "type":"COMMAND",
  "id":"MYCOMMANDCUSTOMULID1234567",
  "name":"START",
  "payload":
  {
     "reason": "start_cloud_command"
  }
}
```

to the MQTT topic:

```
eda-poc/devices/[deviceId]/commands/
```

to 'commands' queue.

### Power OFF the device

Send MQTT message:

```
{
  "type":"COMMAND",
  "id":"MYCOMMANDCUSTOMULID1234567",
  "name":"STOP",
  "payload":
  {
     "reason": "stop_cloud_command"
  }
}
```

to the MQTT topic:

```
eda-poc/devices/[deviceId]/commands/
```

### Enable telemetry of the device

Send MQTT message:

```
{
  "type":"COMMAND",
  "id":"MYCOMMANDCUSTOMULID1234567",
  "name":"ENABLE_TELEMETRY",
  "payload":
  {
     "reason": "enable_telemetry_cloud_command"
  }
}
```

to the MQTT topic:

```
eda-poc/devices/[deviceId]/commands/
```

### Disable telemetry of the device

Send MQTT message:

```
{
  "type":"COMMAND",
  "id":"MYCOMMANDCUSTOMULID1234567",
  "name":"DISABLE_TELEMETRY",
  "payload":
  {
     "reason": "disable_telemetry_cloud_command"
  }
}
```

to the MQTT topic:

```
eda-poc/devices/[deviceId]/commands/
```

### Set dimmer value for the device

Send MQTT message:
(Value must be a number between 0 and 100)

```
{
  "type":"COMMAND",
  "id":"MYCOMMANDCUSTOMULID1234567",
  "name":"SET_DIMMER",
  "payload":
  {
     "value": 50
  }
}
```
