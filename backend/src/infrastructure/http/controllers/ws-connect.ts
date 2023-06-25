import { Depot as CommandBus } from 'depot-command-bus';
import { ClientConnectedEventCommand } from '../../../application/commands/client-connected-event-command';
import { Request, Response } from 'express';

export const wsConnectController =
  (commandBus: CommandBus) => async (req: Request, res: Response) => {
    const command = new ClientConnectedEventCommand(
      req.body.connectionId,
      req.body.deviceId,
    );

    await commandBus.dispatch(command);

    res.sendStatus(200);
  };
