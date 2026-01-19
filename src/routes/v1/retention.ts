import { FastifyInstance } from 'fastify';
import { getCurrentRetention, getRetentionHistory } from '../../services/dataService';
import { CurrentRetentionResponse, RetentionHistoryResponse } from '../../types';

export async function retentionRoutes(fastify: FastifyInstance) {
  fastify.get('/retention', async (_, reply) => {
    try {
      const current = getCurrentRetention();
      const response: CurrentRetentionResponse = {
        rate: current.rate,
        effectiveDate: current.effectiveDate,
        source: current.source,
        lastUpdated: current.lastUpdated,
        metadata: current.metadata
      };
      return reply.code(200).type('application/json').send(response);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).type('application/json').send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve retention rate',
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  fastify.get('/retention/history', async (_, reply) => {
    try {
      const history = getRetentionHistory();
      const response: RetentionHistoryResponse = {
        rates: history,
        total: history.length
      };
      return reply.code(200).type('application/json').send(response);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).type('application/json').send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve retention history',
          timestamp: new Date().toISOString()
        }
      });
    }
  });
}
