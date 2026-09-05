import { productsService } from './products.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getProductss = asyncHandler(async (req, res) => {
  const result = await productsService.getAll();
  res.json({ success: true, data: result });
});

export const getProductsById = asyncHandler(async (req, res) => {
  const result = await productsService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createProducts = asyncHandler(async (req, res) => {
  const result = await productsService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
