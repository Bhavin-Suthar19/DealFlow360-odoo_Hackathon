import { dashboardService } from './dashboard.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getDashboards = asyncHandler(async (req, res) => {
  const result = await dashboardService.getAll();
  res.json({ success: true, data: result });
});

export const getDashboardById = asyncHandler(async (req, res) => {
  const result = await dashboardService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createDashboard = asyncHandler(async (req, res) => {
  const result = await dashboardService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
