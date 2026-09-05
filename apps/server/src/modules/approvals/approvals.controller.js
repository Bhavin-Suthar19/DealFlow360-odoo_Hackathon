import { approvalsService } from './approvals.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getApprovalss = asyncHandler(async (req, res) => {
  const result = await approvalsService.getAll();
  res.json({ success: true, data: result });
});

export const getApprovalsById = asyncHandler(async (req, res) => {
  const result = await approvalsService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createApprovals = asyncHandler(async (req, res) => {
  const result = await approvalsService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
