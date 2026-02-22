import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = express.Router();

// Example: GET /events

import { getEvents, addEvent } from '../controllers/eventController';
router.get('/', authenticateJWT, authorizeRoles('admin', 'editor', 'qa'), getEvents);

router.post('/', authenticateJWT, authorizeRoles('admin', 'editor'), addEvent);

export default router;
