import { ulid } from 'ulid';

export type EnableTelemetry = {
  command: string;
  command_version: string;
  json_command_rfc: string;
  command_id: string;
  producer: string;
  sent_on: number;
  parameters: {
    id: string;
    payload: object;
  };
  meta: {
    service: string;
    version: string;
    created_at: number;
  };
};

export const createEnableTelemetryCommand = (
  deviceId: string,
  commandVersion: string,
): EnableTelemetry => {
  return {
    command: 'ENABLE_TELEMETRY',
    command_version: commandVersion,
    json_command_rfc: '1.0',
    command_id: ulid(),
    producer: 'backend',
    sent_on: Date.now(),
    parameters: {
      id: deviceId,
      payload: {},
    },
    meta: {
      service: 'backend',
      version: '1.0',
      created_at: Date.now(),
    },
  };
};
