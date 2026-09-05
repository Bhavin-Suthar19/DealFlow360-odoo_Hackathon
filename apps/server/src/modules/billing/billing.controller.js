import billingService from './billing.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getAllInvoices = async (req, res, next) => {
  try {
    const result = await billingService.getAllInvoices(req.query);
    return successResponse(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const result = await billingService.getInvoiceById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const recordPayment = async (req, res, next) => {
  try {
    const result = await billingService.recordPayment(req.params.id, req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const generateInvoice = async (req, res, next) => {
  try {
    const quotationId = req.body?.quotation_id || req.params?.quotationId;
    const result = await billingService.generateInvoiceFromQuotation(quotationId);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};
