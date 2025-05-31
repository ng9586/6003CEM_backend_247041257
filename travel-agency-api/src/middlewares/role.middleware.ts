import { Request, Response, NextFunction } from 'express';

export const requireOperator = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'operator') {
    return res.status(403).json({ message: 'Access denied. Operator only.' });
  }
  next();
};
