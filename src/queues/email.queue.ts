import { Queue } from 'bullmq';
import { redisConnection } from '../core/redis';

export const EMAIL_QUEUE_NAME = 'email-queue';

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: { count: 100 }, // Keep history of last 100 successful jobs
    removeOnFail: { count: 500 },     // Keep history of last 500 failed jobs
  },
});
