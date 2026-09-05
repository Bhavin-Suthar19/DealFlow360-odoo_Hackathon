import { Router } from 'express';
import * as controller from './approval-chains.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createApprovalChainRuleSchema } from './approval-chains.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/', controller.getAll);
router.post('/', requireRole(['sales_manager', 'admin']), validate(createApprovalChainRuleSchema), controller.create);
router.patch('/:id', requireRole(['sales_manager', 'admin']), controller.update);

export default router;
