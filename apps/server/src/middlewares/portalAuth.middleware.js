import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';
import { errorResponse } from '../utils/apiResponse.util.js';

export const verifyPortalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Unauthorized: Portal token required', 'UNAUTHORIZED', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (decoded.tokenType !== 'portal' || !decoded.customerUserId || !decoded.customerId) {
      return errorResponse(res, 'Unauthorized: Internal tokens cannot access portal endpoints', 'INVALID_PORTAL_TOKEN', 403);
    }
    req.customerUser = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 'Unauthorized: Invalid or expired portal token', 'UNAUTHORIZED', 401);
  }
};

export default verifyPortalAuth;
