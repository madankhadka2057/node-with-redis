import { Request, Response, NextFunction } from 'express';
import { Security } from '../core/security';
import { AppError } from '../core/errors';
import { catchAsync } from '../core/catchAsync';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1. Get token from authorization header
  let token: string | undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('You are not logged in. Please login to get access.', 401);
  }

  // 2. Verify token
  try {
    const payload = await Security.verifyToken(token);
    
    // 3. Attach user info to request
    (req as any).user = {
      id: payload.sub as string,
      email: payload.email as string,
    };

    next();
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
});
