import { Router } from 'express';
import * as controller from './quotations.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createQuotationSchema, addQuotationLineSchema, updateQuotationLineSchema } from './quotations.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/rfq', controller.getRFQs);
router.post('/rfq', controller.createRFQ);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post('/', requireRole(['sales_rep', 'sales_manager', 'admin']), validate(createQuotationSchema), controller.create);
router.patch('/:id', requireRole(['sales_rep', 'sales_manager', 'admin']), controller.update);

router.post('/:id/lines', requireRole(['sales_rep', 'sales_manager', 'admin']), validate(addQuotationLineSchema), controller.addLine);
router.patch('/:id/lines/:lineId', requireRole(['sales_rep', 'sales_manager', 'admin']), validate(updateQuotationLineSchema), controller.updateLine);
router.delete('/:id/lines/:lineId', requireRole(['sales_rep', 'sales_manager', 'admin']), controller.deleteLine);

router.post('/:id/send-to-customer', requireRole(['sales_rep', 'sales_manager', 'admin']), controller.sendToCustomer);
router.post('/:id/escalate', requireRole(['sales_rep', 'sales_manager', 'admin']), controller.escalateToManager);
router.post('/:id/submit', requireRole(['sales_rep', 'sales_manager', 'admin']), controller.submitQuotation);

export default router;
