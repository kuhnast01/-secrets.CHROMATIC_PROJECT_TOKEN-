import { Router } from 'express';
const router = Router();

// Liveness/readiness probe for cloud/k8s
router.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));

export default router;
