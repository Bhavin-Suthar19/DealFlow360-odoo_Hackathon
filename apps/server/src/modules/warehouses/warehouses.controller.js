import { warehousesService } from './warehouses.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getWarehousess = asyncHandler(async (req, res) => {
  const result = await warehousesService.getAll();
  res.json({ success: true, data: result });
});

export const getWarehousesById = asyncHandler(async (req, res) => {
  const result = await warehousesService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createWarehouses = asyncHandler(async (req, res) => {
  const result = await warehousesService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
