import { Router } from 'express';
import { getDiscountTierss, getDiscountTiersById, createDiscountTiers } from './discount-tiers.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createDiscountTiersSchema } from './discount-tiers.validation.js';

const router = Router();

router.get('/', getDiscountTierss);
router.get('/:id', getDiscountTiersById);
router.post('/', validate(createDiscountTiersSchema), createDiscountTiers);

export default router;
