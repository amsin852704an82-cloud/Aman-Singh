import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  
  // Log full error stack in error.log
  logger.error({
    message: err.message,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
    ip: req.ip
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).json({
    success: false,
    error: isProduction && statusCode === 500 ? 'Something went wrong' : (err.message || 'Internal Server Error'),
    requestId: (res as any).sentry || undefined,
    ...(isProduction ? {} : { stack: err.stack })
  });
};
