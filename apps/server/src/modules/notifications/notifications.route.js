import { Router } from 'express';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { successResponse } from '../../utils/apiResponse.util.js';

const router = Router();

router.use(verifyAuth);

router.get('/', (req, res) => {
  return successResponse(res, [], { total: 0, page: 1, limit: 50 });
});

router.patch('/:id/read', (req, res) => {
  return successResponse(res, { id: req.params.id, read: true });
});

export default router;
