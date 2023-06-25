import { Handler } from 'depot-command-bus';
import { DeviceConnectivityEventCommand } from '../commands/device-connectivity-event-command';
import { DeviceRepository } from '../../domain/interfaces/device-repository';
import { ClientRepository } from '../../domain/interfaces/client-repository';
import { GatewayWsPublisher } from '../../domain/interfaces/gateway-ws-publisher';
import { Device } from '../../domain/entities/device';

export class DeviceConnectivityEventCommandHandler implements Handler {
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

  async handle(command: DeviceConnectivityEventCommand): Promise<any> {
    if (command.getName() !== 'DeviceConnectivityEvent') {
      console.log(
        'Invalid command received at DeviceConnectivityEventCommandHandler',
      );
      return;
    }

    const device = await this.deviceRepo.find(command.deviceId);
    const clients = await this.clientRepo.findClients(command.deviceId);

    if (device instanceof Error) {
      console.log('Error while finding device ', device);
    } else {
      let deviceNow: Device;
      console.log(device);
      if (device === undefined) {
        deviceNow = {
          deviceId: command.deviceId,
          connected:
            command.connectivityStatus === 'DEVICE_CONNECTED' ? true : false,
          dimmer: 0,
          created_at: Date.now(),
          updated_at: Date.now(),
        };
        await this.deviceRepo.save(deviceNow);
      } else {
        deviceNow = {
          deviceId: command.deviceId,
          connected:
            command.connectivityStatus === 'DEVICE_CONNECTED' ? true : false,
          dimmer: device.dimmer,
          created_at: Date.now(),
          updated_at: Date.now(),
        };
        await this.deviceRepo.update(deviceNow);
      }
    }

    if (clients === null || clients instanceof Error) {
      console.log('No clients found for device');
      return;
    }
    for (const client of clients) {
      await this.websocketsPublisher.publish(client.clientId, {
        type: 'DeviceConnectivity',
        payload: {
          deviceId: command.deviceId,
          connectivityStatus: command.connectivityStatus,
        },
      });
      console.log('Notified client ', client.clientId);
    }
  }
}
