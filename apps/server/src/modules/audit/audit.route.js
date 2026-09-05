import { Router } from 'express';
import { getAudits, getAuditById, createAudit } from './audit.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createAuditSchema } from './audit.validation.js';

const router = Router();

router.get('/', getAudits);
router.get('/:id', getAuditById);
router.post('/', validate(createAuditSchema), createAudit);

export default router;
