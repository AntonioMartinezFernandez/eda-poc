import { Handler } from 'depot-command-bus';
import { DeviceTelemetryEventCommand } from '../commands/device-telemetry-event-command';
import { DeviceRepository } from '../../domain/interfaces/device-repository';
import { ClientRepository } from '../../domain/interfaces/client-repository';
import { GatewayWsPublisher } from '../../domain/interfaces/gateway-ws-publisher';

export class DeviceTelemetryEventCommandHandler implements Handler {
  private deviceRepo: DeviceRepository;
  private clientRepo: ClientRepository;
  private websocketsPublisher: GatewayWsPublisher;

  constructor(
    deviceRepo: DeviceRepository,
    clientRepo: ClientRepository,
    websocketsPublisher: GatewayWsPublisher,
  ) {
    this.deviceRepo = deviceRepo;
    this.clientRepo = clientRepo;
    this.websocketsPublisher = websocketsPublisher;
  }

  async handle(command: DeviceTelemetryEventCommand): Promise<any> {
    if (command.getName() !== 'DeviceTelemetryEvent') {
      console.log(
        'Invalid command received at DeviceTelemetryEventCommandHandler',
      );
      return;
    }

    const device = await this.deviceRepo.find(command.deviceId);
    const clients = await this.clientRepo.findClients(command.deviceId);

    console.log('handling CommandResult event for device ', device);

    if (clients === null || clients instanceof Error) {
      return new Error('Client not found');
    }

    for (const client of clients) {
      await this.websocketsPublisher.publish(client.clientId, {
        type: 'Telemetry',
        payload: {
          deviceId: command.deviceId,
          sensor: command.sensor,
          value: command.value,
          timestamp: command.createdAt,
        },
      });
      console.log('Notified client ', client.clientId);
    }
  }
}
