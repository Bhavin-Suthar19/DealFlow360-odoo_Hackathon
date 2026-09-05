import eventBus from '../eventBus.js';
import logger from '../../config/logger.config.js';

eventBus.on('notification:send', (data) => {
  logger.info('Notification Event Received:', data);
});
