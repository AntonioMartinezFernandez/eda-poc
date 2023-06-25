import { Handler } from 'depot-command-bus';
import { RequestedDeviceEventCommand } from '../commands/requested-device-event-command';
import { DeviceRepository } from 'src/domain/interfaces/device-repository';

export class RequestedDeviceEventCommandHandler implements Handler {
  private deviceRepository: DeviceRepository;
  constructor(deviceRepository: DeviceRepository) {
    this.deviceRepository = deviceRepository;
  }

  async handle(command: RequestedDeviceEventCommand): Promise<any> {
    if (command.getName() !== 'RequestedDeviceEvent') {
      console.log(
        'Invalid command received at RequestedDeviceEventCommandHandler',
      );
      return;
    }

    const device = await this.deviceRepository.find(command.deviceId);

    return device;
  }
}
