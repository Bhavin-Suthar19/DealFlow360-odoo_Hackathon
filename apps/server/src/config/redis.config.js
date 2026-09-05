import Redis from 'ioredis';
import env from './env.config.js';
import logger from './logger.config.js';

const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => logger.info('Redis Client Connected'));
redis.on('error', (err) => logger.error('Redis Client Error:', err));

export default redis;
