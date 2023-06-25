export interface TelemetryFromDevice {
  type: string;
  name: string;
  payload: TelemetryFromDevicePayload;
  ocurredOn: number;
  id: string;
}

export interface TelemetryFromDevicePayload {
  sensor: string;
  value: string | number;
}
