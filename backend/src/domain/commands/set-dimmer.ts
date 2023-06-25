import { ulid } from 'ulid';

export type SetDimmer = {
  command: string;
  command_version: string;
  json_command_rfc: string;
  command_id: string;
  producer: string;
  sent_on: number;
  parameters: {
    id: string;
    payload: {
      value: number;
    };
  };
  meta: {
    service: string;
    version: string;
    created_at: number;
  };
};

export const createSetDimmerCommand = (
  deviceId: string,
  commandVersion: string,
  value: number,
): SetDimmer => {
  return {
    command: 'SET_DIMMER',
    command_version: commandVersion,
    json_command_rfc: '1.0',
    command_id: ulid(),
    producer: 'backend',
    sent_on: Date.now(),
    parameters: {
      id: deviceId,
      payload: {
        value: value,
      },
    },
    meta: {
      service: 'backend',
      version: '1.0',
      created_at: Date.now(),
    },
  };
};
