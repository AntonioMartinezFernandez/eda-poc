import { Handler } from 'depot-command-bus';
import { ClientMessageEventCommand } from '../commands/client-message-event-command';
import { DeviceRepository } from '../../domain/interfaces/device-repository';
import { ClientRepository } from '../../domain/interfaces/client-repository';
import { SnsPublisher } from '../../infrastructure/events/sns-publisher';
import { createEnableTelemetryCommand } from '../../domain/commands/enable-telemetry';
import { createDisableTelemetryCommand } from '../../domain/commands/disable-telemetry';
import { createStopDeviceCommand } from '../../domain/commands/stop-device';
import { createStartDeviceCommand } from '../../domain/commands/start-device';
import { createSetDimmerCommand } from '../../domain/commands/set-dimmer';

export class ClientMessageEventCommandHandler implements Handler {
  private clientRepository: ClientRepository;
  private deviceRepository: DeviceRepository;
  private snsPublisher: SnsPublisher;
  constructor(
    clientRepository: ClientRepository,
    deviceRepository: DeviceRepository,
    snsPublisher: SnsPublisher,
  ) {
    this.clientRepository = clientRepository;
    this.deviceRepository = deviceRepository;
    this.snsPublisher = snsPublisher;
  }

  async handle(command: ClientMessageEventCommand): Promise<any> {
    if (command.getName() !== 'ClientMessageEvent') {
      console.log(
        'Invalid command received at ClientMessageEventCommandHandler',
      );
      return;
    }

    await this.deviceRepository.find(command.deviceId);
    const message = await JSON.parse(command.message);

    let deviceCommand: any;

    if (message.command === 'ENABLE_TELEMETRY') {
      deviceCommand = createEnableTelemetryCommand(
        command.deviceId,
        message.command_version,
      );
    }

    if (message.command === 'DISABLE_TELEMETRY') {
      deviceCommand = createDisableTelemetryCommand(
        command.deviceId,
        message.command_version,
      );
    }

    if (message.command === 'START') {
      deviceCommand = createStartDeviceCommand(
        command.deviceId,
        message.command_version,
      );
    }

    if (message.command === 'STOP') {
      deviceCommand = createStopDeviceCommand(
        command.deviceId,
        message.command_version,
      );
    }

    if (message.command === 'SET_DIMMER') {
      deviceCommand = createSetDimmerCommand(
        command.deviceId,
        message.command_version,
        message.value,
      );
    }

    console.log('Publishing message ', deviceCommand);

    this.snsPublisher.publish(JSON.stringify(deviceCommand));

    return command.getName();
  }
}
