import { Worker } from 'bullmq';
import redis from '../../config/redis.config.js';
import logger from '../../config/logger.config.js';

export const initWorkers = () => {
  const auditWorker = new Worker('audit-queue', async (job) => {
    logger.info(`Processing audit job ${job.id}`, job.data);
  }, { connection: redis });

  const notificationWorker = new Worker('notification-queue', async (job) => {
    logger.info(`Processing notification job ${job.id}`, job.data);
  }, { connection: redis });

  return { auditWorker, notificationWorker };
};
