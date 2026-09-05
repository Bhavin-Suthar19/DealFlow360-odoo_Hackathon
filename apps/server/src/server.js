import app from './app.js';
import env from './config/env.config.js';
import connectDB from './config/db.config.js';
import logger from './logger.config.js';

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer();
