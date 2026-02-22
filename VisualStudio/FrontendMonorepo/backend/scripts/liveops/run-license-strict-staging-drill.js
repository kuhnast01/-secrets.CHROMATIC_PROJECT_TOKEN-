"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
// Dynamic import resolution for dev (TS) and prod (JS)
const isDist = __dirname.includes('dist');
const basePath = isDist ? '../../dist' : '../../src';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { licenseGuard } = require(`${basePath}/middleware/licenseGuard.js`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const licenseUtils = require(`${basePath}/security/license.js`);
const { createLicenseKey, hashLicenseKey, normalizeLicenseKey } = licenseUtils;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const licenseRevocations = require(`${basePath}/security/licenseRevocations.js`);
const { addRuntimeRevocation, listRuntimeRevocations, removeRuntimeRevocation } = licenseRevocations;
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
function buildApp() {
    const app = (0, express_1.default)();
    app.use(licenseGuard);
    app.get('/protected', (_req, res) => {
        res.status(200).json({ ok: true });
    });
    return app;
}
async function runEndurance({ app, validLicense, requestCount }) {
    let successCount = 0;
    let failureCount = 0;
    for (let index = 0; index < requestCount; index += 1) {
        const response = await (0, supertest_1.default)(app).get('/protected').set('x-poseidon-license', validLicense);
        if (response.status === 200) {
            successCount += 1;
        }
        else {
            failureCount += 1;
        }
    }
    const successRate = requestCount > 0 ? Number((successCount / requestCount).toFixed(6)) : 0;
    return { successCount, failureCount, successRate };
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const timestamp = utcTimestampCompact(new Date());
    const runId = `license-strict-staging-${timestamp}`;
    const policyPath = node_path_1.default.resolve(args.policyPath ?? node_path_1.default.join(repoRoot, 'governance/policies/license-strict-staging-rollout-policy.json'));
    const reportPath = node_path_1.default.resolve(args.reportDir ?? node_path_1.default.join(backendRoot, 'tmp/liveops-artifacts'), `lic-02-license-strict-staging-${timestamp}.json`);
    const workPath = node_path_1.default.resolve(args.workDir ?? node_path_1.default.join(backendRoot, 'tmp/licensing-strict-staging', runId));
    await promises_1.default.mkdir(node_path_1.default.dirname(reportPath), { recursive: true });
    await promises_1.default.mkdir(workPath, { recursive: true });
    process.env.POSEIDON_LICENSE_ENFORCEMENT = 'strict';
    process.env.POSEIDON_LICENSE_SECRET = process.env.POSEIDON_LICENSE_SECRET || 'license-strict-staging-drill-secret';
    delete process.env.POSEIDON_LICENSE_KEY;
    delete process.env.POSEIDON_LICENSE_REVOKED_HASHES;
    const policy = await readPolicy(policyPath);
    for (const entry of listRuntimeRevocations()) {
        removeRuntimeRevocation(entry.keyHash);
    }
    const nowSeconds = Math.floor(Date.now() / 1000);
    const validLicense = createLicenseKey({
        org: 'PoseidonLabs',
        tier: 'enterprise',
        nbf: nowSeconds - 60,
        exp: nowSeconds + 7200,
        features: ['liveops', 'staging'],
    }, process.env.POSEIDON_LICENSE_SECRET);
    const revokedLicense = createLicenseKey({
        org: 'PoseidonLabs',
        tier: 'enterprise',
        nbf: nowSeconds - 60,
        exp: nowSeconds + 7200,
        features: ['liveops'],
    }, process.env.POSEIDON_LICENSE_SECRET);
    addRuntimeRevocation(hashLicenseKey(normalizeLicenseKey(revokedLicense)), 'strict_mode_staging_drill', 'drill-actor');
    const app = buildApp();
    const missingLicenseResponse = await (0, supertest_1.default)(app).get('/protected');
    const invalidFormatResponse = await (0, supertest_1.default)(app)
        .get('/protected')
        .set('x-poseidon-license', 'invalid-license-format');
    const revokedLicenseResponse = await (0, supertest_1.default)(app)
        .get('/protected')
        .set('x-poseidon-license', revokedLicense);
    const validLicenseResponse = await (0, supertest_1.default)(app)
        .get('/protected')
        .set('x-poseidon-license', validLicense);
    const requestCount = Math.max(1, Number.parseInt(args.enduranceRequests ?? String(policy.endurance.requestCount), 10));
    const endurance = await runEndurance({ app, validLicense, requestCount });
    const checks = [
        {
            name: 'strict-mode-enabled',
            status: process.env.POSEIDON_LICENSE_ENFORCEMENT === policy.enforcement.requiredMode ? 'pass' : 'fail',
            details: `mode=${process.env.POSEIDON_LICENSE_ENFORCEMENT}`,
        },
        {
            name: 'missing-license-blocked',
            status: missingLicenseResponse.status === 503 && missingLicenseResponse.body?.code === 'missing_license_key' ? 'pass' : 'fail',
            details: `status=${missingLicenseResponse.status}; code=${String(missingLicenseResponse.body?.code ?? 'n/a')}`,
        },
        {
            name: 'invalid-format-blocked',
            status: invalidFormatResponse.status === 503 && invalidFormatResponse.body?.code === 'invalid_license_format' ? 'pass' : 'fail',
            details: `status=${invalidFormatResponse.status}; code=${String(invalidFormatResponse.body?.code ?? 'n/a')}`,
        },
        {
            name: 'revoked-license-blocked',
            status: revokedLicenseResponse.status === 503 && revokedLicenseResponse.body?.code === 'license_revoked' ? 'pass' : 'fail',
            details: `status=${revokedLicenseResponse.status}; code=${String(revokedLicenseResponse.body?.code ?? 'n/a')}`,
        },
        {
            name: 'valid-license-allowed',
            status: validLicenseResponse.status === 200 ? 'pass' : 'fail',
            details: `status=${validLicenseResponse.status}`,
        },
        {
            name: 'strict-endurance-valid-traffic',
            status: endurance.successRate >= policy.endurance.minSuccessRate &&
                endurance.failureCount <= policy.endurance.maxFailureCount
                ? 'pass'
                : 'fail',
            details: `requests=${requestCount}; success=${endurance.successCount}; failures=${endurance.failureCount}; successRate=${endurance.successRate}`,
        },
    ];
    const status = checks.every((check) => check.status === 'pass') ? 'pass' : 'fail';
    const artifact = {
        schemaVersion: 1,
        pipeline: 'LIC-02',
        status,
        generatedAt: new Date().toISOString(),
        runId,
        policyPath,
        reportPath,
        workPath,
        enforcementMode: process.env.POSEIDON_LICENSE_ENFORCEMENT,
        policy,
        checks,
        smoke: {
            missingLicenseCode: missingLicenseResponse.body?.code ?? null,
            invalidFormatCode: invalidFormatResponse.body?.code ?? null,
            revokedLicenseCode: revokedLicenseResponse.body?.code ?? null,
            validLicenseStatus: validLicenseResponse.status,
        },
        endurance: {
            requestCount,
            successCount: endurance.successCount,
            failureCount: endurance.failureCount,
            successRate: endurance.successRate,
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
