"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.licenseGuard = licenseGuard;
const logger_1 = __importDefault(require("../utils/logger"));
const license_1 = require("../security/license");
const licenseRevocations_1 = require("../security/licenseRevocations");
function licenseGuard(req, res, next) {
    const mode = (0, license_1.getLicenseMode)();
    if (mode === 'off') {
        return next();
    }
    const exemptPaths = (0, license_1.getExemptPaths)();
    if ((0, license_1.isLicenseExemptPath)(req.path, exemptPaths)) {
        return next();
    }
    const licenseKey = (0, license_1.resolveLicenseKey)(req.headers['x-poseidon-license']);
    const revokedHashes = (0, licenseRevocations_1.getRuntimeRevokedHashes)();
    const validation = (0, license_1.validateLicenseKey)(licenseKey, process.env.POSEIDON_LICENSE_SECRET, revokedHashes);
    if (validation.valid) {
        res.locals.license = validation;
        return next();
    }
    logger_1.default.warn({
        path: req.path,
        mode,
        reason: validation.reason,
        method: req.method,
    }, 'License validation failed');
    if (mode === 'warn') {
        res.setHeader('x-poseidon-license-warning', validation.reason ?? 'license_validation_failed');
        return next();
    }
    return res.status(503).json({
        error: 'License validation failed',
        code: validation.reason ?? 'license_validation_failed',
    });
}
