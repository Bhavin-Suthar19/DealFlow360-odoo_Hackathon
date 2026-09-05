import { auditService } from './audit.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getAudits = asyncHandler(async (req, res) => {
  const result = await auditService.getAll();
  res.json({ success: true, data: result });
});

export const getAuditById = asyncHandler(async (req, res) => {
  const result = await auditService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createAudit = asyncHandler(async (req, res) => {
  const result = await auditService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
