import { Router } from 'express';
import * as controller from './audit.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { auditQuerySchema } from './audit.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/', requireRole(['sales_rep', 'sales_manager', 'finance_ops', 'admin']), validate(auditQuerySchema), controller.getLogs);

export default router;
