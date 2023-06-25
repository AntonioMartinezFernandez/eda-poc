import { Handler } from 'depot-command-bus';
import { DeviceStatusEventCommand } from '../commands/device-status-event-command';
import { DeviceRepository } from '../../domain/interfaces/device-repository';
import { ClientRepository } from '../../domain/interfaces/client-repository';
import { GatewayWsPublisher } from '../../domain/interfaces/gateway-ws-publisher';

export class DeviceStatusEventCommandHandler implements Handler {
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

  async handle(command: DeviceStatusEventCommand): Promise<any> {
    if (command.getName() !== 'DeviceStatusEvent') {
      console.log(
        'Invalid command received at DeviceStatusEventCommandHandler',
      );
      return;
    }

    const device = await this.deviceRepo.find(command.deviceId);
    const clients = await this.clientRepo.findClients(command.deviceId);

    if (device === undefined || device instanceof Error) {
      return new Error('Device not found');
    }

    const updatedDevice = {
      deviceId: command.deviceId,
      connected: device.connected,
      dimmer: command.dimmer,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    await this.deviceRepo.update(updatedDevice);

    console.log('handling Status event for device ', device);

    if (clients === null || clients instanceof Error) {
      return new Error('Client not found');
    }

    for (const client of clients) {
      await this.websocketsPublisher.publish(client.clientId, {
        type: 'Status',
        payload: {
          deviceId: command.deviceId,
          commandId: command.commandId,
          dimmer: command.dimmer,
        },
      });
      console.log('Notified client ', client.clientId);
    }
  }
}
