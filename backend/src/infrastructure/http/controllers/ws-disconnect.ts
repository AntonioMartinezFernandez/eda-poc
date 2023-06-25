import { Depot as CommandBus } from 'depot-command-bus';
import { ClientDisconnectedEventCommand } from '../../../application/commands/client-disconnected-event-command';
import { Request, Response } from 'express';

export const wsDisconnectController =
  (commandBus: CommandBus) => async (req: Request, res: Response) => {
    const command = new ClientDisconnectedEventCommand(
      req.body.connectionId,
      req.body.deviceId,
    );

    await commandBus.dispatch(command);

    res.sendStatus(200);
  };
