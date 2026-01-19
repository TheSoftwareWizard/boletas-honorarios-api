import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { v1Routes } from './routes/v1';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    } : undefined
  }
});

async function build() {
  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/'
  });

  await fastify.register(cors, {
    origin: true,
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Accept']
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
        timestamp: new Date().toISOString()
      }
    })
  });

  await fastify.register(v1Routes);

  fastify.get('/health', async (_, reply) => {
    return reply.code(200).type('application/json').send({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  });

  fastify.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith('/v1/') || request.url === '/health') {
      return reply.code(404).type('application/json').send({
        error: {
          code: 'NOT_FOUND',
          message: 'Endpoint not found',
          timestamp: new Date().toISOString()
        }
      });
    }
    reply.code(404).send('Not Found');
  });

  fastify.setErrorHandler((error, _, reply) => {
    fastify.log.error(error);
    reply.code(error.statusCode || 500).type('application/json').send({
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }
    });
  });
}

async function start() {
  try {
    await build();
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port, host });
    fastify.log.info(`Server listening on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

const shutdown = async () => {
  await fastify.close();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();
