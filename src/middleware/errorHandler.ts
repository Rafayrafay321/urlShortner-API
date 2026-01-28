// Custom imports
import { AppError } from '@/lib/appError';
import logger from '@/lib/winston';

// Types
import type { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
) => {
  // If the error is an instatance of our custom AppError, use its properties.
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
    return;
  }

  // For any other unexpected error log the error and send generic 500 response
  logger.error('UNHANDLED_ERROR', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(500).json({
    code: 'Server Error',
    message: 'An unexpected error occurred.',
  });
};

export default errorHandler;
