import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/errors';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
  // Enhanced logging in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${error.message}`, error.stack);
  } else {
    console.error(`[Error] ${error.message}`);
  }

  // Handle known application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
    return;
  }

  // Handle unexpected errors appropriately
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
}
