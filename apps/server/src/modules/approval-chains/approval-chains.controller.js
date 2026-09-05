import { approvalChainsService } from './approval-chains.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getApprovalChainss = asyncHandler(async (req, res) => {
  const result = await approvalChainsService.getAll();
  res.json({ success: true, data: result });
});

export const getApprovalChainsById = asyncHandler(async (req, res) => {
  const result = await approvalChainsService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createApprovalChains = asyncHandler(async (req, res) => {
  const result = await approvalChainsService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
