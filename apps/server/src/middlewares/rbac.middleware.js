import { errorResponse } from '../utils/apiResponse.util.js';

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Forbidden: Insufficient permissions for this action', 'FORBIDDEN', 403);
    }
    next();
  };
};

export const checkRole = requireRole;
export default requireRole;
