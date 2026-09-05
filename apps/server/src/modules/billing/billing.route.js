import { Router } from 'express';
import { getBillings, getBillingById, createBilling } from './billing.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createBillingSchema } from './billing.validation.js';

const router = Router();

router.get('/', getBillings);
router.get('/:id', getBillingById);
router.post('/', validate(createBillingSchema), createBilling);

export default router;
