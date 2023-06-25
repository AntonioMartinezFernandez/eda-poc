import { Command } from 'depot-command-bus';

export class ClientMessageEventCommand implements Command {
  private _deviceId: string;
  private _connectionId: string;
  private _message: string;

  constructor(deviceId: string, connectionId: string, message: string) {
    this._deviceId = deviceId;
    this._connectionId = connectionId;
    this._message = message;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  get connectionId(): string {
    return this._connectionId;
  }

  get message(): string {
    return this._message;
  }

  public getName(): string {
    return 'ClientMessageEvent';
  }
}
