import { Router } from 'express';
import { getDashboards, getDashboardById, createDashboard } from './dashboard.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createDashboardSchema } from './dashboard.validation.js';

const router = Router();

router.get('/', getDashboards);
router.get('/:id', getDashboardById);
router.post('/', validate(createDashboardSchema), createDashboard);

export default router;
