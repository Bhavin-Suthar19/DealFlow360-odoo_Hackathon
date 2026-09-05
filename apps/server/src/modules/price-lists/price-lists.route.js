import { Router } from 'express';
import * as priceListsController from './price-lists.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createPriceListSchema, addPriceListItemSchema } from './price-lists.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/', priceListsController.getAll);
router.get('/:id', priceListsController.getById);
router.post('/', requireRole(['sales_manager', 'finance_ops', 'admin']), validate(createPriceListSchema), priceListsController.create);
router.post('/:id/items', requireRole(['sales_manager', 'finance_ops', 'admin']), validate(addPriceListItemSchema), priceListsController.addItem);

export default router;
