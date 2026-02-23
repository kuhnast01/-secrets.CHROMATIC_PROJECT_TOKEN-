"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const router = express_1.default.Router();
const analyticsController_1 = require("../controllers/analyticsController");
router.get('/', auth_1.authenticateJWT, (0, rbac_1.authorizeRoles)('admin', 'analyst'), analyticsController_1.getAnalyticsData);
exports.default = router;
