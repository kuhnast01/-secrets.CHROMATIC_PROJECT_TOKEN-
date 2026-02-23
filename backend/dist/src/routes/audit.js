import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
const router = express.Router();
import { getAudit } from '../controllers/auditController';
router.get('/', authenticateJWT, authorizeRoles('admin', 'auditor'), getAudit);
export default router;
