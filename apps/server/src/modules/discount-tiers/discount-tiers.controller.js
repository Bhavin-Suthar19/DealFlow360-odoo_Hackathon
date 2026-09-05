import { discountTiersService } from './discount-tiers.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getDiscountTierss = asyncHandler(async (req, res) => {
  const result = await discountTiersService.getAll();
  res.json({ success: true, data: result });
});

export const getDiscountTiersById = asyncHandler(async (req, res) => {
  const result = await discountTiersService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createDiscountTiers = asyncHandler(async (req, res) => {
  const result = await discountTiersService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
