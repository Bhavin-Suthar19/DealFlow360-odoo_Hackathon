import quotationsService from './quotations.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await quotationsService.getAll(req.query, req.user);
    return successResponse(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await quotationsService.getById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await quotationsService.create(req.body, req.user);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const addLine = async (req, res, next) => {
  try {
    const result = await quotationsService.addLine(req.params.id, req.body, req.user);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const updateLine = async (req, res, next) => {
  try {
    const result = await quotationsService.updateLine(req.params.id, req.params.lineId, req.body);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const deleteLine = async (req, res, next) => {
  try {
    const result = await quotationsService.deleteLine(req.params.id, req.params.lineId);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const createRFQ = async (req, res, next) => {
  try {
    const result = await quotationsService.createRFQ(req.body, req.user);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const getRFQs = async (req, res, next) => {
  try {
    const result = await quotationsService.getRFQs(req.query, req.user);
    return successResponse(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

export const sendToCustomer = async (req, res, next) => {
  try {
    const result = await quotationsService.sendToCustomer(req.params.id, req.user);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const escalateToManager = async (req, res, next) => {
  try {
    const result = await quotationsService.escalateToManager(req.params.id, req.body?.note, req.user);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const submitQuotation = async (req, res, next) => {
  try {
    const result = await quotationsService.submitQuotation(req.params.id, req.user);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
