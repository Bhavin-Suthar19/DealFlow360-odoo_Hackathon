import { Router } from 'express';
import * as controller from './fulfillment.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { manualOverrideSchema } from './fulfillment.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post('/:id/accept-suggested-split', requireRole(['finance_ops', 'admin']), controller.acceptSuggestedSplit);
router.post('/:id/manual-override', requireRole(['finance_ops', 'admin']), validate(manualOverrideSchema), controller.manualOverride);
router.post('/:id/consolidate-backorder', requireRole(['finance_ops', 'admin']), controller.consolidateBackorder);

export default router;
