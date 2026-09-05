import { Router } from 'express';
import * as controller from './negotiation.controller.js';
import { verifyPortalAuth } from '../../middlewares/portalAuth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createNegotiationSchema } from './negotiation.validation.js';

const router = Router();

// Protected exclusively by Portal Auth Token Middleware
router.use(verifyPortalAuth);

router.get('/quotations/:id', controller.getPortalQuotation);
router.post('/quotations/:id/negotiate', validate(createNegotiationSchema), controller.submitNegotiationRequest);
router.post('/quotations/:id/confirm', controller.confirmPortalQuotation);

export default router;
