import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';

export function createApp(): Express {
  const app = express();

  // Security & parsing middleware
  app.use(
    cors({
      origin: config.frontendUrl,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());

  // Healthcheck endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return app;
}
