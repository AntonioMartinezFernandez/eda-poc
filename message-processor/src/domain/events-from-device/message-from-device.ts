export interface MessageFromDevice {
  type: string;
  name: string;
  payload: MessageFromDevicePayload;
  ocurredOn: number;
  id: string;
}

export interface MessageFromDevicePayload {
  command_id?: string;
  message?: string;
  error?: string;
  dimmer?: number;
}
