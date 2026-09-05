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
    if (decoded.tokenType === 'portal') {
      req.customerUser = decoded;
      return next();
    }
    
    // Support customer accounts logged in via internal auth
    if (decoded.role === 'customer' || decoded.tokenType === 'internal') {
      req.customerUser = {
        customerUserId: decoded.userId || decoded.customerUserId,
        customerId: decoded.customerId || 'cust-1',
        role: decoded.role || 'customer'
      };
      return next();
    }

    return errorResponse(res, 'Unauthorized: Portal access restricted to customer accounts', 'INVALID_PORTAL_TOKEN', 403);
  } catch (err) {
    return errorResponse(res, 'Unauthorized: Invalid or expired portal token', 'UNAUTHORIZED', 401);
  }
};

export default verifyPortalAuth;
