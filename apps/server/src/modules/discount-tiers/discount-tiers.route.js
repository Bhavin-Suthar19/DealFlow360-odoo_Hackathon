import { Router } from 'express';
import * as controller from './discount-tiers.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createDiscountTierSchema, createCategoryCeilingSchema } from './discount-tiers.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/', controller.getTiers);
router.post('/', requireRole(['admin']), validate(createDiscountTierSchema), controller.createTier);
router.patch('/:id', requireRole(['admin']), controller.updateTier);

router.get('/ceilings', controller.getCategoryCeilings);
router.post('/ceilings', requireRole(['admin']), validate(createCategoryCeilingSchema), controller.createCategoryCeiling);
router.patch('/ceilings/:id', requireRole(['admin']), controller.updateCategoryCeiling);

export default router;
