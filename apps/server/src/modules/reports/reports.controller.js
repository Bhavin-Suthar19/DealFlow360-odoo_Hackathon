import { reportsService } from './reports.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getReportss = asyncHandler(async (req, res) => {
  const result = await reportsService.getAll();
  res.json({ success: true, data: result });
});

export const getReportsById = asyncHandler(async (req, res) => {
  const result = await reportsService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createReports = asyncHandler(async (req, res) => {
  const result = await reportsService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
