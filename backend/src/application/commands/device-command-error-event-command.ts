import { Command } from 'depot-command-bus';

export class DeviceCommandErrorEventCommand implements Command {
  private _commandId: string;
  private _deviceId: string;
  private _error: string;

  constructor(commandId: string, deviceId: string, error: string) {
    this._commandId = commandId;
    this._deviceId = deviceId;
    this._error = error;
  }

  get commandId(): string {
    return this._commandId;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  get error(): string {
    return this._error;
  }

  public getName(): string {
    return 'DeviceCommandErrorEvent';
  }
}
