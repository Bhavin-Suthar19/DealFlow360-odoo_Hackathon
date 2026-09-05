import { Router } from 'express';
import * as controller from './warehouses.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createWarehouseSchema, updateStockSchema } from './warehouses.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/', controller.getAll);
router.get('/all-stock', controller.getAllStock);
router.post('/', requireRole(['finance_ops', 'admin']), validate(createWarehouseSchema), controller.create);
router.patch('/:id', requireRole(['finance_ops', 'admin']), controller.update);

router.get('/:id/stock', controller.getStock);
router.patch('/:id/stock', requireRole(['finance_ops', 'admin']), validate(updateStockSchema), controller.updateStock);

export default router;
