import approvalsService from './approvals.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await approvalsService.getAll(req.query, req.user);
    return successResponse(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await approvalsService.getById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const approve = async (req, res, next) => {
  try {
    const result = await approvalsService.approve(req.params.id, req.body.note, req.user);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const reject = async (req, res, next) => {
  try {
    const result = await approvalsService.reject(req.params.id, req.body.note, req.user);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const returnForRevision = async (req, res, next) => {
  try {
    const result = await approvalsService.returnForRevision(req.params.id, req.body.note, req.user);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
