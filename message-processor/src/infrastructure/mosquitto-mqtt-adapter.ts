import { DeviceTransceiver } from '../domain/interfaces/device-transceiver';
import { Configuration } from '../_config/configuration';
import {
  IClientPublishOptions,
  connect as mqttConnect,
  IClientOptions,
  MqttClient,
} from 'mqtt';

const config = new Configuration();

export class MosquittoMqttAdapter implements DeviceTransceiver {
  private mqttClient: MqttClient | null = null;
  private readonly connectionTopic: string;
  private readonly clientName: string = 'gateway-control';
  private readonly LWTmessage = {
    topic: `${config.gatewayTopic}/${this.clientName}/connectivity`,
    payload: 'false',
    qos: config.qualityOfService,
    retain: false,
  };
  private readonly mqttClientConfiguration: IClientOptions = {
    clientId: this.clientName,
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
    clean: true,
    will: this.LWTmessage,
  };
  private readonly mqttClientPublishOptions: IClientPublishOptions = {
    retain: false,
    qos: config.qualityOfService,
  };

  protected constructor(gatewayName: string, connectionTopic: string) {
    this.clientName = gatewayName;
    this.connectionTopic = connectionTopic;
    this.LWTmessage.topic = `${config.gatewayTopic}/${gatewayName}/connectivity`;
  }

  private changeConnectionStatus(): void {
    this.mqttClient?.publish(
      this.connectionTopic,
      this.mqttClient.connected.toString(),
    );
    console.log(`MQTT connected: ${this.mqttClient?.connected}`);
  }

  private onError(error: Error) {
    console.log(`MQTT connection error: ${error}`);
  }

  public client(): MqttClient {
    if (!this.mqttClient) {
      throw new Error('MQTT client not initialized');
    }

    return this.mqttClient;
  }

  public subscribeToTopics(topics: string[]): void {
    topics.forEach((topic) => {
      if (!this.mqttClient) {
        return;
      }
      this.mqttClient.subscribe(
        topic,
        { qos: config.qualityOfService },
        (_err, granted) => {
          console.log(granted);
        },
      );
    });
  }

  public sendMessage(topic: string, message: string): void | Error {
    if (!this.mqttClient) {
      return;
    }

    let errorResult: null | Error = null;

    this.mqttClient.publish(
      topic,
      message,
      this.mqttClientPublishOptions,
      (msg) => {
        if (msg instanceof Error) {
          errorResult = msg;
        }
      },
    );

    if (errorResult) return errorResult;
  }

  public async start(): Promise<void> {
    if (!this.mqttClient || this.mqttClient.disconnected) {
      console.log('Start MQTT connection...');
      this.mqttClient = mqttConnect(
        config.mqttBroker,
        this.mqttClientConfiguration,
      );

      this.mqttClient.on('connect', () => this.changeConnectionStatus());
      this.mqttClient.on('disconnect', () => this.changeConnectionStatus());
      this.mqttClient.on('error', (error) => this.onError(error));
    }
  }

  public stop() {
    if (this.mqttClient && this.mqttClient.connected) {
      console.log('Stop MQTT connection...');
      this.mqttClient?.publish(this.connectionTopic, 'false');
      this.mqttClient.end();
    }
  }

  public static create(
    gatewayName: string,
    connectionTopic: string,
  ): MosquittoMqttAdapter {
    return new MosquittoMqttAdapter(gatewayName, connectionTopic);
  }
}
