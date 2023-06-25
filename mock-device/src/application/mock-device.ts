import { CloudCommand } from '../domain/cloud-command';
import { DeviceMessage } from '../domain/device-message';
import { DeviceTransceiver } from '../domain/device-transceiver';

export class MockDevice {
  private deviceTransceiver: DeviceTransceiver;
  // Initial status
  private telemetryActivated = false;
  private inService = false;
  private dimmer = 0;

  constructor(deviceTransceiver: DeviceTransceiver) {
    this.deviceTransceiver = deviceTransceiver;
  }

  private startCommandProcessor() {
    this.deviceTransceiver
      .receivedCommandObservable()
      .subscribe(async (command) => {
        try {
          const parsedCommand: CloudCommand = await JSON.parse(command);
          console.log('Received command: \n', parsedCommand);
          switch (parsedCommand.name) {
            case 'START':
              if (this.inService) {
                console.log('Device already in service');
                this.sendCommandErrorEvent(
                  parsedCommand.id,
                  'Device already started',
                  command,
                );
                break;
              }
              this.inService = true;
              console.log('Device in service');
              this.sendCommandResultEvent(parsedCommand.id, 'Device started');
              break;
            case 'STOP':
              if (!this.inService) {
                console.log('Device already stopped');
                this.sendCommandErrorEvent(
                  parsedCommand.id,
                  'Device already stopped',
                  command,
                );
                break;
              }
              this.inService = false;
              console.log('Device out of service');
              this.sendCommandResultEvent(parsedCommand.id, 'Device stopped');
              break;
            case 'ENABLE_TELEMETRY':
              if (this.telemetryActivated) {
                console.log('Telemetry already enabled');
                this.sendCommandErrorEvent(
                  parsedCommand.id,
                  'Telemetry already enabled',
                  command,
                );
                break;
              }
              this.telemetryActivated = true;
              console.log('Telemetry enabled');
              this.sendCommandResultEvent(
                parsedCommand.id,
                'Telemetry enabled',
              );
              break;
            case 'DISABLE_TELEMETRY':
              if (!this.telemetryActivated) {
                console.log('Telemetry already disabled');
                this.sendCommandErrorEvent(
                  parsedCommand.id,
                  'Telemetry already disabled',
                  command,
                );
                break;
              }
              this.telemetryActivated = false;
              console.log('Telemetry disabled');
              this.sendCommandResultEvent(
                parsedCommand.id,
                'Telemetry disabled',
              );
              break;
            case 'SET_DIMMER':
              const value = parsedCommand.payload.value;
              if (typeof value != 'number' || value < 0 || value > 100) {
                console.log('Dimmer value must be a number between 0 and 100');
                this.sendCommandErrorEvent(
                  parsedCommand.id,
                  'Dimmer value must be a number between 0 and 100',
                  command,
                );
                break;
              }
              console.log('Setting dimmer to: ', parsedCommand.payload.value);
              this.dimmer = value;
              this.sendCommandResultEvent(
                parsedCommand.id,
                `Dimmer set to ${value}`,
              );
              this.sendStatusEvent(value);
              break;
            default:
              console.log('Command not recognized');
              this.sendCommandErrorEvent(
                parsedCommand.id,
                'Command not recognized',
                command,
              );
              break;
          }
        } catch (error) {
          console.error('Received command that can not be parsed to JSON');
          this.sendCommandErrorEvent(
            undefined,
            'Invalid Command format',
            command,
          );
        }
      });
  }

  private sendStatusEvent(dimmer: number) {
    const statusEvent: DeviceMessage = DeviceMessage.new(
      'EVENT',
      'STATUS',
      { dimmer: dimmer },
      Date.now(),
    );

    this.deviceTransceiver.sendCommonEvent(statusEvent);
  }

  private sendCommandResultEvent(id: string, message: string) {
    const commandResult: DeviceMessage = DeviceMessage.new(
      'EVENT',
      'COMMAND_RESULT',
      { command_id: id, message: message },
      Date.now(),
    );

    this.deviceTransceiver.sendCommonEvent(commandResult);
  }

  private sendCommandErrorEvent(
    id: string | undefined,
    error: string,
    command: string,
  ) {
    const commandError: DeviceMessage = DeviceMessage.new(
      'EVENT',
      'COMMAND_ERROR',
      { command_id: id, error: error, command: command },
      Date.now(),
    );

    this.deviceTransceiver.sendCommonEvent(commandError);
  }

  private sendTelemetryEvent(
    eventName: string,
    sensor: string,
    value: string | number,
  ) {
    const telemetryEvent: DeviceMessage = DeviceMessage.new(
      'TELEMETRY',
      eventName,
      { sensor: sensor, value: value },
      Date.now(),
    );

    if (this.telemetryActivated) {
      this.deviceTransceiver.sendTelemetryEvent(telemetryEvent);
    }
  }

  public start() {
    this.startCommandProcessor();

    // Send random telemetry events every 10 seconds
    setInterval(() => {
      const randomTemperature = Math.floor(Math.random() * 10) + 20;

      if (this.telemetryActivated) {
        this.sendTelemetryEvent(
          'TEMPERATURE',
          'device_temperature',
          randomTemperature,
        );
      }
    }, 5000);
  }
}
