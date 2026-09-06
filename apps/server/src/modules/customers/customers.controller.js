import { customersService } from './customers.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getCustomerss = asyncHandler(async (req, res) => {
  const result = await customersService.getAll(req.query);
  return successResponse(res, result.data || result, result.meta || null);
});

export const getCustomersById = asyncHandler(async (req, res) => {
  const result = await customersService.getById(req.params.id);
  return successResponse(res, result);
});

export const createCustomers = asyncHandler(async (req, res) => {
  const result = await customersService.create(req.body);
  return successResponse(res, result, null, 201);
});
