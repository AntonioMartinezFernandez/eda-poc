import { v4 as uuidV4 } from 'uuid';
import { TelemetryFromDevice } from '../events-from-device/telemetry-from-device';

export interface TelemetryEvent {
  data: Data;
  meta: Meta;
}

export interface Data {
  type: string;
  id: string;
  attributes: Attributes;
}

export interface Attributes {
  device_uid: string;
  sensor: string;
  value: string | number;
  received_at: number;
}

export interface Meta {
  service: string;
  version: string;
  created_at: number;
}

export class NewTelemetryEvent {
  static create(
    event: TelemetryFromDevice,
    deviceId: string,
  ): TelemetryEvent | Error {
    try {
      const telemetryEvent: TelemetryEvent = {
        data: {
          type: 'TELEMETRY',
          id: uuidV4(),
          attributes: {
            device_uid: deviceId,
            sensor: event.payload.sensor,
            value: event.payload.value,
            received_at: Date.now(),
          },
        },
        meta: {
          service: 'message-processor',
          version: '1.0.0',
          created_at: event.ocurredOn,
        },
      };

      return telemetryEvent;
    } catch (err) {
      console.log('Error parsing event from MQTT topic', err);
      return new Error('Error parsing event from device');
    }
  }
}
