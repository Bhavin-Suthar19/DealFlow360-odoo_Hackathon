import warehousesService from './warehouses.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await warehousesService.getAll(req.query);
    return successResponse(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await warehousesService.create(req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await warehousesService.update(req.params.id, req.body);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const getStock = async (req, res, next) => {
  try {
    const result = await warehousesService.getStock(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const result = await warehousesService.updateStock(req.params.id, req.body);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const getAllStock = async (req, res, next) => {
  try {
    const result = await warehousesService.getAllStock();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
