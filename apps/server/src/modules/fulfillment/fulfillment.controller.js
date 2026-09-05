import { fulfillmentService } from './fulfillment.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getFulfillments = asyncHandler(async (req, res) => {
  const result = await fulfillmentService.getAll();
  res.json({ success: true, data: result });
});

export const getFulfillmentById = asyncHandler(async (req, res) => {
  const result = await fulfillmentService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createFulfillment = asyncHandler(async (req, res) => {
  const result = await fulfillmentService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
