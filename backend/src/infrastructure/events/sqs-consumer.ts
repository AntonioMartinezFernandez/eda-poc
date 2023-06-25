import { Depot as CommandBus } from 'depot-command-bus';
import { SQSClient } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';
import { DeviceConnectivityEventCommand } from '../../application/commands/device-connectivity-event-command';
import { EventConsumer } from '../../domain/interfaces/event-consumer';
import { DomainEvent } from '../../domain/events/domain-event';
import { DeviceCommandResultEventCommand } from '../../application/commands/device-command-result-event-command';
import { DeviceCommandErrorEventCommand } from '../../application/commands/device-command-error-event-command';
import { DeviceTelemetryEventCommand } from '../../application/commands/device-telemetry-event-command';
import { DeviceStatusEventCommand } from '../../application/commands/device-status-event-command';

export class SqsConsumer implements EventConsumer {
  private readonly consumer: Consumer;
  private readonly queueUrl: string;
  private commandBus: CommandBus;

  static create(
    region: string,
    endpoint: string,
    awsAccessKeyId: string,
    awsSecretAccessKey: string,
    queueUrl: string,
    commandBus: CommandBus,
  ): SqsConsumer {
    return new SqsConsumer(
      region,
      endpoint,
      awsAccessKeyId,
      awsSecretAccessKey,
      queueUrl,
      commandBus,
    );
  }

  constructor(
    region: string,
    endpoint: string,
    awsAccessKeyId: string,
    awsSecretAccessKey: string,
    queueUrl: string,
    commandBus: CommandBus,
  ) {
    this.queueUrl = queueUrl;
    this.commandBus = commandBus;

    this.consumer = Consumer.create({
      sqs: new SQSClient({
        endpoint: endpoint,
        region: region,
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        },
      }),
      pollingWaitTimeMs: 500,
      handleMessageTimeout: 10,
      shouldDeleteMessages: true,
      queueUrl: queueUrl,
      handleMessage: async (message) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const parsedBody = await JSON.parse(message.Body!);
        const parsedMessage = await JSON.parse(parsedBody.Message);
        this.consume(parsedMessage);
      },
    });

    this.consumer.on('error', (err) => {
      console.error(err.message);
    });

    this.consumer.on('processing_error', (err) => {
      console.error(err.message);
    });
  }

  private async consume(message: DomainEvent): Promise<void> {
    const eventType = message.data.type;
    console.log('Consuming event of type ', eventType);

    if (
      eventType === 'DEVICE_CONNECTED' ||
      eventType === 'DEVICE_DISCONNECTED'
    ) {
      const event = new DeviceConnectivityEventCommand(
        eventType,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.id! as string,
      );
      await this.commandBus.dispatch(event);
      return;
    }

    if (eventType === 'STATUS') {
      const event = new DeviceStatusEventCommand(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.id! as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.device_uid! as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.dimmer! as number,
      );
      await this.commandBus.dispatch(event);
      return;
    }

    if (eventType === 'COMMAND_RESULT') {
      const event = new DeviceCommandResultEventCommand(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.id! as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.device_uid! as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.message! as string,
      );
      await this.commandBus.dispatch(event);
      return;
    }

    if (eventType === 'COMMAND_ERROR') {
      const event = new DeviceCommandErrorEventCommand(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.id! as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.device_uid! as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.error! as string,
      );
      await this.commandBus.dispatch(event);
      return;
    }

    if (eventType === 'TELEMETRY') {
      const event = new DeviceTelemetryEventCommand(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.device_uid! as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.sensor! as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.data.attributes!.value! as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.meta.created_at as number,
      );
      await this.commandBus.dispatch(event);
      return;
    }

    console.log('Event not supported');
  }

  public async start(): Promise<void | Error> {
    console.log('Starting consumer for queue ' + this.queueUrl);
    this.consumer.start();
  }

  public async stop(): Promise<void | Error> {
    this.consumer.stop({ abort: true });
  }
}
