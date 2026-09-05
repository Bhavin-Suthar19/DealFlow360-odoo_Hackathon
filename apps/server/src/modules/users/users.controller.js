import { usersService } from './users.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getUserss = asyncHandler(async (req, res) => {
  const result = await usersService.getAll();
  res.json({ success: true, data: result });
});

export const getUsersById = asyncHandler(async (req, res) => {
  const result = await usersService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createUsers = asyncHandler(async (req, res) => {
  const result = await usersService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
