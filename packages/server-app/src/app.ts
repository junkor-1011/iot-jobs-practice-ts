import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { hello } from './modules/hello';

export const app = new Hono();

app.use('*', logger());

app.get('/', (c) => {
  return c.json({
    message: 'Hello, Hono!',
  });
});

app.route('/hello', hello);
