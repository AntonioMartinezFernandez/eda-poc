import { Configuration } from '../config/configuration';
import { DeviceMessage } from '../domain/device-message';
import {
  connect as mqttConnect,
  IClientOptions,
  IClientPublishOptions,
  MqttClient,
} from 'mqtt';
import { Observable } from 'rxjs';
import { DeviceTransceiver } from '../domain/device-transceiver';

export class DeviceMqttConnection implements DeviceTransceiver {
  private config: Configuration;
  private mqttOptions: IClientOptions;
  private mqttClientPublishOptions: IClientPublishOptions;
  private mqttClient: MqttClient;

  constructor(config: Configuration) {
    this.config = config;
    this.mqttOptions = {
      clientId: config.MQTT_CLIENT_ID,
      username: config.MQTT_USER,
      password: config.MQTT_PASSWORD,
      clean: true,
      // LWT
      will: {
        topic: config.connectedTopic,
        payload: 'false',
        qos: config.mqttQualityOfService,
        retain: false,
      },
    };
    this.mqttClientPublishOptions = {
      retain: false,
      qos: config.mqttQualityOfService,
    };
    this.mqttClient = this.connect();
    this.onError();
    this.onConnect();
  }

  private connect() {
    return mqttConnect(this.config.MQTT_BROKER, this.mqttOptions);
  }

  private onError() {
    this.mqttClient.on('error', (error) => {
      console.error(`MQTT connection error: ${error.message}`);
    });
  }

  private onConnect = () => {
    this.mqttClient.on('connect', () => {
      this.mqttClient.publish(
        this.config.connectedTopic,
        this.mqttClient.connected.toString(),
      );
      console.log(`MQTT connected: ${this.mqttClient.connected}`);
      this.sendCommonEvent(new DeviceMessage('EVENT', 'STATUS', { dimmer: 0 }));
    });
  };

  private sendEvent(topic: string, message: DeviceMessage) {
    try {
      this.mqttClient.publish(
        topic,
        JSON.stringify(message),
        this.mqttClientPublishOptions,
        (msg) => {
          if (msg instanceof Error) {
            console.error(msg);
            return;
          }

          console.log(
            `Sent event '${JSON.stringify(message)}' to topic '${topic}'`,
          );
        },
      );
    } catch (error) {
      console.error(`MQTT sendEvent error: ${error}`);
    }
  }

  public receivedCommandObservable(): Observable<string> {
    return new Observable<string>((observer) => {
      this.mqttClient.subscribe(
        this.config.commandsTopic,
        { qos: this.config.mqttQualityOfService },
        (err, granted) => {
          if (!granted) console.log(err);
          console.log(granted);
        },
      );

      this.mqttClient.on('message', (_topic, payload) => {
        const buffer = Buffer.from(payload).toString();
        observer.next(buffer);
      });
    });
  }

  public sendTelemetryEvent(message: DeviceMessage) {
    this.sendEvent(`${this.config.telemetryTopic}`, message);
  }

  public sendCommonEvent(message: DeviceMessage) {
    this.sendEvent(this.config.eventsTopic, message);
  }

  static create(config: Configuration) {
    return new DeviceMqttConnection(config);
  }
}
