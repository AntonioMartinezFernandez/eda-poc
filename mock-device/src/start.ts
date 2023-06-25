import { DeviceMqttConnection } from './infrastructure/DeviceMqttConnection';
import { MockDevice } from './application/mock-device';
import { Configuration } from './config/configuration';
import chalk from 'chalk';

console.clear();
console.log(chalk.underline.bold.italic.blue('Mock Device'));

Configuration.create().then((config) => {
  const deviceMqttConnection = DeviceMqttConnection.create(config);
  const mockedDevice = new MockDevice(deviceMqttConnection);
  mockedDevice.start();
});
