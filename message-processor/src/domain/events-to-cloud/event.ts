import { v4 as uuidV4 } from 'uuid';
import { MessageFromDevice } from '../events-from-device/message-from-device';

// Command Result Event
export interface CommandResult {
  data: Data;
  meta: Meta;
}

export interface Data {
  type: string;
  id: string;
  attributes: Attributes;
}

export interface Attributes {
  id: string;
  device_uid: string;
  message: string;
  error: string;
  received_at: number;
}

export interface Meta {
  service: string;
  version: string;
  created_at: number;
}

// Status Event
export interface StatusEvent {
  data: StatusData;
  meta: StatusMeta;
}

export interface StatusData {
  type: string;
  id: string;
  attributes: StatusAttributes;
}

export interface StatusAttributes {
  device_uid: string;
  dimmer: number;
}

export interface StatusMeta {
  service: string;
  version: string;
  created_at: number;
}

export class NewFromDeviceDomainEvent {
  static create(
    event: MessageFromDevice,
    deviceId: string,
  ): CommandResult | StatusEvent | Error {
    try {
      const eventName = event.name;
      let domainEvent;

      // Command result
      if (eventName === 'COMMAND_RESULT' || eventName === 'COMMAND_ERROR') {
        const commandResultEvent: CommandResult = {
          data: {
            type: event.name,
            id: uuidV4(),
            attributes: {
              id: event.payload.command_id || 'invalid_command_id',
              device_uid: deviceId,
              message: event.payload.message || '',
              error: event.payload.error || '',
              received_at: Date.now(),
            },
          },
          meta: {
            service: 'message-processor',
            version: '1.0.0',
            created_at: event.ocurredOn,
          },
        };
        domainEvent = commandResultEvent;
      }

      // Status
      if (eventName === 'STATUS') {
        const statusEvent: StatusEvent = {
          data: {
            type: event.name,
            id: uuidV4(),
            attributes: {
              device_uid: deviceId,
              dimmer: event.payload.dimmer || 0,
            },
          },
          meta: {
            service: 'message-processor',
            version: '1.0.0',
            created_at: event.ocurredOn,
          },
        };
        domainEvent = statusEvent;
      }

      if (domainEvent === undefined) {
        return new Error('Received invalid event from device');
      }
      return domainEvent;
    } catch (err) {
      console.log('Error parsing event from MQTT topic', err);
      return new Error('Error parsing event from device');
    }
  }
}
