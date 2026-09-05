import { Router } from 'express';
import { getProductss, getProductsById, createProducts } from './products.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createProductsSchema } from './products.validation.js';

const router = Router();

router.get('/', getProductss);
router.get('/:id', getProductsById);
router.post('/', validate(createProductsSchema), createProducts);

export default router;
