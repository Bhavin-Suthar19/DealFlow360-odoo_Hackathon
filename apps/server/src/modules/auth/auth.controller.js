import { authService } from './auth.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getAuths = asyncHandler(async (req, res) => {
  const result = await authService.getAll();
  res.json({ success: true, data: result });
});

export const getAuthById = asyncHandler(async (req, res) => {
  const result = await authService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createAuth = asyncHandler(async (req, res) => {
  const result = await authService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
