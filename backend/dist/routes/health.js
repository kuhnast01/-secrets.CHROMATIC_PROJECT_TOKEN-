"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Liveness/readiness probe for cloud/k8s
router.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));
exports.default = router;
