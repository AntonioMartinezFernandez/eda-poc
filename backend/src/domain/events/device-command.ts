import { v4 as uuidV4 } from 'uuid';

export type DeviceCommand = {
  command: string;
  command_version: string;
  json_command_rfc: string;
  command_id: string;
  producer: string;
  sent_on: number;
  parameters: DeviceCommandParameters;
  meta: Record<string, unknown>;
};

export type DeviceCommandParameters = {
  id: string;
  payload: Record<string, unknown>;
};

export class DeviceCommandFactory {
  static create(
    command: string,
    devideUlid: string,
    payload?: Record<string, unknown>,
  ): DeviceCommand {
    const deviceCommand: DeviceCommand = {
      command,
      command_version: '1.0.0',
      json_command_rfc: '1.0.0',
      command_id: uuidV4(),
      producer: 'backend-service',
      sent_on: Date.now(),
      parameters: {
        id: devideUlid,
        payload: payload || {},
      },
      meta: {
        service: 'backend',
        version: '1.0.0',
        created_at: Date.now(),
      },
    };
    return deviceCommand;
  }
}

/******  Examples ******
{
  command: 'START',
  command_version: '1.0',
  json_command_rfc: '1.0',
  command_id: 'MYCOMMANDCUSTOMULID1234567',
  producer: 'backend-app',
  sent_on: 1592486288638,
  parameters: {
    id: 'ANTONIOMARTINEZCUSTOMULID1',
    payload: {}
  },
  meta: {
    service: 'backend-app',
    version: '1.0.0',
    created_at: 1234123412341 },
}

{
  command: 'STOP',
  command_version: '1.0',
  json_command_rfc: '1.0',
  command_id: 'MYCOMMANDCUSTOMULID1234567',
  producer: 'backend-app',
  sent_on: 1592486288638,
  parameters: {
    id: 'ANTONIOMARTINEZCUSTOMULID1',
    payload: {}
  },
  meta: {
    service: 'backend-app',
    version: '1.0.0',
    created_at: 1234123412341 },
}

{
  command: 'ENABLE_TELEMETRY',
  command_version: '1.0',
  json_command_rfc: '1.0',
  command_id: 'MYCOMMANDCUSTOMULID1234567',
  producer: 'backend-app',
  sent_on: 1592486288638,
  parameters: {
    id: 'ANTONIOMARTINEZCUSTOMULID1',
    payload: {}
  },
  meta: {
    service: 'backend-app',
    version: '1.0.0',
    created_at: 1592486288638,
  },
}

{
  command: 'DISABLE_TELEMETRY',
  command_version: '1.0',
  json_command_rfc: '1.0',
  command_id: 'MYCOMMANDCUSTOMULID1234567',
  producer: 'backend-app',
  sent_on: 1592486288638,
  parameters: {
    id: 'ANTONIOMARTINEZCUSTOMULID1',
    payload: {}
  },
  meta: {
    service: 'backend-app',
    version: '1.0.0',
    created_at: 1592486288638,
  },
}

{
  command: 'SET_DIMMER',
  command_version: '1.0',
  json_command_rfc: '1.0',
  command_id: 'MYCOMMANDCUSTOMULID1234567',
  producer: 'backend-app',
  sent_on: 1592486288638,
  parameters: {
    id: 'ANTONIOMARTINEZCUSTOMULID1',
    payload: {
      value: 50
    }
  },
  meta: {
    service: 'backend-app',
    version: '1.0.0',
    created_at: 1592486288638,
  },
}
***********************/
