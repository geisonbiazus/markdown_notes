import { Request, Response } from 'express';

export function authentication(req: Request, res: Response, next: () => void) {
  const header = req.header('Authorization');

  const token = header?.split('Bearer ')[1];

  if (token) {
    next();
    return;
  }

  res.status(401);
  res.json({ status: 'error', type: 'unauthorized' });
}
