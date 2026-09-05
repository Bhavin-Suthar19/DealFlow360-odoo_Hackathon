import { Router } from 'express';
import * as controller from './approvals.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { approvalActionSchema } from './approvals.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post('/:id/approve', requireRole(['sales_manager', 'finance_ops', 'admin']), validate(approvalActionSchema), controller.approve);
router.post('/:id/reject', requireRole(['sales_manager', 'finance_ops', 'admin']), validate(approvalActionSchema), controller.reject);
router.post('/:id/return-for-revision', requireRole(['sales_manager', 'finance_ops', 'admin']), validate(approvalActionSchema), controller.returnForRevision);

export default router;
