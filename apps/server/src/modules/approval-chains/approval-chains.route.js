import { Router } from 'express';
import { getApprovalChainss, getApprovalChainsById, createApprovalChains } from './approval-chains.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createApprovalChainsSchema } from './approval-chains.validation.js';

const router = Router();

router.get('/', getApprovalChainss);
router.get('/:id', getApprovalChainsById);
router.post('/', validate(createApprovalChainsSchema), createApprovalChains);

export default router;
