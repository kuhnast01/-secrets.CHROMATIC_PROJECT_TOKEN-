import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import {
  getExemptPaths,
  getLicenseMode,
  isLicenseExemptPath,
  resolveLicenseKey,
  validateLicenseKey,
} from '../security/license';
import { getRuntimeRevokedHashes } from '../security/licenseRevocations';

export function licenseGuard(req: Request, res: Response, next: NextFunction) {
  const mode = getLicenseMode();
  if (mode === 'off') {
    return next();
  }

  const exemptPaths = getExemptPaths();
  if (isLicenseExemptPath(req.path, exemptPaths)) {
    return next();
  }

  const licenseKey = resolveLicenseKey(req.headers['x-poseidon-license']);
  const revokedHashes = getRuntimeRevokedHashes();
  const validation = validateLicenseKey(licenseKey, process.env.POSEIDON_LICENSE_SECRET, revokedHashes);

  if (validation.valid) {
    res.locals.license = validation;
    return next();
  }

  logger.warn(
    {
      path: req.path,
      mode,
      reason: validation.reason,
      method: req.method,
    },
    'License validation failed',
  );

  if (mode === 'warn') {
    res.setHeader('x-poseidon-license-warning', validation.reason ?? 'license_validation_failed');
    return next();
  }

  return res.status(503).json({
    error: 'License validation failed',
    code: validation.reason ?? 'license_validation_failed',
  });
}
