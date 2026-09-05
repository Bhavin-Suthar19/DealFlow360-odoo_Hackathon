import app from './app.js';
import env from './config/env.config.js';
import connectDB from './config/db.config.js';
import logger from './config/logger.config.js';
import { seedDefaultUsers } from './utils/seedDefaultUsers.js';

const startServer = async () => {
  await connectDB();
  await seedDefaultUsers();

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer();
