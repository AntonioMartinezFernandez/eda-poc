import { RedisClientType } from 'redis';
import { Client } from 'src/domain/entities/client';
import { ClientRepository } from '../../domain/interfaces/client-repository';

export class RedisClientRepository implements ClientRepository {
  private client: RedisClientType;
  private prefix = 'clients_';

  constructor(client: RedisClientType) {
    this.client = client;
  }

  static create(client: RedisClientType): RedisClientRepository {
    return new RedisClientRepository(client);
  }

  public async findClients(deviceId: string): Promise<Client[] | null | Error> {
    console.log('findClients method of RedisClientRepository called ', {
      deviceId,
    });

    const savedClients = await this.client.get(this.prefix + deviceId);

    if (savedClients === null) {
      return null;
    }

    const parsedClients = await JSON.parse(savedClients);
    return parsedClients;
  }

  public async saveConnection(
    clientId: string,
    deviceId: string,
  ): Promise<void | Error> {
    console.log('saveConnection method of RedisClientRepository called ', {
      clientId,
      deviceId,
    });

    const savedClients = await this.findClients(deviceId);
    if (savedClients instanceof Error) {
      return new Error('Error retrieving clients');
    }

    const clients: Client[] = [];
    if (savedClients === null) {
      clients.push({ clientId: clientId, deviceId: deviceId });
    } else {
      for (const client of savedClients) {
        clients.push(client);
      }
      clients.push({ clientId: clientId, deviceId: deviceId });
    }

    await this.client.set(this.prefix + deviceId, JSON.stringify(clients));
  }

  public async removeConnection(
    clientId: string,
    deviceId: string,
  ): Promise<void | Error> {
    console.log('removeConnection method of RedisClientRepository called ', {
      clientId,
      deviceId,
    });

    const savedClients = await this.findClients(deviceId);
    if (savedClients instanceof Error) {
      return new Error('Error retrieving clients');
    }

    if (savedClients === null) {
      return;
    }

    const clients = savedClients.filter(
      (client) => client.clientId !== clientId,
    );

    await this.client.set(this.prefix + deviceId, JSON.stringify(clients));
  }
}
