import { Router } from 'express';
import { getApprovalss, getApprovalsById, createApprovals } from './approvals.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createApprovalsSchema } from './approvals.validation.js';

const router = Router();

router.get('/', getApprovalss);
router.get('/:id', getApprovalsById);
router.post('/', validate(createApprovalsSchema), createApprovals);

export default router;
