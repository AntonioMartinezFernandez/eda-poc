import * as dotenv from 'dotenv';
import { QoS } from 'mqtt';
dotenv.config();

export class Configuration {
  service_id = 'message-processor';
  mqttBroker: string = process.env.MQTT_BROKER_URL as string;
  mqttUser: string = process.env.MQTT_USER as string;
  mqttPassword: string = process.env.MQTT_PASSWORD as string;
  gatewayTopic: string = process.env.MQTT_GATEWAYS_BASE_TOPIC as string;
  gatewayConnectionTopic = `${this.gatewayTopic}/${this.service_id}/connectivity`;
  devicesConnectivityTopic = `${process.env.MQTT_DEVICES_BASE_TOPIC}/+/connectivity`;
  devicesEventsTopic = `${process.env.MQTT_DEVICES_BASE_TOPIC}/+/events`;
  devicesTelemetryTopic = `${process.env.MQTT_DEVICES_BASE_TOPIC}/+/telemetry`;
  devicesCommandsTopic = `${process.env.MQTT_DEVICES_BASE_TOPIC}/+/commands`;
  qualityOfService: QoS = 2;
  snsTopicArn: string = process.env.TO_CLOUD_SNS_TOPIC_ARN as string;
  sqsQueueUrl: string = process.env.TO_DEVICE_SQS_QUEUE_URL as string;
  awsEndpoint: string = process.env.AWS_ENDPOINT as string;
  awsRegion: string = process.env.AWS_REGION as string;

  static create() {
    return new Configuration();
  }
}
