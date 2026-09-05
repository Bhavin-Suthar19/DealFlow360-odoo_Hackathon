import { Router } from 'express';
import * as productsController from './products.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema, createVariantSchema } from './products.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);

router.post('/', requireRole(['admin']), validate(createProductSchema), productsController.create);
router.patch('/:id', requireRole(['admin']), validate(updateProductSchema), productsController.update);
router.delete('/:id', requireRole(['admin']), productsController.remove);

router.post('/:id/variants', requireRole(['admin']), validate(createVariantSchema), productsController.addVariant);
router.patch('/variants/:id', requireRole(['admin']), productsController.updateVariant);
router.delete('/variants/:id', requireRole(['admin']), productsController.deleteVariant);

export default router;
