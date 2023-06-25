import { MqttClient } from 'mqtt';

export interface DeviceTransceiver {
  client(): MqttClient;
  start(): Promise<void>;
  stop(): void;
  subscribeToTopics(topics: string[]): void;
  sendMessage(topic: string, message: string): void | Error;
}
