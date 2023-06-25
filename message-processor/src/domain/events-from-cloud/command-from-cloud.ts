export type DeviceCommandFromCloud = {
  command: string;
  command_version: string;
  json_command_rfc: string;
  command_id: string;
  producer: string;
  sent_on: number;
  parameters: DeviceCommandFromCloudParameters;
  meta: Record<string, unknown>;
};

export type DeviceCommandFromCloudParameters = {
  id: string;
  payload: Record<string, unknown>;
};
