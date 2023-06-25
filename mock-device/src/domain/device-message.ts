import { ulid } from 'ulid';

export type deviceMessageType = 'EVENT' | 'TELEMETRY';

export class DeviceMessage {
  public readonly id: string = ulid();
  constructor(
    public readonly type: deviceMessageType,
    public readonly name: string,
    public readonly payload: Record<string, unknown>,
    public readonly ocurredOn?: number,
  ) {}

  public asString(): string {
    return JSON.stringify(this);
  }

  static new(
    type: deviceMessageType,
    name: string,
    payload: Record<string, unknown>,
    ocurredOn?: number,
  ): DeviceMessage {
    return new DeviceMessage(type, name, payload, ocurredOn);
  }
}
