import { Hono } from 'hono';

export const hello = new Hono();

hello.get('/', (c) => {
  return c.json({
    message: 'Hello, Hono with aws-lambda!',
  });
});
