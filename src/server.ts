import { createApp } from './app';
import { config } from './core/config';
import { prisma } from './core/prisma';
import { redisConnection } from './core/redis';

async function bootstrap() {
  const app = createApp();

  // Try connecting core infrastructure before booting HTTP
  try {
    await prisma.$connect();
    console.log(`[Core] Prisma Postgres connected successfully`);

    // Testing Redis connection implicitly checks it exists
    await redisConnection.ping();
    console.log(`[Core] Redis connected successfully`);
  } catch (err: any) {
    console.error(`[Fatal] Failed to start services: ${err.message}`);
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    console.log(`[Server] Listening on port ${config.port} in ${config.env} mode`);
    console.log(`[Server] Bull-board Dashboard available at http://localhost:${config.port}/admin/queues`);
  });

  // Graceful shutdown strategy
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n[Shutdown] Received ${signal}, initiating graceful shutdown...`);

    server.close(() => {
      console.log('[Shutdown] HTTP server closed');
    });

    try {
      await prisma.$disconnect();
      console.log('[Shutdown] Prisma disconnected');

      await redisConnection.quit();
      console.log('[Shutdown] Redis disconnected');

      process.exit(0);
    } catch (err) {
      console.error('[Shutdown] Error during disconnected: ', err);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

bootstrap();
