export type WsDeviceMessage = {
  type:
    | 'DeviceConnectivity'
    | 'Telemetry'
    | 'CommandResult'
    | 'CommandError'
    | 'Status';
  payload: Record<string, unknown>;
};
