import { Hono } from 'hono';
import { logger } from 'hono/logger';

export const app = new Hono();

app.use('*', logger());

app.get('/', (c) => {
  return c.json({
    message: 'Hello, Hono!',
  });
});
