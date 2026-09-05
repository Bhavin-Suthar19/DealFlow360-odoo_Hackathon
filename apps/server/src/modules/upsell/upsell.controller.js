import upsellService from './upsell.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getRules = async (req, res, next) => {
  try {
    const result = await upsellService.getRules();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const createRule = async (req, res, next) => {
  try {
    const result = await upsellService.createRule(req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const getSuggestions = async (req, res, next) => {
  try {
    const result = await upsellService.getSuggestionsForProduct(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
