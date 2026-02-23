import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
export const securityHeaders = helmet();
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/healthz' || req.path === '/system-health',
});
// Example 2FA stub middleware
export function require2FA(req, res, next) {
    // In production, check user 2FA status here
    next();
}
