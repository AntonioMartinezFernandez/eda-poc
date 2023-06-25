export type DeviceConnectivityEvent = {
  data: DeviceConnectivityEventData;
  meta: DeviceConnectivityEventMeta;
};

export type DeviceConnectivityEventData = {
  type: 'DEVICE_CONNECTED' | 'DEVICE_DISCONNECTED';
  id: string;
  attributes: DeviceConnectivityEventDataAttributes;
};

export type DeviceConnectivityEventDataAttributes = {
  id: string;
  received_at: number;
};

export type DeviceConnectivityEventMeta = {
  service: string;
  version: string;
  created_at: number;
};

/******  Examples ******
{
  data: {
      type: 'DEVICE_CONNECTED',
      id: 'MYCOMMANDCUSTOMULID1234567',
      attributes: {
        id: 'ANTONIOMARTINEZCUSTOMULID1',
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

{
  data: {
      type: 'DEVICE_DISCONNECTED',
      id: 'MYCOMMANDCUSTOMULID1234567',
      attributes: {
        id: 'ANTONIOMARTINEZCUSTOMULID1',
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
