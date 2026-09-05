import { Router } from 'express';
import * as controller from './upsell.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createUpsellRuleSchema } from './upsell.validation.js';

const router = Router();

router.use(verifyAuth);

router.get('/rules', controller.getRules);
router.post('/rules', requireRole(['admin']), validate(createUpsellRuleSchema), controller.createRule);
router.get('/products/:id/suggestions', controller.getSuggestions);

export default router;
