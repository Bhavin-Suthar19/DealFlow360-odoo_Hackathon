import { Router } from 'express';
import { getQuotationss, getQuotationsById, createQuotations } from './quotations.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createQuotationsSchema } from './quotations.validation.js';

const router = Router();

router.get('/', getQuotationss);
router.get('/:id', getQuotationsById);
router.post('/', validate(createQuotationsSchema), createQuotations);

export default router;
