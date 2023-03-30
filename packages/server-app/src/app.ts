import fastify, {
  type FastifyInstance,
  type FastifyServerOptions,
} from 'fastify';
import fastifySensible from '@fastify/sensible';

const defaultOption: FastifyServerOptions = {
  logger: true,
};

export const build = async (
  opts: FastifyServerOptions = defaultOption,
): Promise<FastifyInstance> => {
  const server = fastify(opts);

  await server.register(fastifySensible);

  return await server;
};

export const app = async (
  opts: FastifyServerOptions = defaultOption,
): Promise<void> => {
  const server = await build(opts);

  try {
    console.log('listen port 3000');
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    console.log(err);
  }
};