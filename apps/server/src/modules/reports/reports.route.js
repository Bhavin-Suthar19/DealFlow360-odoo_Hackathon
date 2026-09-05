import { Router } from 'express';
import * as controller from './reports.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { reportQuerySchema } from './reports.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/quotations', requireRole(['sales_rep', 'sales_manager', 'finance_ops', 'admin']), validate(reportQuerySchema), controller.getQuotationReport);
router.get('/export', requireRole(['sales_rep', 'sales_manager', 'finance_ops', 'admin']), validate(reportQuerySchema), controller.exportReport);

export default router;
