import { Router } from 'express';
import { getWarehousess, getWarehousesById, createWarehouses } from './warehouses.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createWarehousesSchema } from './warehouses.validation.js';

const router = Router();

router.get('/', getWarehousess);
router.get('/:id', getWarehousesById);
router.post('/', validate(createWarehousesSchema), createWarehouses);

export default router;
