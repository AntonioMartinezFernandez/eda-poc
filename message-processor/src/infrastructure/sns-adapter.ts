import { CloudQueueProducer } from '../domain/interfaces/cloud-queue-producer';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export class SnsAdapter implements CloudQueueProducer {
  private endpoint: string;
  private region: string;
  private arn: string;
  private client: SNSClient | undefined;

  constructor(endpoint: string, region: string, arn: string) {
    this.endpoint = endpoint;
    this.region = region;
    this.arn = arn;
  }

  public async send(message: string): Promise<void | Error> {
    const params = {
      Message: message,
      TopicArn: this.arn,
    };

    try {
      if (this.client === undefined) {
        return new Error('SNS client not initialized');
      }
      const data = await this.client.send(new PublishCommand(params));
      console.log('SNS status code: ', data.$metadata.httpStatusCode);
      return;
    } catch (err) {
      return new Error('error sending message to SNS');
    }
  }

  public async start(): Promise<void> {
    const client = new SNSClient({
      region: this.region,
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
      },
    });
    this.client = client;
    console.log('SNS client started');
  }

  public stop(): void {
    this.client = undefined;
    console.log('SNS client stopped');
  }

  static create(endpoint: string, region: string, arn: string) {
    return new SnsAdapter(endpoint, region, arn);
  }
}
