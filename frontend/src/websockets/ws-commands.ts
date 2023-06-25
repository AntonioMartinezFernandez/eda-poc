import { w3cwebsocket } from 'websocket';

export class WsCommands {
  private deviceId: string;
  private wsConnection: w3cwebsocket;

  constructor(deviceId: string, wsConnection: w3cwebsocket) {
    this.deviceId = deviceId;
    this.wsConnection = wsConnection;
  }

  public sendStart() {
    const command = JSON.stringify({
      deviceId: this.deviceId,
      command: 'START',
      command_version: '1.0',
    });

    this.wsConnection.send(command);
  }

  public sendStop() {
    const command = JSON.stringify({
      deviceId: this.deviceId,
      command: 'STOP',
      command_version: '1.0',
    });

    this.wsConnection.send(command);
  }

  public sendEnableTelemetry() {
    const command = JSON.stringify({
      deviceId: this.deviceId,
      command: 'ENABLE_TELEMETRY',
      command_version: '1.0',
    });

    this.wsConnection.send(command);
  }

  public sendDisableTelemetry() {
    const command = JSON.stringify({
      deviceId: this.deviceId,
      command: 'DISABLE_TELEMETRY',
      command_version: '1.0',
    });

    this.wsConnection.send(command);
  }

  public sendSetDimmer(value: number) {
    const command = JSON.stringify({
      deviceId: this.deviceId,
      command: 'SET_DIMMER',
      command_version: '1.0',
      value: value,
    });

    this.wsConnection.send(command);
  }
}
