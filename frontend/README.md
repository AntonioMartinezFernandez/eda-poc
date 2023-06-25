# Implemented WS messages are:

## FRONT TO BACKEND

Enable Telemetry:
{"deviceId": "ANTONIOMARTINEZCUSTOMULID1", "command": "ENABLE_TELEMETRY","command_version": "1.0"}

Disable Telemetry:
{"deviceId": "ANTONIOMARTINEZCUSTOMULID1", "command": "DISABLE_TELEMETRY","command_version": "1.0"}

Start Device:
{"deviceId": "ANTONIOMARTINEZCUSTOMULID1", "command": "START","command_version": "1.0"}

Stop Device:
{"deviceId": "ANTONIOMARTINEZCUSTOMULID1", "command": "STOP","command_version": "1.0"}

Set Dimmer:
{"deviceId": "ANTONIOMARTINEZCUSTOMULID1", "command": "SET_DIMMER","command_version": "1.0", "value":50}

## BACKEND TO FRONT

{"type":"Status","payload":{"deviceId":"ANTONIOMARTINEZCUSTOMULID1","dimmer":100}}

{"type":"DeviceConnectivity","payload":{"deviceId":"ANTONIOMARTINEZCUSTOMULID1","connectivityStatus":"DEVICE_CONNECTED"}}

{"type":"DeviceConnectivity","payload":{"deviceId":"ANTONIOMARTINEZCUSTOMULID1","connectivityStatus":"DEVICE_DISCONNECTED"}}

{"type":"Telemetry","payload":{"deviceId":"ANTONIOMARTINEZCUSTOMULID1","sensor":"device_temperature","value":22,"timestamp":1687379737049}}

{"type":"CommandResult","payload":{"deviceId":"ANTONIOMARTINEZCUSTOMULID1","commandId":"01H3FTJGBEVJYM23491RBJ6ADX","message":"Telemetry enabled"}}

{"type":"CommandError","payload":{"deviceId":"ANTONIOMARTINEZCUSTOMULID1","commandId":"01H3FTJGBEVJYM23491RBJ6ADX","error":"Telemetry already disabled"}}
