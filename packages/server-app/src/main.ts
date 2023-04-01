import { serve } from '@hono/node-server';
import { app } from './app';

const main = (): void => {
  console.log('hono server started.');
  serve({
    fetch: app.fetch,
    port: process.env.HONO_PORT != null ? Number(process.env.HONO_PORT) : 3000,
  });
};

main();
