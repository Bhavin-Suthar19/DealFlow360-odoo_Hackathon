import { Router } from 'express';
import * as controller from './billing.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { recordPaymentSchema } from './billing.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/invoices', controller.getAllInvoices);
router.get('/invoices/:id', controller.getInvoiceById);
router.post('/invoices/:id/payments', requireRole(['finance_ops', 'admin']), validate(recordPaymentSchema), controller.recordPayment);

export default router;
