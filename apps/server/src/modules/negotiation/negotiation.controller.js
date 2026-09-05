import { negotiationService } from './negotiation.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getNegotiations = asyncHandler(async (req, res) => {
  const result = await negotiationService.getAll();
  res.json({ success: true, data: result });
});

export const getNegotiationById = asyncHandler(async (req, res) => {
  const result = await negotiationService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createNegotiation = asyncHandler(async (req, res) => {
  const result = await negotiationService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
