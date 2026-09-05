import reportsService from './reports.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getQuotationReport = async (req, res, next) => {
  try {
    const result = await reportsService.getQuotationReport(req.query);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const exportReport = async (req, res, next) => {
  try {
    const result = await reportsService.exportReport(req.query);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
