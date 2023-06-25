import { Command } from 'depot-command-bus';

export class DeviceCommandResultEventCommand implements Command {
  private _commandId: string;
  private _deviceId: string;
  private _message: string;

  constructor(commandId: string, deviceId: string, message: string) {
    this._commandId = commandId;
    this._deviceId = deviceId;
    this._message = message;
  }

  get commandId(): string {
    return this._commandId;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  get message(): string {
    return this._message;
  }

  public getName(): string {
    return 'DeviceCommandResultEvent';
  }
}
