import { Command } from 'depot-command-bus';

export class RequestedDeviceEventCommand implements Command {
  private _deviceId: string;

  constructor(deviceId: string) {
    this._deviceId = deviceId;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  public getName(): string {
    return 'RequestedDeviceEvent';
  }
}
