import { Router } from 'express';
import * as controller from './dashboard.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { alertActionSchema } from './dashboard.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/alerts', controller.getAlerts);
router.post('/alerts/:id/escalate', requireRole(['sales_manager', 'finance_ops', 'admin']), validate(alertActionSchema), controller.escalateAlert);
router.post('/alerts/:id/nudge', requireRole(['sales_manager', 'finance_ops', 'admin']), validate(alertActionSchema), controller.nudgeAlert);
router.post('/recalculate', requireRole(['sales_manager', 'admin']), controller.recalculate);

export default router;
