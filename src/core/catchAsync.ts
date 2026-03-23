import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an asynchronous function and forwards any errors to the next middleware.
 * This eliminates the need for repeated try/catch blocks in controllers.
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
