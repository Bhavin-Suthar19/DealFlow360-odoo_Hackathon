import { priceListsService } from './price-lists.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getPriceListss = asyncHandler(async (req, res) => {
  const result = await priceListsService.getAll();
  res.json({ success: true, data: result });
});

export const getPriceListsById = asyncHandler(async (req, res) => {
  const result = await priceListsService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createPriceLists = asyncHandler(async (req, res) => {
  const result = await priceListsService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
