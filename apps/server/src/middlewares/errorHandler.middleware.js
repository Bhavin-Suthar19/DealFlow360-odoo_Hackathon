import logger from '../config/logger.config.js';
import { errorResponse } from '../utils/apiResponse.util.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  return errorResponse(res, message, code, statusCode);
};

export default errorHandler;
