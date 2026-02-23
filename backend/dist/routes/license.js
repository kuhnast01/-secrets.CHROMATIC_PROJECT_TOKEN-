"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const logger_1 = __importDefault(require("../utils/logger"));
const license_1 = require("../security/license");
const licenseRevocations_1 = require("../security/licenseRevocations");
const router = (0, express_1.Router)();
const MAX_LICENSE_KEY_LENGTH = 4096;
/**
 * @swagger
 * components:
 *   schemas:
 *     LicenseAuditMetadata:
 *       type: object
 *       properties:
 *         actorId:
 *           type: string
 *         actorRole:
 *           type: string
 *           nullable: true
 *         timestamp:
 *           type: string
 *           format: date-time
 *       required:
 *         - actorId
 *         - timestamp
 *     LicenseRevocationEntry:
 *       type: object
 *       properties:
 *         keyHash:
 *           type: string
 *           description: Lowercase SHA-256 hex hash of normalized license key
 *         reason:
 *           type: string
 *         revokedAt:
 *           type: string
 *           format: date-time
 *         actorId:
 *           type: string
 *           nullable: true
 *       required:
 *         - keyHash
 *         - reason
 *         - revokedAt
 *     LicenseRevocationListResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           minimum: 0
 *         entries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LicenseRevocationEntry'
 *       required:
 *         - count
 *         - entries
 *     LicenseRevocationDeleteResponse:
 *       type: object
 *       properties:
 *         removed:
 *           type: boolean
 *         keyHash:
 *           type: string
 *         audit:
 *           $ref: '#/components/schemas/LicenseAuditMetadata'
 *       required:
 *         - removed
 *         - keyHash
 *         - audit
 *     LicenseRotateResponse:
 *       type: object
 *       properties:
 *         licenseKey:
 *           type: string
 *         oldKeyHash:
 *           type: string
 *         newKeyHash:
 *           type: string
 *         revokePrevious:
 *           type: boolean
 *         expiresAt:
 *           type: integer
 *           description: Unix timestamp (seconds)
 *         claims:
 *           type: object
 *           additionalProperties: true
 *         audit:
 *           $ref: '#/components/schemas/LicenseAuditMetadata'
 *       required:
 *         - licenseKey
 *         - oldKeyHash
 *         - newKeyHash
 *         - revokePrevious
 *         - expiresAt
 *         - claims
 *         - audit
 *     LicenseStatusResponse:
 *       type: object
 *       properties:
 *         mode:
 *           type: string
 *           enum: [off, warn, strict]
 *         valid:
 *           type: boolean
 *         reason:
 *           type: string
 *           nullable: true
 *         claims:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *         exemptPaths:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - mode
 *         - valid
 *         - reason
 *         - claims
 *         - exemptPaths
 *     LicenseHashResponse:
 *       type: object
 *       properties:
 *         keyHash:
 *           type: string
 *       required:
 *         - keyHash
 *     LicenseValidateResponse:
 *       type: object
 *       properties:
 *         valid:
 *           type: boolean
 *         reason:
 *           type: string
 *           nullable: true
 *         claims:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *         keyHash:
 *           type: string
 *         revoked:
 *           type: boolean
 *       required:
 *         - valid
 *         - reason
 *         - claims
 *         - keyHash
 *         - revoked
 * /license/status:
 *   get:
 *     summary: Evaluate current request license status
 *     tags: [License]
 *     description: Requires bearer JWT; allowed roles are admin and auditor.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-poseidon-license
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: License mode and validation result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LicenseStatusResponse'
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Caller role is not allowed
 * /license/revocations:
 *   get:
 *     summary: List runtime license revocations
 *     tags: [License]
 *     description: Requires bearer JWT; allowed roles are admin and auditor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revocation list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LicenseRevocationListResponse'
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Caller role is not allowed
 *   post:
 *     summary: Add a runtime license revocation
 *     tags: [License]
 *     description: Requires bearer JWT; allowed role is admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licenseKey:
 *                 type: string
 *               keyHash:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Revocation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LicenseRevocationEntry'
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Caller role is not allowed
 * /license/revocations/{keyHash}:
 *   delete:
 *     summary: Remove a runtime license revocation
 *     tags: [License]
 *     description: Requires bearer JWT; allowed role is admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: keyHash
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Revocation removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LicenseRevocationDeleteResponse'
 *       404:
 *         description: Revocation not found
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Caller role is not allowed
 * /license/tools/hash:
 *   post:
 *     summary: Hash a license key for revocation workflows
 *     tags: [License]
 *     description: Requires bearer JWT; allowed role is admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licenseKey
 *             properties:
 *               licenseKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deterministic license key hash
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LicenseHashResponse'
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Caller role is not allowed
 * /license/tools/validate:
 *   post:
 *     summary: Dry-run validate a license key
 *     tags: [License]
 *     description: Requires bearer JWT; allowed role is admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licenseKey
 *             properties:
 *               licenseKey:
 *                 type: string
 *               nowMs:
 *                 type: number
 *                 description: Optional epoch milliseconds override for deterministic checks
 *     responses:
 *       200:
 *         description: Validation result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LicenseValidateResponse'
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Caller role is not allowed
 * /license/tools/rotate:
 *   post:
 *     summary: Rotate a license key
 *     tags: [License]
 *     description: Requires bearer JWT; allowed role is admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licenseKey
 *             properties:
 *               licenseKey:
 *                 type: string
 *               revokePrevious:
 *                 type: boolean
 *               nextExpSeconds:
 *                 type: integer
 *               org:
 *                 type: string
 *               tier:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: License rotated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LicenseRotateResponse'
 *       400:
 *         description: Invalid or ineligible source license
 *       401:
 *         description: Missing or invalid bearer token
 *       403:
 *         description: Caller role is not allowed
 */
