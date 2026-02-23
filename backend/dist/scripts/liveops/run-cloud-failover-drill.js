import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import request from 'supertest';
import app from '../../src/index';
import { eventSchema } from '../../src/utils/validate';
const CLOUD_HOST_MARKERS = ['sentry.io', 'locize.com', 'datadog.com', 'newrelic.com'];
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
            return new URL(candidate).hostname;
        }
        catch {
            return candidate.split('/')[0] || '';
        }
    }
    if (candidate && typeof candidate === 'object') {
        const options = candidate;
        const host = options.hostname || options.host || '';
        return host.split(':')[0] || '';
    }
    return '';
}
function isCloudHost(host) {
    const normalized = host.toLowerCase();
    return CLOUD_HOST_MARKERS.some((marker) => normalized.includes(marker));
}
function installCloudOutageGuard(moduleRef) {
    const originalRequest = moduleRef.request;
    const originalGet = moduleRef.get;
    moduleRef.request = (...args) => {
        const host = parseHost(args[0]);
        if (isCloudHost(host)) {
            throw new Error(`CLOUD_DEPENDENCY_UNAVAILABLE:${host}`);
        }
        return originalRequest.apply(moduleRef, args);
    };
    moduleRef.get = (...args) => {
        const host = parseHost(args[0]);
        if (isCloudHost(host)) {
            throw new Error(`CLOUD_DEPENDENCY_UNAVAILABLE:${host}`);
        }
        return originalGet.apply(moduleRef, args);
    };
    return () => {
        moduleRef.request = originalRequest;
        moduleRef.get = originalGet;
    };
}
function writeJsonFile(filePath, payload) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
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
    const reportPath = path.resolve(args.reportDir ?? 'tmp/liveops-artifacts', `local-02-cloud-failover-${timestamp}.json`);
    const stagePath = path.resolve(args.stageDir ?? 'tmp/liveops-staging/failover', `local-02-event-${timestamp}.json`);
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'local-02-cloud-failover-secret';
    const steps = [];
    const restoreHttp = installCloudOutageGuard(http);
    const restoreHttps = installCloudOutageGuard(https);
    try {
        await runStep('cloud-failover:simulate-cloud-outage', steps, async () => {
            try {
                https.get('https://sentry.io');
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'unknown_error';
                if (message.startsWith('CLOUD_DEPENDENCY_UNAVAILABLE:')) {
                    return 'Cloud outage simulation active for optional integrations';
                }
                throw error;
            }
            throw new Error('Cloud outage guard did not block expected host');
        });
        await runStep('core-path:healthz', steps, async () => {
            const response = await request(app).get('/healthz').expect(200);
            if (response.body?.status !== 'ok') {
                throw new Error('Unexpected /healthz response body');
            }
            return 'Health endpoint remained operational during cloud outage';
        });
        await runStep('core-path:system-health', steps, async () => {
            const response = await request(app).get('/system-health').expect(200);
            if (response.body?.status !== 'ok') {
                throw new Error('Unexpected /system-health response body');
            }
            return 'System health endpoint remained operational';
        });
        await runStep('core-path:auth-login', steps, async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ username: 'admin', password: 'admin123' })
                .expect(200);
            if (!response.body?.token || typeof response.body.token !== 'string') {
                throw new Error('Token was not issued during cloud outage drill');
            }
            return 'Authentication flow remained operational';
        });
        await runStep('core-path:event-validate-stage', steps, async () => {
            const draft = {
                name: `LOCAL-02 Event ${now.toISOString().slice(0, 10)}`,
                config: {
                    trigger: { type: 'manual' },
                    metadata: {
                        source: 'LOCAL-02-cloud-failover-drill',
                        generatedAt: new Date().toISOString(),
                    },
                },
                created_by: 1,
            };
            const parse = eventSchema.safeParse(draft);
            if (!parse.success) {
                throw new Error(`Event schema parse failed with ${parse.error.issues.length} issue(s)`);
            }
            writeJsonFile(stagePath, {
                schemaVersion: 1,
                pipeline: 'LOCAL-02',
                stagedAt: new Date().toISOString(),
                event: parse.data,
            });
            return `Event author/validate/stage succeeded at ${stagePath}`;
        });
    }
    finally {
        restoreHttp();
        restoreHttps();
    }
    const status = steps.every((step) => step.status === 'pass') ? 'pass' : 'fail';
    const artifact = {
        schemaVersion: 1,
        pipeline: 'LOCAL-02',
        status,
        generatedAt: new Date().toISOString(),
        reportPath,
        stagedEventPath: stagePath,
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
