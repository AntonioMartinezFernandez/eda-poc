import { Device } from '../entities/device';

export interface DeviceRepository {
  findAll(): Promise<Device[] | Error>;
  find(deviceId: string): Promise<Device | Error | undefined>;
  save(device: Device): Promise<Device | Error>;
  update(device: Device): Promise<Device | Error>;
}
