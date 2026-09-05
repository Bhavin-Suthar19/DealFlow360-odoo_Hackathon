import pino from 'pino';
import env from './env.config.js';

const logger = pino({
  level: env.LOG_LEVEL || 'info',
});

export default logger;
