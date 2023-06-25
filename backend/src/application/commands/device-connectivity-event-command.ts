import { Command } from 'depot-command-bus';

export class DeviceConnectivityEventCommand implements Command {
  private _connectivityStatus: string;
  private _deviceId: string;

  constructor(
    connectivityStatus: 'DEVICE_CONNECTED' | 'DEVICE_DISCONNECTED',
    deviceId: string,
  ) {
    this._connectivityStatus = connectivityStatus;
    this._deviceId = deviceId;
  }

  get connectivityStatus(): string {
    return this._connectivityStatus;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  public getName(): string {
    return 'DeviceConnectivityEvent';
  }
}
