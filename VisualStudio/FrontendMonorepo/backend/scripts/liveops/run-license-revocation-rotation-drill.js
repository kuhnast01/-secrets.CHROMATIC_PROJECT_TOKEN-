"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const license_1 = require("../../src/security/license");
const licenseRevocations_1 = require("../../src/security/licenseRevocations");
const backendRoot = node_path_1.default.resolve(__dirname, '..', '..');
const repoRoot = node_path_1.default.resolve(backendRoot, '..');
function parseArgs(argv) {
    return argv.reduce((accumulator, argument) => {
        const [rawKey, ...rest] = argument.split('=');
        if (!rawKey?.startsWith('--') || rest.length === 0) {
            return accumulator;
        }
        accumulator[rawKey.slice(2)] = rest.join('=');
        return accumulator;
    }, {});
}
function utcTimestampCompact(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}
async function readPolicy(policyPath) {
    const raw = await promises_1.default.readFile(policyPath, 'utf8');
    return JSON.parse(raw);
}
function buildClaims(nowSeconds, expSeconds) {
    return {
        org: 'PoseidonLabs',
        tier: 'enterprise',
        features: ['alerts', 'analytics'],
        nbf: nowSeconds - 30,
        exp: nowSeconds + expSeconds,
    };
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const timestamp = utcTimestampCompact(new Date());
    const runId = `license-revocation-rotation-${timestamp}`;
    const policyPath = node_path_1.default.resolve(args.policyPath ?? node_path_1.default.join(repoRoot, 'governance/policies/license-revocation-rotation-policy.json'));
    const reportPath = node_path_1.default.resolve(args.reportDir ?? node_path_1.default.join(backendRoot, 'tmp/liveops-artifacts'), `lic-01-license-revocation-rotation-${timestamp}.json`);
    const workPath = node_path_1.default.resolve(args.workDir ?? node_path_1.default.join(backendRoot, 'tmp/licensing-revocation-rotation', runId));
    await promises_1.default.mkdir(node_path_1.default.dirname(reportPath), { recursive: true });
    await promises_1.default.mkdir(workPath, { recursive: true });
    const revocationStorePath = node_path_1.default.join(workPath, 'revocations.json');
    process.env.POSEIDON_LICENSE_REVOCATION_STORE_PATH = revocationStorePath;
    for (const entry of (0, licenseRevocations_1.listRuntimeRevocations)()) {
        (0, licenseRevocations_1.removeRuntimeRevocation)(entry.keyHash);
    }
    const policy = await readPolicy(policyPath);
    const secret = 'license-drill-secret';
    const nowSeconds = Math.floor(Date.now() / 1000);
    const rotationTtl = Math.max(policy.rotation.minimumRotationTtlSeconds, 600);
    const sourceClaims = buildClaims(nowSeconds, 3600);
    const sourceLicenseKey = (0, license_1.createLicenseKey)(sourceClaims, secret);
    const oldKeyHash = (0, license_1.hashLicenseKey)((0, license_1.normalizeLicenseKey)(sourceLicenseKey));
    const sourceValidation = (0, license_1.validateLicenseKey)(sourceLicenseKey, secret, (0, licenseRevocations_1.getRuntimeRevokedHashes)());
    const revocationReason = policy.revocation.allowedReasons.includes('rotated_license')
        ? 'rotated_license'
        : policy.revocation.allowedReasons[0] ?? 'manual_revocation';
    (0, licenseRevocations_1.addRuntimeRevocation)(oldKeyHash, revocationReason, 'drill-actor-admin');
    const revokedValidation = (0, license_1.validateLicenseKey)(sourceLicenseKey, secret, (0, licenseRevocations_1.getRuntimeRevokedHashes)());
    const rotatedClaims = {
        ...buildClaims(nowSeconds, rotationTtl),
        rotatedFrom: oldKeyHash,
    };
    const rotatedLicenseKey = (0, license_1.createLicenseKey)(rotatedClaims, secret);
    const rotatedKeyHash = (0, license_1.hashLicenseKey)((0, license_1.normalizeLicenseKey)(rotatedLicenseKey));
    const rotatedValidation = (0, license_1.validateLicenseKey)(rotatedLicenseKey, secret, (0, licenseRevocations_1.getRuntimeRevokedHashes)());
    const removed = (0, licenseRevocations_1.removeRuntimeRevocation)(oldKeyHash);
    const reactivatedValidation = (0, license_1.validateLicenseKey)(sourceLicenseKey, secret, (0, licenseRevocations_1.getRuntimeRevokedHashes)());
    const checks = [
        {
            name: 'source-license-valid-before-revocation',
            status: sourceValidation.valid ? 'pass' : 'fail',
            details: sourceValidation.reason ?? 'valid',
        },
        {
            name: 'source-license-blocked-after-revocation',
            status: revokedValidation.valid === false && revokedValidation.reason === 'license_revoked' ? 'pass' : 'fail',
            details: revokedValidation.reason ?? 'unexpected',
        },
        {
            name: 'rotated-license-valid',
            status: rotatedValidation.valid ? 'pass' : 'fail',
            details: rotatedValidation.reason ?? 'valid',
        },
        {
            name: 'revocation-removal-reactivates-source-license',
            status: removed && reactivatedValidation.valid ? 'pass' : 'fail',
            details: `removed=${String(removed)}; reason=${reactivatedValidation.reason ?? 'valid'}`,
        },
        {
            name: 'rotation-includes-metadata',
            status: policy.rotation.requireRotationMetadata &&
                typeof rotatedValidation.claims?.rotatedFrom === 'string' &&
                rotatedValidation.claims.rotatedFrom === oldKeyHash
                ? 'pass'
                : 'fail',
            details: `rotatedFrom=${String(rotatedValidation.claims?.rotatedFrom ?? '')}`,
        },
    ];
    const status = checks.every((check) => check.status === 'pass') ? 'pass' : 'fail';
    const simulationPath = node_path_1.default.join(workPath, 'rotation-simulation.json');
    await promises_1.default.writeFile(simulationPath, JSON.stringify({
        schemaVersion: 1,
        runId,
        generatedAt: new Date().toISOString(),
        oldKeyHash,
        rotatedKeyHash,
        checks,
    }, null, 2), 'utf8');
    const artifact = {
        schemaVersion: 1,
        pipeline: 'LIC-01',
        status,
        generatedAt: new Date().toISOString(),
        runId,
        policyPath,
        reportPath,
        workPath,
        policy,
        checks,
        summary: {
            oldKeyHash,
            rotatedKeyHash,
            revokedByRuntimeStore: revokedValidation.reason === 'license_revoked',
            oldLicenseReactivatedAfterRemove: reactivatedValidation.valid,
            rotatedLicenseValid: rotatedValidation.valid,
        },
    };
    await promises_1.default.writeFile(reportPath, JSON.stringify(artifact, null, 2), 'utf8');
    console.log(JSON.stringify(artifact, null, 2));
    if (status === 'fail') {
        process.exit(1);
    }
}
main().catch((error) => {
    const message = error instanceof Error ? error.message : 'unknown_error';
    console.error(JSON.stringify({ error: message }, null, 2));
    process.exit(1);
});
