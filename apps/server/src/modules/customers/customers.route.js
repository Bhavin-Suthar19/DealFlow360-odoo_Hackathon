import { Router } from 'express';
import { getCustomerss, getCustomersById, createCustomers } from './customers.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createCustomersSchema } from './customers.validation.js';

const router = Router();

router.get('/', getCustomerss);
router.get('/:id', getCustomersById);
router.post('/', validate(createCustomersSchema), createCustomers);

export default router;
