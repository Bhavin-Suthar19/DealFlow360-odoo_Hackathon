import eventBus from '../eventBus.js';
import logger from '../../config/logger.config.js';

eventBus.on('audit:log', (data) => {
  logger.info('Audit Event Received:', data);
});
