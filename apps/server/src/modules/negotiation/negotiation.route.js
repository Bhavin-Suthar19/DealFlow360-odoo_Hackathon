import { Router } from 'express';
import { getNegotiations, getNegotiationById, createNegotiation } from './negotiation.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createNegotiationSchema } from './negotiation.validation.js';

const router = Router();

router.get('/', getNegotiations);
router.get('/:id', getNegotiationById);
router.post('/', validate(createNegotiationSchema), createNegotiation);

export default router;
