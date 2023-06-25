import { Request, Response } from 'express';
import { Depot as CommandBus } from 'depot-command-bus';
import { ClientMessageEventCommand } from '../../../application/commands/client-message-event-command';

export const wsMessageController =
  (commandBus: CommandBus) => async (req: Request, res: Response) => {
    console.log('received', req.body);

    const parsedMessage = JSON.parse(req.body.message);
    if (parsedMessage.deviceId === undefined) {
      console.log('Invalid message received');
      res.sendStatus(200);
      return;
    }

    const command = new ClientMessageEventCommand(
      parsedMessage.deviceId,
      req.body.connectionId,
      req.body.message,
    );

    await commandBus.dispatch(command);

    res.sendStatus(200);
  };
