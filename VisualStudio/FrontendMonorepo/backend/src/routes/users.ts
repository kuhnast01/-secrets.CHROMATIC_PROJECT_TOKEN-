import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = express.Router();


import { getUsers } from '../controllers/userController';
router.get('/', authenticateJWT, authorizeRoles('admin'), getUsers);

export default router;
