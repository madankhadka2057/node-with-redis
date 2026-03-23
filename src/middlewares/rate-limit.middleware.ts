import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisConnection } from '../core/redis';
import { AppError } from '../core/errors';

/**
 * Creates a rate limiter middleware using Redis for distributed state.
 */
export const createRateLimiter = (
  windowMs: number,
  limit: number,
  message: string
) => {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    store: new RedisStore({
      // @ts-ignore - type mismatch often occurs between ioredis and rate-limit-redis
      sendCommand: (...args: string[]) => redisConnection.call(...args),
    }),
    handler: (req, res, next) => {
      next(new AppError(message, 429));
    },
  });
};

// Global limiter: 100 requests per 15 minutes
export const globalLimiter = createRateLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests from this IP, please try again after 15 minutes'
);

// Auth limiter: 5 attempts per hour
export const authLimiter = createRateLimiter(
  60 * 60 * 1000,
  5,
  'Too many authentication attempts from this IP, please try again after an hour'
);
