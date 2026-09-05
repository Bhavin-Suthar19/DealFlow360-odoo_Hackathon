import subscriptionsService from './subscriptions.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getPlans = async (req, res, next) => {
  try {
    const result = await subscriptionsService.getPlans();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const result = await subscriptionsService.createPlan(req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const result = await subscriptionsService.getAll(req.query);
    return successResponse(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await subscriptionsService.create(req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const result = await subscriptionsService.cancel(req.params.id, req.body?.reason);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const getBillingSchedule = async (req, res, next) => {
  try {
    const result = await subscriptionsService.getBillingSchedule(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
