import productsService from './products.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await productsService.getAll(req.query);
    return successResponse(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await productsService.getById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await productsService.create(req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await productsService.update(req.params.id, req.body);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await productsService.delete(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const addVariant = async (req, res, next) => {
  try {
    const result = await productsService.addVariant(req.params.id, req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const updateVariant = async (req, res, next) => {
  try {
    const result = await productsService.updateVariant(req.params.id, req.body);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const deleteVariant = async (req, res, next) => {
  try {
    const result = await productsService.deleteVariant(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const result = await productsService.getCategories();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const getAllVariants = async (req, res, next) => {
  try {
    const result = await productsService.getAllVariants();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

