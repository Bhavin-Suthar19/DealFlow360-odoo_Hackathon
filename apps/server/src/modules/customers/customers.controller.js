import { customersService } from './customers.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getCustomerss = asyncHandler(async (req, res) => {
  const result = await customersService.getAll();
  res.json({ success: true, data: result });
});

export const getCustomersById = asyncHandler(async (req, res) => {
  const result = await customersService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createCustomers = asyncHandler(async (req, res) => {
  const result = await customersService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
