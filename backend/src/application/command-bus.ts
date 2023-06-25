import { Registry, Depot as CommandBus } from 'depot-command-bus';
import { RequestedDeviceEventCommandHandler } from './handlers/requested-device-event-command-handler';
import { RequestedDevicesEventCommandHandler } from './handlers/requested-devices-event-command-handler';
import { DeviceConnectivityEventCommandHandler } from './handlers/device-connectivity-event-command-handler';
import { ClientConnectedEventCommandHandler } from './handlers/client-connected-event-command-handler';
import { ClientDisconnectedEventCommandHandler } from './handlers/client-disconnected-event-command-handler';
import { ClientMessageEventCommandHandler } from './handlers/client-message-event-command-handler';
import { DeviceStatusEventCommandHandler } from './handlers/device-status-event-command-handler';
import { DeviceCommandResultEventCommandHandler } from './handlers/device-command-result-event-command-handler';
import { DeviceCommandErrorEventCommandHandler } from './handlers/device-command-error-event-command-handler';
import { DeviceTelemetryEventCommandHandler } from './handlers/device-telemetry-event-command-handler';
import { ClientRepository } from '../domain/interfaces/client-repository';
import { DeviceRepository } from '../domain/interfaces/device-repository';
import { GatewayWsPublisher } from '../domain/interfaces/gateway-ws-publisher';
import { SnsPublisher } from '../infrastructure/events/sns-publisher';

export class BackendCommandBus {
  static create(
    clientRepo: ClientRepository,
    deviceRepo: DeviceRepository,
    websocketsPublisher: GatewayWsPublisher,
    snsPublisher: SnsPublisher,
  ): CommandBus {
    const registry = new Registry([
      [
        'RequestedDeviceEvent',
        new RequestedDeviceEventCommandHandler(deviceRepo),
      ],
      [
        'RequestedDevicesEvent',
        new RequestedDevicesEventCommandHandler(deviceRepo),
      ],
      [
        'ClientConnectedEvent',
        new ClientConnectedEventCommandHandler(clientRepo),
      ],
      [
        'ClientDisconnectedEvent',
        new ClientDisconnectedEventCommandHandler(clientRepo),
      ],
      [
        'ClientMessageEvent',
        new ClientMessageEventCommandHandler(
          clientRepo,
          deviceRepo,
          snsPublisher,
        ),
      ],
      [
        'DeviceStatusEvent',
        new DeviceStatusEventCommandHandler(
          deviceRepo,
          clientRepo,
          websocketsPublisher,
        ),
      ],
      [
        'DeviceCommandResultEvent',
        new DeviceCommandResultEventCommandHandler(
          deviceRepo,
          clientRepo,
          websocketsPublisher,
        ),
      ],
      [
        'DeviceCommandErrorEvent',
        new DeviceCommandErrorEventCommandHandler(
          deviceRepo,
          clientRepo,
          websocketsPublisher,
        ),
      ],
      [
        'DeviceConnectivityEvent',
        new DeviceConnectivityEventCommandHandler(
          deviceRepo,
          clientRepo,
          websocketsPublisher,
        ),
      ],
      [
        'DeviceTelemetryEvent',
        new DeviceTelemetryEventCommandHandler(
          deviceRepo,
          clientRepo,
          websocketsPublisher,
        ),
      ],
    ]);

    const commandBus = new CommandBus(registry);

    return commandBus;
  }
}
