import { Configuration } from './_config/configuration';
const config = Configuration.create();
import { MosquittoMqttAdapter } from './infrastructure/mosquitto-mqtt-adapter';
import { SnsAdapter } from './infrastructure/sns-adapter';
import { SqsAdapter } from './infrastructure/sqs-adapter';
import { MessageProcessor } from './application/message-processor';
import chalk from 'chalk';

const mqttClient = MosquittoMqttAdapter.create(
  config.service_id,
  config.gatewayConnectionTopic,
);

const sqsClient = SqsAdapter.create(
  config.awsEndpoint,
  config.awsRegion,
  config.sqsQueueUrl,
);
const snsClient = SnsAdapter.create(
  config.awsEndpoint,
  config.awsRegion,
  config.snsTopicArn,
);

const subscribedTopics = [
  config.devicesConnectivityTopic,
  config.devicesEventsTopic,
  config.devicesTelemetryTopic,
];

const messageProcessor = MessageProcessor.create(
  sqsClient,
  snsClient,
  mqttClient,
  subscribedTopics,
);

console.clear();
console.log(chalk.underline.bold.italic.blue('Message Processor Service'));
messageProcessor.start();
