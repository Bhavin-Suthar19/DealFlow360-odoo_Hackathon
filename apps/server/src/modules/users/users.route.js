import { Router } from 'express';
import { getUserss, getUsersById, createUsers } from './users.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createUsersSchema } from './users.validation.js';

const router = Router();

router.get('/', getUserss);
router.get('/:id', getUsersById);
router.post('/', validate(createUsersSchema), createUsers);

export default router;