function getActorMetadata(req) {
    const user = req.user ?? undefined;
    return {
        actorId: typeof user?.id === 'string' ? user.id : String(user?.id ?? ''),
        actorRole: typeof user?.role === 'string' ? user.role : null,
    };
}
function createAuditMetadata(req) {
    return {
        ...getActorMetadata(req),
        timestamp: new Date().toISOString(),
    };
}
function parseBodyLicenseKey(body) {
    if (!body || typeof body !== 'object') {
        return undefined;
    }
    const candidate = body.licenseKey;
    if (typeof candidate !== 'string') {
        return undefined;
    }
    const trimmed = candidate.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_LICENSE_KEY_LENGTH) {
        return undefined;
    }
    return trimmed;
}
function parseNowMs(body) {
    if (!body || typeof body !== 'object') {
        return undefined;
    }
    const candidate = body.nowMs;
    if (typeof candidate === 'number' && Number.isFinite(candidate) && candidate >= 0) {
        return candidate;
    }
    return undefined;
}
function parseOptionalString(body, key) {
    if (!body || typeof body !== 'object') {
        return undefined;
    }
    const value = body[key];
    if (typeof value !== 'string') {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
function parseOptionalNumber(body, key) {
    if (!body || typeof body !== 'object') {
        return undefined;
    }
    const value = body[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return undefined;
    }
    return value;
}
function parseOptionalBoolean(body, key) {
    if (!body || typeof body !== 'object') {
        return undefined;
    }
    const value = body[key];
    return typeof value === 'boolean' ? value : undefined;
}
function parseOptionalStringArray(body, key) {
    if (!body || typeof body !== 'object') {
        return undefined;
    }
    const raw = body[key];
    if (!Array.isArray(raw)) {
        return undefined;
    }
    const values = raw
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item) => item.length > 0);
    return values.length > 0 ? values : undefined;
}
router.get('/status', auth_1.authenticateJWT, (0, rbac_1.authorizeRoles)('admin', 'auditor'), (req, res) => {
    const mode = (0, license_1.getLicenseMode)();
    const revokedHashes = (0, licenseRevocations_1.getRuntimeRevokedHashes)();
    const validation = (0, license_1.validateLicenseKey)((0, license_1.resolveLicenseKey)(req.headers['x-poseidon-license']), process.env.POSEIDON_LICENSE_SECRET, revokedHashes);
    res.status(200).json({
        mode,
        valid: validation.valid,
        reason: validation.reason ?? null,
        claims: validation.claims ?? null,
        exemptPaths: (0, license_1.getExemptPaths)(),
    });
});
router.get('/revocations', auth_1.authenticateJWT, (0, rbac_1.authorizeRoles)('admin', 'auditor'), (req, res) => {
    const entries = (0, licenseRevocations_1.listRuntimeRevocations)();
    res.status(200).json({
        count: entries.length,
        entries,
    });
});
router.post('/revocations', auth_1.authenticateJWT, (0, rbac_1.authorizeRoles)('admin'), (req, res) => {
    const licenseKey = parseBodyLicenseKey(req.body);
    const keyHashFromBody = parseOptionalString(req.body, 'keyHash');
    const reason = parseOptionalString(req.body, 'reason') ?? 'manual_revocation';
    let keyHash = keyHashFromBody;
    if (!keyHash && licenseKey) {
        keyHash = (0, license_1.hashLicenseKey)((0, license_1.normalizeLicenseKey)(licenseKey));
    }
    if (!keyHash) {
        return res.status(400).json({ error: 'licenseKey or keyHash is required' });
    }
    try {
        const actor = getActorMetadata(req);
        const entry = (0, licenseRevocations_1.addRuntimeRevocation)(keyHash, reason, actor.actorId || undefined);
        logger_1.default.info({
            event: 'license.revocations.added',
            path: req.path,
            method: req.method,
            keyHash: entry.keyHash,
            reason: entry.reason,
            ...actor,
        }, 'License revoked via admin endpoint');
        return res.status(201).json(entry);
    }
    catch {
        return res.status(400).json({ error: 'invalid keyHash' });
    }
});
router.delete('/revocations/:keyHash', auth_1.authenticateJWT, (0, rbac_1.authorizeRoles)('admin'), (req, res) => {
    const removed = (0, licenseRevocations_1.removeRuntimeRevocation)(req.params.keyHash);
    if (!removed) {
        return res.status(404).json({ error: 'revocation_not_found' });
    }
    const audit = createAuditMetadata(req);
    logger_1.default.info({
        event: 'license.revocations.removed',
        path: req.path,
        method: req.method,
        keyHash: req.params.keyHash,
        ...audit,
    }, 'License revocation removed via admin endpoint');
    return res.status(200).json({
        removed: true,
        keyHash: req.params.keyHash,
        audit,
    });
});
router.post('/tools/hash', auth_1.authenticateJWT, (0, rbac_1.authorizeRoles)('admin'), (req, res) => {
    const licenseKey = parseBodyLicenseKey(req.body);
    if (!licenseKey) {
        logger_1.default.warn({
            event: 'license.tools.hash.rejected',
            reason: 'invalid_license_key_input',
            path: req.path,
            method: req.method,
            ...getActorMetadata(req),
        }, 'License tool request rejected');
        return res.status(400).json({ error: 'licenseKey is required' });
    }
    const normalized = (0, license_1.normalizeLicenseKey)(licenseKey);
    const keyHash = (0, license_1.hashLicenseKey)(normalized);
    logger_1.default.info({
        event: 'license.tools.hash.executed',
        path: req.path,
        method: req.method,
        keyHash,
        ...getActorMetadata(req),
    }, 'License hash generated via admin tool');
    return res.status(200).json({
        keyHash,
    });
});
router.post('/tools/validate', auth_1.authenticateJWT, (0, rbac_1.authorizeRoles)('admin'), (req, res) => {
    const licenseKey = parseBodyLicenseKey(req.body);
    if (!licenseKey) {
        logger_1.default.warn({
            event: 'license.tools.validate.rejected',
            reason: 'invalid_license_key_input',
            path: req.path,
            method: req.method,
            ...getActorMetadata(req),
        }, 'License tool request rejected');
        return res.status(400).json({ error: 'licenseKey is required' });
    }
    const revokedHashes = (0, licenseRevocations_1.getRuntimeRevokedHashes)();
    const normalized = (0, license_1.normalizeLicenseKey)(licenseKey);
    const keyHash = (0, license_1.hashLicenseKey)(normalized);
    const nowMs = parseNowMs(req.body);
    const validation = (0, license_1.validateLicenseKey)(licenseKey, process.env.POSEIDON_LICENSE_SECRET, revokedHashes, nowMs);
    logger_1.default.info({
        event: 'license.tools.validate.executed',
        path: req.path,
        method: req.method,
        keyHash,
        valid: validation.valid,
        reason: validation.reason ?? null,
        revoked: validation.reason === 'license_revoked',
        ...getActorMetadata(req),
    }, 'License validation dry-run executed via admin tool');
    return res.status(200).json({
        valid: validation.valid,
        reason: validation.reason ?? null,
        claims: validation.claims ?? null,
        keyHash,
        revoked: validation.reason === 'license_revoked',
    });
});
router.post('/tools/rotate', auth_1.authenticateJWT, (0, rbac_1.authorizeRoles)('admin'), (req, res) => {
    const sourceLicenseKey = parseBodyLicenseKey(req.body);
    if (!sourceLicenseKey) {
        return res.status(400).json({ error: 'licenseKey is required' });
    }
    const licenseSecret = process.env.POSEIDON_LICENSE_SECRET;
    if (!licenseSecret) {
        return res.status(500).json({ error: 'POSEIDON_LICENSE_SECRET is not configured' });
    }
    const revokedHashes = (0, licenseRevocations_1.getRuntimeRevokedHashes)();
    const sourceValidation = (0, license_1.validateLicenseKey)(sourceLicenseKey, licenseSecret, revokedHashes);
    if (!sourceValidation.valid || !sourceValidation.claims) {
        return res.status(400).json({
            error: 'licenseKey is not eligible for rotation',
            reason: sourceValidation.reason ?? 'invalid_license',
        });
    }
    const nowSeconds = Math.floor(Date.now() / 1000);
    const nextExpSeconds = parseOptionalNumber(req.body, 'nextExpSeconds') ?? 60 * 60 * 24 * 90;
    const revokePrevious = parseOptionalBoolean(req.body, 'revokePrevious') ?? true;
    const claims = {
        ...sourceValidation.claims,
        org: parseOptionalString(req.body, 'org') ?? sourceValidation.claims.org,
        tier: parseOptionalString(req.body, 'tier') ?? sourceValidation.claims.tier,
        features: parseOptionalStringArray(req.body, 'features') ?? sourceValidation.claims.features,
        nbf: nowSeconds - 5,
        exp: nowSeconds + Math.max(300, Math.floor(nextExpSeconds)),
        rotatedFrom: (0, license_1.hashLicenseKey)((0, license_1.normalizeLicenseKey)(sourceLicenseKey)),
    };
    const rotatedLicenseKey = (0, license_1.createLicenseKey)(claims, licenseSecret);
    const oldKeyHash = (0, license_1.hashLicenseKey)((0, license_1.normalizeLicenseKey)(sourceLicenseKey));
    const newKeyHash = (0, license_1.hashLicenseKey)((0, license_1.normalizeLicenseKey)(rotatedLicenseKey));
    const audit = createAuditMetadata(req);
    if (revokePrevious) {
        (0, licenseRevocations_1.addRuntimeRevocation)(oldKeyHash, 'rotated_license', audit.actorId || undefined);
    }
    logger_1.default.info({
        event: 'license.tools.rotate.executed',
        path: req.path,
        method: req.method,
        oldKeyHash,
        newKeyHash,
        revokePrevious,
        ...audit,
    }, 'License rotated via admin tool');
    return res.status(200).json({
        licenseKey: rotatedLicenseKey,
        oldKeyHash,
        newKeyHash,
        revokePrevious,
        expiresAt: claims.exp,
        claims,
        audit,
    });
});
exports.default = router;
