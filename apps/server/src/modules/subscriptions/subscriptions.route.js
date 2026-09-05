import { Router } from 'express';
import { getSubscriptionss, getSubscriptionsById, createSubscriptions } from './subscriptions.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createSubscriptionsSchema } from './subscriptions.validation.js';

const router = Router();

router.get('/', getSubscriptionss);
router.get('/:id', getSubscriptionsById);
router.post('/', validate(createSubscriptionsSchema), createSubscriptions);

export default router;
