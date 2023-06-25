import mysql, { OkPacket } from 'mysql2';
import { Device } from 'src/domain/entities/device';
import { DeviceRepository } from '../../domain/interfaces/device-repository';
import { DeviceRow } from './entities/device';

export class MysqlDeviceRepository implements DeviceRepository {
  private db: mysql.Connection;

  constructor(mysqlClient: mysql.Connection) {
    this.db = mysqlClient;
  }

  static create(mysqlClient: mysql.Connection): MysqlDeviceRepository {
    return new MysqlDeviceRepository(mysqlClient);
  }

  public async findAll(): Promise<Device[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
      this.db.query<DeviceRow[]>(`SELECT * FROM devices`, (err, res) => {
        if (err || res.length == 0) {
          console.log('No devices found ', err);
          resolve([]);
        } else {
          const devices = res.map((row) => {
            const status = row.connected === 1 ? true : false;
            const device: Device = {
              deviceId: row.deviceId,
              connected: status,
              dimmer: row.dimmer,
              created_at: row.created_at,
              updated_at: row.updated_at,
            };
            return device;
          });
          resolve(devices);
        }
      });
    });
  }

  public async find(deviceId: string): Promise<Error | Device | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
      this.db.query<DeviceRow[]>(
        `SELECT * FROM devices WHERE deviceId = ?`,
        [deviceId],
        (err, res) => {
          if (err || res.length == 0) {
            console.log('No device found ', err);
            resolve(undefined);
          } else {
            const status = res?.[0].connected === 1 ? true : false;
            const device: Device = {
              deviceId: res?.[0].deviceId,
              connected: status,
              dimmer: res?.[0].dimmer,
              created_at: res?.[0].created_at,
              updated_at: res?.[0].updated_at,
            };
            resolve(device);
          }
        },
      );
    });
  }

  public async save(device: Device): Promise<Error | Device> {
    return new Promise(async (resolve, reject) => {
      this.db.query<OkPacket>(
        `INSERT INTO devices (deviceId, connected, dimmer, created_at, updated_at) VALUES(?,?,?,?,?)`,
        [
          device.deviceId,
          device.connected,
          device.dimmer,
          device.created_at,
          device.updated_at,
        ],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (err, res) => {
          if (err) reject(err);
          else
            this.find(device.deviceId)
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              .then((device) => resolve(device!))
              .catch(reject);
        },
      );
    });
  }

  public async update(device: Device): Promise<Error | Device> {
    return new Promise(async (resolve, reject) => {
      this.db.query<OkPacket>(
        `UPDATE devices SET connected = ?, dimmer = ?, updated_at = ? WHERE deviceId = ?`,
        [device.connected, device.dimmer, device.updated_at, device.deviceId],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (err, res) => {
          if (err) reject(err);
          else
            this.find(device.deviceId)
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              .then((device) => resolve(device!))
              .catch(reject);
        },
      );
    });
  }
}
