export type DeviceTelemetryEvent = {
  data: DeviceTelemetryEventData;
  meta: DeviceTelemetryEventMeta;
};

export type DeviceTelemetryEventData = {
  type: 'TELEMETRY';
  id: string;
  attributes: DeviceTelemetryEventDataAttributes;
};

export type DeviceTelemetryEventDataAttributes = {
  device_uid: string;
  sensor: string;
  value: string | number;
  received_at: number;
};

export type DeviceTelemetryEventMeta = {
  service: string;
  version: string;
  created_at: number;
};

/******  Example ******
{
  data: {
      type: 'TELEMETRY',
      id: 'MYCOMMANDCUSTOMULID1234567',
      attributes: {
        device_uid: 'ANTONIOMARTINEZCUSTOMULID1',
        sensor: 'temperature',
        value: 25,
        received_at: 1234567890123,
      },
    },
    meta: {
      service: 'message-processor',
      version: '1.0.0',
      created_at: 1234567890123,
    },
  }
}
***********************/
