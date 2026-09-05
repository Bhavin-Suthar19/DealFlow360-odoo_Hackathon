import dashboardService from './dashboard.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getAlerts = async (req, res, next) => {
  try {
    const result = await dashboardService.getAlerts(req.query);
    return successResponse(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

export const escalateAlert = async (req, res, next) => {
  try {
    const result = await dashboardService.escalateAlert(req.params.id, req.body.detail);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const nudgeAlert = async (req, res, next) => {
  try {
    const result = await dashboardService.nudgeAlert(req.params.id, req.body.detail);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const recalculate = async (req, res, next) => {
  try {
    const result = await dashboardService.runDetection();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
