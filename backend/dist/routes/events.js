"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const router = express_1.default.Router();
// Example: GET /events
const eventController_1 = require("../controllers/eventController");
router.get('/', auth_1.authenticateJWT, (0, rbac_1.authorizeRoles)('admin', 'editor', 'qa'), eventController_1.getEvents);
router.post('/', auth_1.authenticateJWT, (0, rbac_1.authorizeRoles)('admin', 'editor'), eventController_1.addEvent);
exports.default = router;
