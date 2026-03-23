import { redisConnection } from './redis';

/**
 * Global Caching Service using Redis.
 * Provides a standardized way to get, set, and delete keys.
 */
export class CacheService {
  /**
   * Set a value in the cache with a TTL in seconds.
   */
  static async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    await redisConnection.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  /**
   * Get a generic value from the cache.
   */
  static async get<T>(key: string): Promise<T | null> {
    const data = await redisConnection.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Delete a single or multiple cache keys.
   */
  static async del(key: string | string[]): Promise<void> {
    if (Array.isArray(key)) {
      if (key.length > 0) await redisConnection.del(...key);
    } else {
      await redisConnection.del(key);
    }
  }

  /**
   * Clear all cache keys matching a specific pattern (e.g., 'users:*').
   */
  static async delByPattern(pattern: string): Promise<void> {
    const keys = await redisConnection.keys(pattern);
    if (keys.length > 0) {
      await redisConnection.del(...keys);
    }
  }
}
