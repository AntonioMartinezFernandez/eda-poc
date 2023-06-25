import { RowDataPacket } from 'mysql2';

export interface DeviceRow extends RowDataPacket {
  deviceId: string;
  connected: number;
  created_at: number;
  updated_at: number;
}
