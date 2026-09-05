import { Router } from 'express';
import { getPriceListss, getPriceListsById, createPriceLists } from './price-lists.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createPriceListsSchema } from './price-lists.validation.js';

const router = Router();

router.get('/', getPriceListss);
router.get('/:id', getPriceListsById);
router.post('/', validate(createPriceListsSchema), createPriceLists);

export default router;
