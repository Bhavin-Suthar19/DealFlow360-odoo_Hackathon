import { Router } from 'express';
import * as controller from './users.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.use(verifyAuth);

router.get('/', controller.getUsers);
router.get('/profile', controller.getProfile);
router.patch('/profile', controller.updateProfile);
router.put('/profile', controller.updateProfile);
router.get('/:id', controller.getUsersById);
router.patch('/:id', controller.updateProfile);
router.post('/provision', requireRole(['admin']), controller.provisionUser);

export default router;
