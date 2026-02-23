"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const REPO_ROOT = node_path_1.default.resolve(__dirname, '..', '..');
const RELEASE_DIR = node_path_1.default.resolve(REPO_ROOT, 'tmp/liveops-release');
const ACTIVE_RELEASE_PATH = node_path_1.default.resolve(RELEASE_DIR, 'active-release.json');
const ARTIFACT_DIR = node_path_1.default.resolve(REPO_ROOT, 'tmp/liveops-artifacts');
function utcTimestampCompact(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}
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
function ensureDirectory(dirPath) {
    node_fs_1.default.mkdirSync(dirPath, { recursive: true });
}
function readJsonFile(filePath) {
    const raw = node_fs_1.default.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
}
function writeJsonFile(filePath, payload) {
    ensureDirectory(node_path_1.default.dirname(filePath));
    node_fs_1.default.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
}
function getOrCreatePreviousRelease(now) {
    if (node_fs_1.default.existsSync(ACTIVE_RELEASE_PATH)) {
        return readJsonFile(ACTIVE_RELEASE_PATH);
    }
    const seedRelease = {
        releaseId: `baseline-${utcTimestampCompact(now)}`,
        promotedAt: now.toISOString(),
        source: 'seeded-by-auto-03-drill',
    };
    writeJsonFile(ACTIVE_RELEASE_PATH, seedRelease);
    return seedRelease;
}
function runCommand(command) {
    return new Promise((resolve) => {
        const startedAtMs = Date.now();
        const child = (0, node_child_process_1.spawn)(command, {
            cwd: REPO_ROOT,
            shell: true,
            stdio: 'inherit',
            env: process.env,
        });
        child.on('error', () => {
            resolve({ exitCode: 1, durationMs: Date.now() - startedAtMs });
        });
        child.on('exit', (code) => {
            resolve({
                exitCode: code === null ? 1 : code,
                durationMs: Date.now() - startedAtMs,
            });
        });
    });
}
async function runPreflightChecks() {
    const steps = [];
    const requiredFiles = ['Dockerfile', 'docker-compose.yml', 'src/index.ts'];
    const missing = requiredFiles.filter((relativePath) => !node_fs_1.default.existsSync(node_path_1.default.resolve(REPO_ROOT, relativePath)));
    if (missing.length > 0) {
        steps.push({
            name: 'preflight:required-files',
            status: 'fail',
            durationMs: 0,
            details: `Missing required files: ${missing.join(', ')}`,
        });
        return steps;
    }
    steps.push({
        name: 'preflight:required-files',
        status: 'pass',
        durationMs: 0,
        details: 'Required deployment files are present',
    });
    const checks = ['pnpm run type-check', 'pnpm run build'];
    for (const command of checks) {
        const { exitCode, durationMs } = await runCommand(command);
        steps.push({
            name: `preflight:${command}`,
            status: exitCode === 0 ? 'pass' : 'fail',
            durationMs,
            details: exitCode === 0 ? 'Command succeeded' : `Command failed with exit code ${exitCode}`,
        });
        if (exitCode !== 0) {
            break;
        }
    }
    return steps;
}
function deployRelease(previousRelease, now) {
    const deployedRelease = {
        releaseId: `deploy-${utcTimestampCompact(now)}`,
        promotedAt: now.toISOString(),
        source: `AUTO-03 from ${previousRelease.releaseId}`,
    };
    const startedAt = Date.now();
    writeJsonFile(ACTIVE_RELEASE_PATH, deployedRelease);
    const durationMs = Date.now() - startedAt;
    const active = readJsonFile(ACTIVE_RELEASE_PATH);
    if (active.releaseId !== deployedRelease.releaseId) {
        return {
            deployedRelease,
            step: {
                name: 'deploy:promote-release',
                status: 'fail',
                durationMs,
                details: 'Active release verification failed after deploy',
            },
        };
    }
    return {
        deployedRelease,
        step: {
            name: 'deploy:promote-release',
            status: 'pass',
            durationMs,
            details: `Promoted release ${deployedRelease.releaseId}`,
        },
    };
}
function rollbackRelease(previousRelease) {
    const startedAt = Date.now();
    writeJsonFile(ACTIVE_RELEASE_PATH, previousRelease);
    const durationMs = Date.now() - startedAt;
    const active = readJsonFile(ACTIVE_RELEASE_PATH);
    if (active.releaseId !== previousRelease.releaseId) {
        return {
            finalRelease: active,
            step: {
                name: 'rollback:restore-previous-release',
                status: 'fail',
                durationMs,
                details: `Expected ${previousRelease.releaseId} but found ${active.releaseId}`,
            },
        };
    }
    return {
        finalRelease: active,
        step: {
            name: 'rollback:restore-previous-release',
            status: 'pass',
            durationMs,
            details: `Restored ${previousRelease.releaseId}`,
        },
    };
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const now = new Date();
    const timestamp = utcTimestampCompact(now);
    const reportPath = node_path_1.default.resolve(args.reportDir ?? ARTIFACT_DIR, `auto-03-deploy-rollback-drill-${timestamp}.json`);
    ensureDirectory(RELEASE_DIR);
    ensureDirectory(node_path_1.default.dirname(reportPath));
    const previousRelease = getOrCreatePreviousRelease(now);
    const steps = [];
    const preflightSteps = await runPreflightChecks();
    steps.push(...preflightSteps);
    const preflightFailed = preflightSteps.some((step) => step.status === 'fail');
    let deployedRelease = previousRelease;
    let finalRelease = previousRelease;
    if (!preflightFailed) {
        const deployResult = deployRelease(previousRelease, new Date());
        deployedRelease = deployResult.deployedRelease;
        steps.push(deployResult.step);
        if (deployResult.step.status === 'pass') {
            const rollbackResult = rollbackRelease(previousRelease);
            finalRelease = rollbackResult.finalRelease;
            steps.push(rollbackResult.step);
        }
    }
    const status = steps.every((step) => step.status === 'pass') ? 'pass' : 'fail';
    const artifact = {
        schemaVersion: 1,
        pipeline: 'AUTO-03',
        status,
        generatedAt: new Date().toISOString(),
        reportPath,
        releaseStatePath: ACTIVE_RELEASE_PATH,
        previousRelease,
        deployedRelease,
        finalRelease,
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
