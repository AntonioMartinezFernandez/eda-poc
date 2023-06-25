import { Command } from 'depot-command-bus';

export class ClientConnectedEventCommand implements Command {
  private _connectionId: string;
  private _deviceId: string;

  constructor(connectionId: string, deviceId: string) {
    this._connectionId = connectionId;
    this._deviceId = deviceId;
  }

  get connectionId(): string {
    return this._connectionId;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  public getName(): string {
    return 'ClientConnectedEvent';
  }
}
