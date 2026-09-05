import auditService from './audit.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getLogs = async (req, res, next) => {
  try {
    const result = await auditService.getLogs(req.query);
    return successResponse(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
};
