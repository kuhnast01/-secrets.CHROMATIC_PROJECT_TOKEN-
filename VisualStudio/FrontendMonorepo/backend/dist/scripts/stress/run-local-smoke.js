import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { request } from 'node:http';
const profileArg = (process.argv[2] || 'smoke');
const durationArg = process.argv[3];
const allowedProfiles = ['smoke', 'spike', 'soak'];
const backendBaseUrl = process.env.BACKEND_BASE_URL || 'http://127.0.0.1:4000';
const healthPath = '/healthz';
const startupTimeoutMs = Number(process.env.STRESS_STARTUP_TIMEOUT_MS || 90000);
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function commandForPnpm() {
    return { command: 'pnpm', args: [] };
}
function checkHealth(url) {
    return new Promise((resolve) => {
        const req = request(`${url}${healthPath}`, { method: 'GET', timeout: 4000 }, (res) => {
            resolve((res.statusCode || 500) >= 200 && (res.statusCode || 500) < 300);
            res.resume();
        });
        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
        req.on('error', () => resolve(false));
        req.end();
    });
}
async function waitForHealth(url, timeoutMs) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
        const ok = await checkHealth(url);
        if (ok) {
            return;
        }
        await sleep(1000);
    }
    throw new Error(`Backend did not become healthy at ${url}${healthPath} within ${timeoutMs}ms`);
}
function terminateProcessTree(childPid) {
    return new Promise((resolve) => {
        if (process.platform === 'win32') {
            const killer = spawn('taskkill', ['/PID', String(childPid), '/T', '/F'], {
                stdio: 'ignore'
            });
            killer.on('exit', () => resolve());
            killer.on('error', () => resolve());
            return;
        }
        try {
            process.kill(childPid, 'SIGTERM');
        }
        catch {
            // ignore
        }
        resolve();
    });
}
async function main() {
    if (!allowedProfiles.includes(profileArg)) {
        throw new Error(`Unknown profile: ${profileArg}. Use one of ${allowedProfiles.join(', ')}`);
    }
    const stressArtifactsDir = 'stress-artifacts';
    mkdirSync(stressArtifactsDir, { recursive: true });
    const { command, args } = commandForPnpm();
    const backendProcess = spawn(`${command} ${[...args, 'run', 'dev'].join(' ')}`, {
        stdio: 'inherit',
        shell: true,
        env: process.env
    });
    if (!backendProcess.pid) {
        throw new Error('Failed to start backend process for local stress run');
    }
    let backendExitedEarly = false;
    backendProcess.on('exit', (code) => {
        if (code !== null && code !== 0) {
            backendExitedEarly = true;
        }
    });
    try {
        console.log(`Waiting for backend health at ${backendBaseUrl}${healthPath}...`);
        await waitForHealth(backendBaseUrl, startupTimeoutMs);
        if (backendExitedEarly) {
            throw new Error('Backend exited before stress run started');
        }
        const stressEnv = {
            ...process.env,
            BACKEND_BASE_URL: backendBaseUrl,
            STRESS_REPORT_PATH: process.env.STRESS_REPORT_PATH || `${stressArtifactsDir}/local-${profileArg}-report.json`
        };
        await new Promise((resolve, reject) => {
            const durationOverride = durationArg && Number.isFinite(Number(durationArg)) && Number(durationArg) > 0
                ? [`--duration=${Number(durationArg)}`]
                : [];
            const stress = spawn(`${command} ${[
                ...args,
                'exec',
                'tsx',
                'scripts/stress/run-autocannon.ts',
                profileArg,
                ...durationOverride
            ].join(' ')}`, {
                stdio: 'inherit',
                shell: true,
                env: stressEnv
            });
            stress.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`stress:${profileArg} failed with exit code ${code}`));
                }
            });
            stress.on('error', (error) => reject(error));
        });
    }
    finally {
        await terminateProcessTree(backendProcess.pid);
    }
}
main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
