import crypto from 'node:crypto';

export type LicenseEnforcementMode = 'off' | 'warn' | 'strict';

export interface LicenseClaims {
  org?: string;
  tier?: string;
  exp?: number;
  nbf?: number;
  features?: string[];
  [key: string]: unknown;
}

export interface LicenseValidationResult {
  valid: boolean;
  reason?: string;
  claims?: LicenseClaims;
}

const DEFAULT_EXEMPT_PATHS = ['/healthz', '/system-health', '/auth', '/api-docs'];
const LICENSE_PREFIX = 'POSEIDON-LIC.';
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;

export function normalizeLicenseKey(input: string): string {
  return input.startsWith(LICENSE_PREFIX) ? input.slice(LICENSE_PREFIX.length) : input;
}

export function hashLicenseKey(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function createLicenseKey(claims: LicenseClaims, secret: string): string {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${LICENSE_PREFIX}${payload}.${signature}`;
}

function base64urlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  return Buffer.from(normalized + '='.repeat(padLength), 'base64').toString('utf8');
}

function safeEqualHex(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'hex');
  const bBuf = Buffer.from(b, 'hex');
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function getLicenseMode(env: NodeJS.ProcessEnv = process.env): LicenseEnforcementMode {
  const raw = (env.POSEIDON_LICENSE_ENFORCEMENT ?? 'warn').toLowerCase();
  if (raw === 'off' || raw === 'warn' || raw === 'strict') return raw;
  return 'warn';
}

export function getExemptPaths(env: NodeJS.ProcessEnv = process.env): string[] {
  const configured = (env.POSEIDON_LICENSE_EXEMPT_PATHS ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  return configured.length > 0 ? configured : DEFAULT_EXEMPT_PATHS;
}

export function isLicenseExemptPath(path: string, exemptPaths: string[]): boolean {
  return exemptPaths.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function validateLicenseKey(
  licenseKey: string | undefined,
  secret: string | undefined,
  revokedHashes: Set<string> = new Set(),
  nowMs: number = Date.now(),
): LicenseValidationResult {
  if (!licenseKey) {
    return { valid: false, reason: 'missing_license_key' };
  }

  if (!secret) {
    return { valid: false, reason: 'missing_license_secret' };
  }

  const normalized = normalizeLicenseKey(licenseKey);
  const keyHash = hashLicenseKey(normalized);
  if (revokedHashes.has(keyHash)) {
    return { valid: false, reason: 'license_revoked' };
  }

  const [encodedPayload, signature] = normalized.split('.');

  if (!encodedPayload || !signature) {
    return { valid: false, reason: 'invalid_license_format' };
  }

  const expected = crypto.createHmac('sha256', secret).update(encodedPayload).digest('hex');
  if (!safeEqualHex(signature, expected)) {
    return { valid: false, reason: 'invalid_license_signature' };
  }

  let claims: LicenseClaims;
  try {
    claims = JSON.parse(base64urlDecode(encodedPayload)) as LicenseClaims;
  } catch {
    return { valid: false, reason: 'invalid_license_payload' };
  }

  const nowSeconds = Math.floor(nowMs / 1000);
  if (typeof claims.nbf === 'number' && nowSeconds < claims.nbf) {
    return { valid: false, reason: 'license_not_active', claims };
  }
  if (typeof claims.exp === 'number' && nowSeconds >= claims.exp) {
    return { valid: false, reason: 'license_expired', claims };
  }

  return { valid: true, claims };
}

export function resolveLicenseKey(
  headerValue: string | string[] | undefined,
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  if (Array.isArray(headerValue)) {
    return headerValue[0];
  }
  if (typeof headerValue === 'string' && headerValue.trim().length > 0) {
    return headerValue.trim();
  }
  if (env.POSEIDON_LICENSE_KEY && env.POSEIDON_LICENSE_KEY.trim().length > 0) {
    return env.POSEIDON_LICENSE_KEY.trim();
  }
  return undefined;
}

export function getRevokedLicenseHashes(env: NodeJS.ProcessEnv = process.env): Set<string> {
  const values = (env.POSEIDON_LICENSE_REVOKED_HASHES ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => SHA256_HEX_PATTERN.test(item));

  return new Set(values);
}
