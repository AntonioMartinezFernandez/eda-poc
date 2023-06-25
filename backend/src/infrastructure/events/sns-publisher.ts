import { EventPublisher } from '../../domain/interfaces/event-publisher';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export class SnsPublisher implements EventPublisher {
  private arn: string;
  private client: SNSClient | undefined;

  constructor(
    region: string,
    endpoint: string,
    awsAccessKey: string,
    awsSecretAccessKey: string,
    arn: string,
  ) {
    this.arn = arn;

    const client = new SNSClient({
      region: region,
      endpoint: endpoint,
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    this.client = client;
  }

  public async publish(message: string): Promise<void | Error> {
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

  static create(
    region: string,
    endpoint: string,
    awsAccessKey: string,
    awsSecretAccessKey: string,
    arn: string,
  ) {
    return new SnsPublisher(
      region,
      endpoint,
      awsAccessKey,
      awsSecretAccessKey,
      arn,
    );
  }
}
