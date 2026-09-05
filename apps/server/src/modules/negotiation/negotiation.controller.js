import negotiationService from './negotiation.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getPortalQuotation = async (req, res, next) => {
  try {
    const result = await negotiationService.getPortalQuotation(req.params.id, req.customerUser);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const submitNegotiationRequest = async (req, res, next) => {
  try {
    const result = await negotiationService.submitNegotiationRequest(req.params.id, req.body, req.customerUser);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const confirmPortalQuotation = async (req, res, next) => {
  try {
    const result = await negotiationService.confirmPortalQuotation(req.params.id, req.customerUser);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
