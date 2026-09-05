import priceListsService from './price-lists.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await priceListsService.getAll(req.query);
    return successResponse(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await priceListsService.getById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await priceListsService.create(req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const result = await priceListsService.addItem(req.params.id, req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};
