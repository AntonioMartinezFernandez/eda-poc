import { RedisClientType, createClient } from 'redis';

export class RedisClient {
  private created = false;
  private client: RedisClientType;

  constructor(host: string, port: string) {
    if (this.created) {
      return this;
    }

    this.client = createClient({ url: `redis://${host}:${port}` });
    this.client
      .connect()
      .then(() => {
        console.log('Connected to Redis server');
      })
      .catch((err) => {
        console.log('Redis connection error: ', err);
      });
    this.client.on('error', (err) => console.log('Redis Client Error', err));
    this.created = true;
  }

  static create(host: string, port: string): RedisClientType {
    return new RedisClient(host, port).client;
  }
}
