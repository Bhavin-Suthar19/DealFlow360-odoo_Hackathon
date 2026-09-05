import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';
import { errorResponse } from '../utils/apiResponse.util.js';

export const verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Unauthorized: No token provided', 'UNAUTHORIZED', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (decoded.tokenType === 'portal') {
      req.user = {
        userId: decoded.customerUserId,
        role: 'customer',
        customerId: decoded.customerId,
        tokenType: 'portal'
      };
      return next();
    }
    if (!decoded.userId || !decoded.role) {
      return errorResponse(res, 'Unauthorized: Invalid token payload', 'INVALID_TOKEN_TYPE', 403);
    }
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 'Unauthorized: Invalid or expired token', 'UNAUTHORIZED', 401);
  }
};

export default verifyAuth;
