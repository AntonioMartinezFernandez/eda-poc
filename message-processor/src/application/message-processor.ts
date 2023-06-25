import { DeviceTransceiver } from '../domain/interfaces/device-transceiver';
import { CloudQueueConsumer } from '../domain/interfaces/cloud-queue-consumer';
import { CloudQueueProducer } from '../domain/interfaces/cloud-queue-producer';
import { NewConnectivityEvent } from '../domain/events-to-cloud/connectivity';
import { NewFromDeviceDomainEvent } from '../domain/events-to-cloud/event';
import { NewTelemetryEvent } from '../domain/events-to-cloud/telemetry';
import { NewMessageToDevice } from '../domain/events-to-device/message-to-device';

export class MessageProcessor {
  private deviceTransceiver: DeviceTransceiver;
  private consumer: CloudQueueConsumer;
  private producer: CloudQueueProducer;
  private subscribedTopics: string[];
  private transceiverConnected = false;

  protected constructor(
    consumer: CloudQueueConsumer,
    producer: CloudQueueProducer,
    deviceTransceiver: DeviceTransceiver,
    subscribedTopics: string[],
  ) {
    this.consumer = consumer;
    this.producer = producer;
    this.deviceTransceiver = deviceTransceiver;
    this.subscribedTopics = subscribedTopics;
  }

  private async deviceEventsRouter(topic: string, payload: Buffer) {
    try {
      const bufferPayload = Buffer.from(payload);
      const dataFromDevice = await JSON.parse(bufferPayload.toString());
      const parsedTopic = topic.split('/');
      const topicRoute = parsedTopic[3];
      const deviceId = parsedTopic[2];

      console.log(
        `Event received from MQTT topic "${topic}": \n`,
        dataFromDevice,
      );

      switch (topicRoute) {
        case 'connectivity':
          let connected = false;
          if (dataFromDevice) {
            connected = true;
          }
          this.publishConnectivityMessage(connected, deviceId);
          break;
        case 'events':
          this.publishEventMessage(dataFromDevice, deviceId);
          break;
        case 'telemetry':
          this.publishTelemetryMessage(dataFromDevice, deviceId);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(`Error parsing event from MQTT topic "${topic}"`);
    }
  }

  private publishConnectivityMessage(connected: boolean, deviceId: string) {
    const event = NewConnectivityEvent.create(connected, deviceId);

    console.log(
      `Publishing connectivity event to cloud: ${JSON.stringify(event)}`,
    );
    this.producer.send(JSON.stringify(event));
  }

  private publishEventMessage(dataFromDevice: any, deviceId: string) {
    const event = NewFromDeviceDomainEvent.create(dataFromDevice, deviceId);

    console.log(`Publishing device event to cloud: ${JSON.stringify(event)}`);
    this.producer.send(JSON.stringify(event));
  }

  private publishTelemetryMessage(dataFromDevice: any, deviceId: string) {
    const event = NewTelemetryEvent.create(dataFromDevice, deviceId);

    console.log(
      `Publishing telemetry event to cloud: ${JSON.stringify(event)}`,
    );
    this.producer.send(JSON.stringify(event));
  }

  private sendDeviceMessage(): any {
    return async (commandFromCloud: string) => {
      try {
        const messageToDevice = await NewMessageToDevice.parse(
          commandFromCloud,
        );

        if (messageToDevice instanceof Error) {
          console.log('Received invalid command from cloud');
          return;
        }

        const topic = `eda-poc/devices/${messageToDevice.deviceId}/commands`;
        const command = JSON.stringify(messageToDevice.command);

        console.log(`Command ${command} sent to ${topic}`);
        this.deviceTransceiver.sendMessage(topic, command);
      } catch (error) {
        console.error('Error sending command to device: ', error);
      }
    };
  }

  public async start(): Promise<void> {
    if (this.transceiverConnected === false) {
      // PROCESS DEVICE MESSAGES
      await this.deviceTransceiver.start();

      this.deviceTransceiver
        .client()
        .on('message', (topic, payload) =>
          this.deviceEventsRouter(topic, payload),
        );

      this.deviceTransceiver.subscribeToTopics(this.subscribedTopics);
      this.transceiverConnected = true;

      // START PRODUCER
      await this.producer.start();

      // PROCESS CLOUD MESSAGES
      await this.consumer.start();
      this.consumer.consume(this.sendDeviceMessage());
    }
  }

  public stop(): void {
    if (this.transceiverConnected === true) {
      this.deviceTransceiver.stop();
      this.transceiverConnected = false;
    }
  }

  static create(
    consumer: CloudQueueConsumer,
    producer: CloudQueueProducer,
    deviceTransceiver: DeviceTransceiver,
    subscribedTopics: string[],
  ) {
    return new MessageProcessor(
      consumer,
      producer,
      deviceTransceiver,
      subscribedTopics,
    );
  }
}
