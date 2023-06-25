import { Client } from '../entities/client';

export interface ClientRepository {
  findClients(deviceId: string): Promise<Client[] | null | Error>;
  saveConnection(clientId: string, deviceId: string): Promise<void | Error>;
  removeConnection(clientId: string, deviceId: string): Promise<void | Error>;
}
