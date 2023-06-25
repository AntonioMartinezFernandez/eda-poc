import { Handler } from 'depot-command-bus';
import { RequestedDevicesEventCommand } from '../commands/requested-devices-event-command';
import { DeviceRepository } from 'src/domain/interfaces/device-repository';

export class RequestedDevicesEventCommandHandler implements Handler {
  private deviceRepository: DeviceRepository;
  constructor(deviceRepository: DeviceRepository) {
    this.deviceRepository = deviceRepository;
  }

  async handle(command: RequestedDevicesEventCommand): Promise<any> {
    if (command.getName() !== 'RequestedDevicesEvent') {
      console.log(
        'Invalid command received at RequestedDevicesEventCommandHandler',
      );
      return;
    }

    const devices = await this.deviceRepository.findAll();

    return devices;
  }
}
