import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { globalLimiter } from './middlewares/rate-limit.middleware';
import { serverAdapter } from './middlewares/bullboard.middleware';
import compression from 'compression';
export function createApp(): Application {
  const app = express();
  
  // Required for express-rate-limit to work correctly behind proxies like Render/Heroku
  app.set('trust proxy', 1);

  // Security and common middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Required for Bull-board's loaded assets
  }));

  //enable cors
  app.use(cors());

  //compress response
  app.use(compression());

  //parse json body
  app.use(express.json());

  //parse urlencoded body
  app.use(express.urlencoded({ extended: true }));

  // Bull-board Dashboard (Recommended for admin use)
  app.use('/admin/queues', serverAdapter.getRouter());

  // Global Rate Limiter applied only to API routes
  app.use('/api', globalLimiter, router);

  // Healthcheck endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Global Error Handler must be final route definition
  app.use(errorHandler);

  return app;
}
