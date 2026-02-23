"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_2 = require("express");
const auth_1 = __importDefault(require("./routes/auth"));
const battle_1 = __importDefault(require("./routes/battle"));
const events_1 = __importDefault(require("./routes/events"));
const users_1 = __importDefault(require("./routes/users"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const license_1 = __importDefault(require("./routes/license"));
const audit_1 = __importDefault(require("./routes/audit"));
const health_1 = __importDefault(require("./routes/health"));
const systemHealth_1 = __importDefault(require("./routes/systemHealth"));
const swagger_1 = require("./swagger");
const security_1 = require("./middleware/security");
const cors_1 = require("./middleware/cors");
const logger_1 = __importDefault(require("./utils/logger"));
const auditLogger_1 = require("./middleware/auditLogger");
const licenseGuard_1 = require("./middleware/licenseGuard");
const i18n_1 = __importDefault(require("./middleware/i18n"));
const license_2 = require("./security/license");
dotenv_1.default.config();
const licenseMode = (0, license_2.getLicenseMode)();
if (licenseMode !== 'off' && !process.env.POSEIDON_LICENSE_SECRET) {
    logger_1.default.warn({ licenseMode }, 'POSEIDON_LICENSE_SECRET is not configured; license checks will fail');
}
logger_1.default.info({
    licenseMode,
    hasLicenseSecret: Boolean(process.env.POSEIDON_LICENSE_SECRET),
    hasFallbackLicenseKey: Boolean(process.env.POSEIDON_LICENSE_KEY),
}, 'License enforcement initialized');
const app = (0, express_1.default)();
app.use(cors_1.corsMiddleware); // Enable CORS for frontend
app.use(security_1.securityHeaders); // Secure HTTP headers
app.use(security_1.limiter); // Rate limiting
app.use((0, express_2.json)());
app.use(auditLogger_1.auditLogger); // Audit logging
app.use(i18n_1.default); // Localization
app.use(licenseGuard_1.licenseGuard); // License enforcement (off/warn/strict)
// BEGINNER TIP: Visit http://localhost:4000/api-docs for interactive API docs
if (process.env.NODE_ENV !== 'test') {
    (0, swagger_1.setupSwagger)(app);
}
app.use(health_1.default); // /healthz endpoint for liveness/readiness
app.use(systemHealth_1.default); // /system-health endpoint for admin panel
app.use('/auth', auth_1.default);
app.use('/events', events_1.default);
app.use('/users', users_1.default);
app.use('/analytics', analytics_1.default);
app.use('/api/battle', battle_1.default);
app.use('/audit', audit_1.default);
app.use('/license', license_1.default);
// Only start the server if this file is run directly, not when imported for tests
if (require.main === module) {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`LiveOps backend running on port ${port}`);
    });
}
exports.default = app;
