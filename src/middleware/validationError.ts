import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/lib/appError';

const validationError = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new AppError(400, 'ValidationError', errors.array().map(e => e.msg).join(', '));
  }
  
  next();
};

export default validationError;
