import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
const router = express.Router();
import { getAnalyticsData } from '../controllers/analyticsController';
router.get('/', authenticateJWT, authorizeRoles('admin', 'analyst'), getAnalyticsData);
export default router;
