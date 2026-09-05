import { Router } from 'express';
import { getReportss, getReportsById, createReports } from './reports.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createReportsSchema } from './reports.validation.js';

const router = Router();

router.get('/', getReportss);
router.get('/:id', getReportsById);
router.post('/', validate(createReportsSchema), createReports);

export default router;
