import fulfillmentService from './fulfillment.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await fulfillmentService.getAll(req.query);
    return successResponse(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await fulfillmentService.getById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const acceptSuggestedSplit = async (req, res, next) => {
  try {
    const result = await fulfillmentService.calculateAndApplySuggestedSplit(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const manualOverride = async (req, res, next) => {
  try {
    const result = await fulfillmentService.manualOverride(req.params.id, req.body.allocations);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const consolidateBackorder = async (req, res, next) => {
  try {
    const result = await fulfillmentService.consolidateBackorder(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
