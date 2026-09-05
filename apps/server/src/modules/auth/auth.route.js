import { Router } from 'express';
import { getAuths, getAuthById, createAuth } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createAuthSchema } from './auth.validation.js';

const router = Router();

router.get('/', getAuths);
router.get('/:id', getAuthById);
router.post('/', validate(createAuthSchema), createAuth);

export default router;
