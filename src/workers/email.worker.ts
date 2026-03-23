import { Worker, Job } from 'bullmq';
import { EMAIL_QUEUE_NAME } from '../queues/email.queue';
import { redisConnection } from '../core/redis';
import { prisma } from '../core/prisma';
import { mailer } from '../core/mailer';

// Defined as a separate file to be run independently or loaded into the app
console.log(`Starting worker for queue: ${EMAIL_QUEUE_NAME}`);

export const emailWorker = new Worker(
  EMAIL_QUEUE_NAME,
  async (job: Job) => {
    const { userId, email, name } = job.data;
    console.log(`[Worker] Processing welcome email job ${job.id} for user ${email}`);

    try {
      // Send real email via Gmail
      await mailer.sendWelcomeEmail(email, name);

      console.log(`[Worker] Real email sent to ${email} successfully`);
      
      // Persist success log using Prisma
      await prisma.emailLog.create({
        data: {
          userId,
          jobId: job.id,
          status: 'SUCCESS',
        },
      });

      return { success: true, email };
    } catch (error: any) {
      console.error(`[Worker] Failed to send email to ${email}: ${error.message}`);
      
      // Persist failure log
      await prisma.emailLog.create({
        data: {
          userId,
          jobId: job.id,
          status: 'FAILED',
          error: error.message || 'Unknown error',
        },
      });

      throw error; // Will be caught by BullMQ for retries
    }
  },
  {
    connection: redisConnection as any,
    concurrency: 5, // Process up to 5 jobs concurrently
  }
);

emailWorker.on('completed', (job: Job) => {
  console.log(`[Worker Event] Job ${job.id} has completed!`);
});

emailWorker.on('failed', (job: Job | undefined, err: Error) => {
  console.log(`[Worker Event] Job ${job?.id} has failed with ${err.message}`);
});
