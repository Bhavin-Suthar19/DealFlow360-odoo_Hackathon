import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { signupSchema, loginSchema, portalLoginSchema } from './auth.validation.js';

import { verifyAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/me', authController.me);
router.patch('/profile', verifyAuth, authController.updateProfile);
router.put('/profile', verifyAuth, authController.updateProfile);
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/portal/login', validate(portalLoginSchema), authController.portalLogin);

export default router;
