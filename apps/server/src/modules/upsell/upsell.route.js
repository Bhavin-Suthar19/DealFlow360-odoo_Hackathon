import { Router } from 'express';
import { getUpsells, getUpsellById, createUpsell } from './upsell.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createUpsellSchema } from './upsell.validation.js';

const router = Router();

router.get('/', getUpsells);
router.get('/:id', getUpsellById);
router.post('/', validate(createUpsellSchema), createUpsell);

export default router;
