import { Handler } from 'depot-command-bus';
import { DeviceCommandErrorEventCommand } from '../commands/device-command-error-event-command';
import { DeviceRepository } from '../../domain/interfaces/device-repository';
import { ClientRepository } from '../../domain/interfaces/client-repository';
import { GatewayWsPublisher } from '../../domain/interfaces/gateway-ws-publisher';

export class DeviceCommandErrorEventCommandHandler implements Handler {
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

  async handle(command: DeviceCommandErrorEventCommand): Promise<any> {
    if (command.getName() !== 'DeviceCommandErrorEvent') {
      console.log(
        'Invalid command received at DeviceCommandErrorEventCommandHandler',
      );
      return;
    }

    const device = await this.deviceRepo.find(command.deviceId);
    const clients = await this.clientRepo.findClients(command.deviceId);

    console.log('handling CommandError event for device ', device);

    if (clients === null || clients instanceof Error) {
      return new Error('Client not found');
    }

    for (const client of clients) {
      await this.websocketsPublisher.publish(client.clientId, {
        type: 'CommandError',
        payload: {
          deviceId: command.deviceId,
          commandId: command.commandId,
          error: command.error,
        },
      });
      console.log('Notified client ', client.clientId);
    }
  }
}
