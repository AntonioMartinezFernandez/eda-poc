export type CommandResult = {
  data: CommandResultData;
  meta: CommandResultMeta;
};

export type CommandResultData = {
  type: 'COMMAND_RESULT | COMMAND_ERROR';
  id: string;
  attributes: CommandResultDataAttributes;
};

export type CommandResultDataAttributes = {
  id: string;
  device_uid: string;
  message: string;
  error: string;
  received_at: number;
};

export type CommandResultMeta = {
  service: string;
  version: string;
  created_at: number;
};

/******  Examples ******
{
  data: {
      type: 'COMMAND_RESULT',
      id: 'c598a0bf-5263-4872-a958-eeb0e3378780',
      attributes: {
        id: 'MYCOMMANDCUSTOMULID1234567',
        device_uid: 'ANTONIOMARTINEZCUSTOMULID1',
        message: 'Telemetry enabled',
        error: '',
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
    type: 'COMMAND_ERROR',
    id: 'c598a0bf-5263-4872-a958-eeb0e3378780',
    attributes: {
      id: 'MYCOMMANDCUSTOMULID1234567',
      device_uid: 'ANTONIOMARTINEZCUSTOMULID1',
      "message":"",
      "error":"Device already started",
      received_at: 1687108419636,
    },
  },
  meta: {
    service: 'message-processor',
    version: '1.0.0',
    created_at: 1687108419631,
  },
}
***********************/
