import approvalChainsService from './approval-chains.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await approvalChainsService.getAll();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await approvalChainsService.create(req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await approvalChainsService.update(req.params.id, req.body);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
