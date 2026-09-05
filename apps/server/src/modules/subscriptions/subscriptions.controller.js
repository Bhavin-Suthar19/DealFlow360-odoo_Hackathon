import { subscriptionsService } from './subscriptions.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const getSubscriptionss = asyncHandler(async (req, res) => {
  const result = await subscriptionsService.getAll();
  res.json({ success: true, data: result });
});

export const getSubscriptionsById = asyncHandler(async (req, res) => {
  const result = await subscriptionsService.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const createSubscriptions = asyncHandler(async (req, res) => {
  const result = await subscriptionsService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
