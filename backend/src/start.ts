import { Configuration } from './_config/configuration';
const config = Configuration.create();
import { BackendCommandBus } from './application/command-bus';
import { HttpServer } from './infrastructure/http/server';
import { RedisClientRepository } from './infrastructure/persistence/redis-client-repository';
import { MysqlDeviceRepository } from './infrastructure/persistence/mysql-device-repository';
import { FetchGatewayWebsockets } from './infrastructure/websockets/fetch-gateway-websockets';
import { SqsConsumer } from './infrastructure/events/sqs-consumer';
import { SnsPublisher } from './infrastructure/events/sns-publisher';
import { RedisClient } from './infrastructure/persistence/adapters/redis-client';
import { MysqlClient } from './infrastructure/persistence/adapters/mysql-client';

const redisClient = RedisClient.create(config.redisHost, config.redisPort);
const mysqlClient = MysqlClient.create(
  config.mysqlHost,
  config.mysqlPort,
  config.mysqlUser,
  config.mysqlPassword,
  config.mysqlDatabase,
);

const clientRepository = RedisClientRepository.create(redisClient);
const deviceRepository = MysqlDeviceRepository.create(mysqlClient);

const websocketsPublisher = FetchGatewayWebsockets.create(
  config.gatewayWebsocketsUrl,
);

const snsPublisher = SnsPublisher.create(
  config.awsRegion,
  config.awsEndpoint,
  config.awsAccessKeyId,
  config.awsSecretAccessKey,
  config.toDeviceSnsTopicArn,
);

const commandBus = BackendCommandBus.create(
  clientRepository,
  deviceRepository,
  websocketsPublisher,
  snsPublisher,
);

const sqsConsumer = SqsConsumer.create(
  config.awsRegion,
  config.awsEndpoint,
  config.awsAccessKeyId,
  config.awsSecretAccessKey,
  config.ToCloudSqsQueueUrl,
  commandBus,
);

const httpServer = HttpServer.create(config.httpPort, commandBus);

const start = async () => {
  httpServer.start();
  sqsConsumer.start();
};

console.clear();
start();
