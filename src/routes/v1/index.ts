import { FastifyInstance } from 'fastify';
import { retentionRoutes } from './retention';

export async function v1Routes(fastify: FastifyInstance) {
  await fastify.register(retentionRoutes, { prefix: '/v1' });
}
