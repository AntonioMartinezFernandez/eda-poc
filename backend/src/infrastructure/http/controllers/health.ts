import { Request, Response } from 'express';

export const healthController = async (req: Request, res: Response) => {
  res.send({ status: 'ok' });
};
