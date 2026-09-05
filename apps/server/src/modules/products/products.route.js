import { Router } from 'express';
import * as productsController from './products.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema, createVariantSchema } from './products.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/', productsController.getAll);
router.get('/categories', productsController.getCategories);
router.get('/variants', productsController.getAllVariants);
router.get('/:id', productsController.getById);

router.post('/', requireRole(['sales_rep', 'sales_manager', 'finance_ops', 'admin']), validate(createProductSchema), productsController.create);
router.patch('/:id', requireRole(['sales_rep', 'sales_manager', 'finance_ops', 'admin']), validate(updateProductSchema), productsController.update);
router.delete('/:id', requireRole(['sales_rep', 'sales_manager', 'finance_ops', 'admin']), productsController.remove);

router.post('/:id/variants', requireRole(['sales_rep', 'sales_manager', 'finance_ops', 'admin']), validate(createVariantSchema), productsController.addVariant);
router.patch('/variants/:id', requireRole(['sales_rep', 'sales_manager', 'finance_ops', 'admin']), productsController.updateVariant);
router.delete('/variants/:id', requireRole(['sales_rep', 'sales_manager', 'finance_ops', 'admin']), productsController.deleteVariant);

export default router;
