import { Queue } from 'bullmq';
import redis from '../../config/redis.config.js';

export const auditQueue = new Queue('audit-queue', { connection: redis });
export const notificationQueue = new Queue('notification-queue', { connection: redis });
