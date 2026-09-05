import { billingService } from './billing.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getBillings = asyncHandler(async (req, res) => {
  const result = await billingService.getAll();
  res.json({ success: true, data: result });
});

export const getBillingById = asyncHandler(async (req, res) => {
  const result = await billingService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createBilling = asyncHandler(async (req, res) => {
  const result = await billingService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
