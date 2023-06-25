import { Router } from 'express';
import { Depot as CommandBus } from 'depot-command-bus';
import {
  healthController,
  deviceController,
  devicesController,
  wsConnectController,
  wsDisconnectController,
  wsMessageController,
} from './controllers/index';

export class HttpRouter {
  static create(commandBus: CommandBus) {
    const router = Router();

    router.get('/health', healthController);
    router.get('/device/:deviceId', deviceController(commandBus));
    router.get('/devices', devicesController(commandBus));

    router.post('/ws/connect', wsConnectController(commandBus));
    router.post('/ws/disconnect', wsDisconnectController(commandBus));
    router.post('/ws/message', wsMessageController(commandBus));

    return router;
  }
}
