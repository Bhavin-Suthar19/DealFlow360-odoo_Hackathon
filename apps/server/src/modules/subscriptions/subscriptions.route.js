import { Router } from 'express';
import * as controller from './subscriptions.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createSubscriptionPlanSchema, createSubscriptionSchema, cancelSubscriptionSchema } from './subscriptions.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/plans', controller.getPlans);
router.post('/plans', requireRole(['admin']), validate(createSubscriptionPlanSchema), controller.createPlan);

router.get('/', controller.getAll);
router.post('/', requireRole(['finance_ops', 'admin']), validate(createSubscriptionSchema), controller.create);
router.post('/:id/cancel', requireRole(['finance_ops', 'admin']), validate(cancelSubscriptionSchema), controller.cancel);
router.get('/:id/billing-schedule', controller.getBillingSchedule);

export default router;
