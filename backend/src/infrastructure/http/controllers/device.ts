import { Depot as CommandBus } from 'depot-command-bus';
import { Request, Response } from 'express';
import { RequestedDeviceEventCommand } from '../../../application/commands/requested-device-event-command';

export const deviceController =
  (commandBus: CommandBus) => async (req: Request, res: Response) => {
    const deviceId = req.params.deviceId;
    const command = new RequestedDeviceEventCommand(deviceId);
    const commandResult = await commandBus.dispatch(command);
    res.send(commandResult);
  };
