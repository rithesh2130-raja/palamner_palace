import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import apiRouter from './routes/apiRouter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');
const uploadsAdvertsDir = path.join(uploadsDir, 'advertisements');

// Ensure upload directories exist on server startup
if (!fs.existsSync(uploadsAdvertsDir)) {
  fs.mkdirSync(uploadsAdvertsDir, { recursive: true });
}

export function createApp() {
  const app = express();

  // Security Middleware (Configure helmet to allow cross-origin media embedding)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: env.CLIENT_URL || true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Request Logging
  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Serve static uploaded videos with correct Content-Type (video/mp4)
  app.use('/uploads', express.static(uploadsDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
      }
    }
  }));

  // Parsers
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(cookieParser());

  // Mount API Router /api/v1
  app.use('/api/v1', apiRouter);

  // 404 & Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
