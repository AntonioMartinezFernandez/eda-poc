import * as sysInfo from 'systeminformation';
import * as dotenv from 'dotenv';
import { QoS } from 'mqtt';
dotenv.config();

export class Configuration {
  MQTT_CLIENT_ID: string;
  MQTT_BROKER: string = process.env.MQTT_BROKER_URL as string;
  MQTT_USER: string = process.env.MQTT_USER as string;
  MQTT_PASSWORD: string = process.env.MQTT_PASSWORD as string;
  MQTT_DEVICES_BASE_TOPIC: string = process.env
    .MQTT_DEVICES_BASE_TOPIC as string;
  connectedTopic: string;
  eventsTopic: string;
  commandsTopic: string;
  telemetryTopic: string;
  mqttQualityOfService: QoS = parseInt(process.env.MQTT_QOS as string) as QoS;

  constructor(mqttClientId: string) {
    this.MQTT_CLIENT_ID = mqttClientId;
    this.connectedTopic = `${process.env.MQTT_DEVICES_BASE_TOPIC}/${mqttClientId}/connectivity`;
    this.eventsTopic = `${process.env.MQTT_DEVICES_BASE_TOPIC}/${mqttClientId}/events`;
    this.commandsTopic = `${process.env.MQTT_DEVICES_BASE_TOPIC}/${mqttClientId}/commands`;
    this.telemetryTopic = `${process.env.MQTT_DEVICES_BASE_TOPIC}/${mqttClientId}/telemetry`;
  }

  static async create(): Promise<Configuration> {
    // Environment MQTT_CLIENT_ID
    const envClientId =
      process.argv[2] || (process.env.MQTT_CLIENT_ID as string);
    if (envClientId) {
      console.log(`MQTT_CLIENT_ID: ${envClientId}`);
      return new Configuration(envClientId);
    }

    // System username as MQTT_CLIENT_ID
    const data = await sysInfo.users();
    const clientId = data[0].user;
    console.log(`MQTT_CLIENT_ID: ${clientId}`);
    return new Configuration(data[0].user);
  }
}
