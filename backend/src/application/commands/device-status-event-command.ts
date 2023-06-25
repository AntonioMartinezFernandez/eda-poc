import { Command } from 'depot-command-bus';

export class DeviceStatusEventCommand implements Command {
  private _commandId: string;
  private _deviceId: string;
  private _dimmer: number;

  constructor(commandId: string, deviceId: string, dimmer: number) {
    this._commandId = commandId;
    this._deviceId = deviceId;
    this._dimmer = dimmer;
  }

  get commandId(): string {
    return this._commandId;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  get dimmer(): number {
    return this._dimmer;
  }

  public getName(): string {
    return 'DeviceStatusEvent';
  }
}
