export interface DeviceCommand {
  type: string;
  id: string;
  name: string;
  payload: Record<string, unknown> | undefined | unknown;
}
