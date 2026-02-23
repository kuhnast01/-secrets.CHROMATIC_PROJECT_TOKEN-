"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_http_1 = __importDefault(require("node:http"));
const node_https_1 = __importDefault(require("node:https"));
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../src/index"));
const validate_1 = require("../../src/utils/validate");
const ALLOWED_LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
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
function parseHost(candidate) {
    if (typeof candidate === 'string') {
        try {
            const url = new URL(candidate);
            return url.hostname;
        }
        catch {
            return 'localhost';
        }
    }
    if (candidate && typeof candidate === 'object') {
        const options = candidate;
        const host = options.hostname || options.host || 'localhost';
        return host.split(':')[0] || 'localhost';
    }
    return 'localhost';
}
function isExternalHost(host) {
    return !ALLOWED_LOCAL_HOSTS.has(host.toLowerCase());
}
function installOfflineNetworkGuard(moduleRef) {
    const originalRequest = moduleRef.request;
    const originalGet = moduleRef.get;
    moduleRef.request = (...args) => {
        const host = parseHost(args[0]);
        if (isExternalHost(host)) {
            throw new Error(`OFFLINE_EXTERNAL_BLOCKED:${host}`);
        }
        return originalRequest.apply(moduleRef, args);
    };
    moduleRef.get = (...args) => {
        const host = parseHost(args[0]);
        if (isExternalHost(host)) {
            throw new Error(`OFFLINE_EXTERNAL_BLOCKED:${host}`);
        }
        return originalGet.apply(moduleRef, args);
    };
    return () => {
        moduleRef.request = originalRequest;
        moduleRef.get = originalGet;
    };
}
function writeJsonFile(filePath, payload) {
    node_fs_1.default.mkdirSync(node_path_1.default.dirname(filePath), { recursive: true });
    node_fs_1.default.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
}
async function runStep(name, steps, fn) {
    const started = Date.now();
    try {
        const details = await fn();
        steps.push({ name, status: 'pass', durationMs: Date.now() - started, details });
    }
    catch (error) {
        const details = error instanceof Error ? error.message : 'unknown_error';
        steps.push({ name, status: 'fail', durationMs: Date.now() - started, details });
        throw error;
    }
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const now = new Date();
    const timestamp = utcTimestampCompact(now);
    const reportDir = node_path_1.default.resolve(args.reportDir ?? 'tmp/liveops-artifacts');
    const stagingDir = node_path_1.default.resolve(args.stageDir ?? 'tmp/liveops-staging/offline');
    const reportPath = node_path_1.default.resolve(reportDir, `local-01-offline-core-workflows-${timestamp}.json`);
    process.env.POSEIDON_OFFLINE_MODE = 'strict';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'offline-local-01-secret';
    const steps = [];
    const restoreHttp = installOfflineNetworkGuard(node_http_1.default);
    const restoreHttps = installOfflineNetworkGuard(node_https_1.default);
    let stagedEventPath;
    try {
        await runStep('offline-guard:external-network-blocked', steps, async () => {
            try {
                node_https_1.default.get('https://example.com');
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'unknown_error';
                if (message.startsWith('OFFLINE_EXTERNAL_BLOCKED:')) {
                    return 'Outbound external request was blocked as expected';
                }
                throw error;
            }
            throw new Error('External request unexpectedly bypassed offline guard');
        });
        await runStep('core-workflow:healthz', steps, async () => {
            const response = await (0, supertest_1.default)(index_1.default).get('/healthz').expect(200);
            if (response.body?.status !== 'ok') {
                throw new Error('Unexpected /healthz response');
            }
            return 'GET /healthz returned ok';
        });
        await runStep('core-workflow:system-health', steps, async () => {
            const response = await (0, supertest_1.default)(index_1.default).get('/system-health').expect(200);
            if (response.body?.status !== 'ok') {
                throw new Error('Unexpected /system-health response');
            }
            return 'GET /system-health returned ok';
        });
        await runStep('core-workflow:auth-login', steps, async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/auth/login')
                .send({ username: 'admin', password: 'admin123' })
                .expect(200);
            const token = response.body?.token;
            if (!token || typeof token !== 'string') {
                throw new Error('Login token missing');
            }
            return 'POST /auth/login succeeded with token issuance';
        });
        await runStep('core-workflow:event-author-validate-stage', steps, async () => {
            const draft = {
                name: `LOCAL-01 Event ${now.toISOString().slice(0, 10)}`,
                config: {
                    trigger: { type: 'manual' },
                    segments: ['all_players'],
                    metadata: {
                        source: 'LOCAL-01-offline-drill',
                        generatedAt: new Date().toISOString(),
                    },
                },
                created_by: 1,
            };
            const parsed = validate_1.eventSchema.safeParse(draft);
            if (!parsed.success) {
                throw new Error(`Event schema validation failed with ${parsed.error.issues.length} issue(s)`);
            }
            stagedEventPath = node_path_1.default.resolve(stagingDir, `local-01-event-${timestamp}.json`);
            writeJsonFile(stagedEventPath, {
                schemaVersion: 1,
                pipeline: 'LOCAL-01',
                stagedAt: new Date().toISOString(),
                event: parsed.data,
            });
            return `Event draft validated and staged to ${stagedEventPath}`;
        });
    }
    finally {
        restoreHttp();
        restoreHttps();
    }
    const status = steps.every((step) => step.status === 'pass') ? 'pass' : 'fail';
    const artifact = {
        schemaVersion: 1,
        pipeline: 'LOCAL-01',
        status,
        generatedAt: new Date().toISOString(),
        reportPath,
        stagedEventPath,
        steps,
    };
    writeJsonFile(reportPath, artifact);
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
