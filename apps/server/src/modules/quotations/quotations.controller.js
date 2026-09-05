import { quotationsService } from './quotations.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getQuotationss = asyncHandler(async (req, res) => {
  const result = await quotationsService.getAll();
  res.json({ success: true, data: result });
});

export const getQuotationsById = asyncHandler(async (req, res) => {
  const result = await quotationsService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createQuotations = asyncHandler(async (req, res) => {
  const result = await quotationsService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
