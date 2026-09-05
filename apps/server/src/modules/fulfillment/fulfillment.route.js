import { Router } from 'express';
import { getFulfillments, getFulfillmentById, createFulfillment } from './fulfillment.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createFulfillmentSchema } from './fulfillment.validation.js';

const router = Router();

router.get('/', getFulfillments);
router.get('/:id', getFulfillmentById);
router.post('/', validate(createFulfillmentSchema), createFulfillment);

export default router;
