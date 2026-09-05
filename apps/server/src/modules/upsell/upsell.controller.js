import { upsellService } from './upsell.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getUpsells = asyncHandler(async (req, res) => {
  const result = await upsellService.getAll();
  res.json({ success: true, data: result });
});

export const getUpsellById = asyncHandler(async (req, res) => {
  const result = await upsellService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createUpsell = asyncHandler(async (req, res) => {
  const result = await upsellService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
