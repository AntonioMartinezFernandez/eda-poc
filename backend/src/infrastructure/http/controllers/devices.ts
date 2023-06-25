import { Depot as CommandBus } from 'depot-command-bus';
import { Request, Response } from 'express';
import { RequestedDevicesEventCommand } from '../../../application/commands/requested-devices-event-command';

export const devicesController =
  (commandBus: CommandBus) => async (req: Request, res: Response) => {
    const command = new RequestedDevicesEventCommand();
    const commandResult = await commandBus.dispatch(command);
    res.send(commandResult);
  };
