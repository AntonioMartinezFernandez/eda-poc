import { Command } from 'depot-command-bus';

export class DeviceTelemetryEventCommand implements Command {
  private _deviceId: string;
  private _sensor: string;
  private _value: string;
  private _createdAt: number;

  constructor(
    deviceId: string,
    sensor: string,
    value: string,
    createdAt: number,
  ) {
    this._deviceId = deviceId;
    this._sensor = sensor;
    this._value = value;
    this._createdAt = createdAt;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  get sensor(): string {
    return this._sensor;
  }

  get value(): string {
    return this._value;
  }

  get createdAt(): number {
    return this._createdAt;
  }

  public getName(): string {
    return 'DeviceTelemetryEvent';
  }
}
