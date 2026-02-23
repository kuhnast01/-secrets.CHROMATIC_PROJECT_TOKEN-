import express from 'express';
let dotenvLoaded = false;
import { json } from 'express';
import authRoutes from './routes/auth';
import battleRoutes from './routes/battle';
import eventRoutes from './routes/events';
import userRoutes from './routes/users';
import analyticsRoutes from './routes/analytics';
import licenseRoutes from './routes/license';
import auditRoutes from './routes/audit';
import shopRoutes from './routes/shop';
import adminRoutes from './routes/admin';
import healthRoutes from './routes/health';
import systemHealthRoutes from './routes/systemHealth';
import { setupSwagger } from './swagger';
import { securityHeaders, limiter } from './middleware/security';
import { corsMiddleware } from './middleware/cors';
import logger from './utils/logger';
import { auditLogger } from './middleware/auditLogger';
import { licenseGuard } from './middleware/licenseGuard';
import i18nMiddleware from './middleware/i18n';
import { getLicenseMode } from './security/license';
// Only load dotenv if not running in test environment
if (process.env.NODE_ENV !== 'test') {
    // Dynamically import dotenv to avoid polluting test environment
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
    dotenvLoaded = true;
}
const licenseMode = getLicenseMode();
if (licenseMode !== 'off' && !process.env.POSEIDON_LICENSE_SECRET) {
    logger.warn({ licenseMode }, 'POSEIDON_LICENSE_SECRET is not configured; license checks will fail');
}
logger.info({
    licenseMode,
    hasLicenseSecret: Boolean(process.env.POSEIDON_LICENSE_SECRET),
    hasFallbackLicenseKey: Boolean(process.env.POSEIDON_LICENSE_KEY),
    dotenvLoaded,
}, 'License enforcement initialized');
const app = express();
app.use(corsMiddleware); // Enable CORS for frontend
app.use(securityHeaders); // Secure HTTP headers
app.use(limiter); // Rate limiting
app.use(json());
app.use(auditLogger); // Audit logging
app.use(i18nMiddleware); // Localization
app.use(licenseGuard); // License enforcement (off/warn/strict)
// BEGINNER TIP: Visit http://localhost:4000/api-docs for interactive API docs
if (process.env.NODE_ENV !== 'test') {
    setupSwagger(app);
}
app.use(healthRoutes); // /healthz endpoint for liveness/readiness
app.use(systemHealthRoutes); // /system-health endpoint for admin panel
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/battle', battleRoutes);
app.use('/audit', auditRoutes);
app.use('/license', licenseRoutes);
// Only start the server if this file is run directly, not when imported for tests
if (require.main === module) {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`LiveOps backend running on port ${port}`);
    });
}
export default app;
