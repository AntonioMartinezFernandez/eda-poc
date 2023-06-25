import * as dotenv from 'dotenv';
dotenv.config();

export class Configuration {
  awsRegion = process.env.AWS_REGION as string;
  awsEndpoint = process.env.AWS_ENDPOINT as string;
  awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
  awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
  toDeviceSnsTopicArn = process.env.TO_DEVICE_SNS_TOPIC_ARN as string;
  ToCloudSqsQueueUrl = process.env.TO_CLOUD_SQS_QUEUE_URL as string;
  mysqlHost = process.env.MYSQL_HOST as string;
  mysqlPort = process.env.MYSQL_PORT as string;
  mysqlUser = process.env.MYSQL_USER as string;
  mysqlPassword = process.env.MYSQL_PASSWORD as string;
  mysqlDatabase = process.env.MYSQL_DB as string;
  redisHost = process.env.REDIS_HOST as string;
  redisPort = process.env.REDIS_PORT as string;
  httpPort = process.env.BACKEND_HTTP_PORT as string;
  gatewayWebsocketsUrl = process.env.GATEWAY_WEBSOCKETS_URL as string;
  static create() {
    return new Configuration();
  }
}
