import { v4 as uuidV4 } from 'uuid';

export interface ConnectivityEvent {
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
  received_at: number;
}

export interface Meta {
  service: string;
  version: string;
  created_at: number;
}

export class NewConnectivityEvent {
  public static create(
    connected: boolean,
    deviceId: string,
  ): ConnectivityEvent {
    const event: ConnectivityEvent = {
      data: {
        type: connected ? 'DEVICE_CONNECTED' : 'DEVICE_DISCONNECTED',
        id: uuidV4(),
        attributes: {
          id: deviceId,
          received_at: Date.now(),
        },
      },
      meta: {
        service: 'message-processor',
        version: '1.0.0',
        created_at: Date.now(),
      },
    };
    return event;
  }
}
