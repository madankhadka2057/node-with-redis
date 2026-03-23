import Redis from 'ioredis';
import { config } from './config';

// Reusable Redis connection for BullMQ
export const redisConnection = config.redis.url 
  ? new Redis(config.redis.url, { maxRetriesPerRequest: null })
  : new Redis({
      host: config.redis.host,
      port: config.redis.port,
      maxRetriesPerRequest: null, // Required by BullMQ
    });
