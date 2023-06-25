import { CloudQueueConsumer } from '../domain/interfaces/cloud-queue-consumer';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageBatchCommand,
  ReceiveMessageCommandOutput,
  Message,
  AddPermissionCommandInput,
  AddPermissionCommand,
} from '@aws-sdk/client-sqs';

export class SqsAdapter implements CloudQueueConsumer {
  private endpoint: string;
  private region: string;
  private url: string;
  private sqsParams: any;
  private client: SQSClient;
  private started = false;

  constructor(endpoint: string, region: string, url: string) {
    this.endpoint = endpoint;
    this.region = region;
    this.url = url;

    this.sqsParams = {
      MaxNumberOfMessages: 5,
      QueueUrl: this.url,
      VisibilityTimeout: 5,
      WaitTimeSeconds: 5,
    };
  }

  public async consume(callback: (msg: string) => void): Promise<void> {
    while (this.started) {
      try {
        const rmc = new ReceiveMessageCommand(this.sqsParams);
        const data: ReceiveMessageCommandOutput = await this.client.send(rmc);
        if (data.Messages) {
          // NOTE: Could await next call but performance is better when called async
          this.processReceivedMessages(data.Messages, callback);
        }
      } catch (err) {
        console.log('Error handling SQS messages', err);
      }
    }
  }

  public async start(): Promise<void> {
    this.started = true;

    const client = new SQSClient({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
      },
    });

    const params: AddPermissionCommandInput = {
      AWSAccountIds: ['*'],
      Actions: ['ListQueues', 'SendMessage', 'ReceiveMessage', 'DeleteMessage'],
      Label: 'AllowAll',
      QueueUrl: this.url,
    };
    const command = new AddPermissionCommand(params);

    try {
      await client.send(command);
    } catch (error) {
      console.log('Error', error);
    }

    this.client = client;
    console.log('SQS client started');
  }

  public stop(): void {
    this.started = false;
  }

  private async processReceivedMessages(
    messages: Message[],
    callback: (msg: string) => void,
  ) {
    for (const msg of messages) {
      if (msg.Body === undefined) continue;

      console.log('Message received from cloud: \n', msg.Body);

      const body = await JSON.parse(msg.Body);

      callback(body.Message);
    }

    try {
      const deleteBatchParams = {
        QueueUrl: this.url,
        Entries: messages.map((message, index) => ({
          Id: `${index}`,
          ReceiptHandle: message.ReceiptHandle,
        })),
      };

      const dmbc = new DeleteMessageBatchCommand(deleteBatchParams);
      await this.client.send(dmbc);
    } catch (err) {
      console.log('Error deleting batch messages', err);
    }
  }

  static create(endpoint: string, region: string, url: string) {
    return new SqsAdapter(endpoint, region, url);
  }
}
