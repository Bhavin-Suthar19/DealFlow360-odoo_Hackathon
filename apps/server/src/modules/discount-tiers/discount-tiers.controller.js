import discountTiersService from './discount-tiers.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getTiers = async (req, res, next) => {
  try {
    const result = await discountTiersService.getTiers();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const createTier = async (req, res, next) => {
  try {
    const result = await discountTiersService.createTier(req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const updateTier = async (req, res, next) => {
  try {
    const result = await discountTiersService.updateTier(req.params.id, req.body);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const getCategoryCeilings = async (req, res, next) => {
  try {
    const result = await discountTiersService.getCategoryCeilings();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const createCategoryCeiling = async (req, res, next) => {
  try {
    const result = await discountTiersService.createCategoryCeiling(req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const updateCategoryCeiling = async (req, res, next) => {
  try {
    const result = await discountTiersService.updateCategoryCeiling(req.params.id, req.body);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
