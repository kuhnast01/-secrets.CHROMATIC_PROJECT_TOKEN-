import { ipcMain } from 'electron';
import net from 'net';
import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { pathToFileURL } from 'url';
const workspaceRoot = process.cwd();
const isWindows = process.platform === 'win32';
const managedProcesses = new Map();
const managedLogs = new Map();
const MAX_LOG_LINES = 500;
const serviceDefinitions = {
    backend: {
        name: 'backend',
        port: 4000,
        command: 'pnpm',
        args: ['--dir', 'backend', 'dev'],
        cwd: workspaceRoot,
    },
    'admin-panel': {
        name: 'admin-panel',
        port: 3000,
        command: 'pnpm',
        args: ['--filter', 'admin-panel', 'dev'],
        cwd: workspaceRoot,
    },
    web: {
        name: 'web',
        port: 5173,
        command: 'pnpm',
        args: ['--filter', 'web', 'dev'],
        cwd: workspaceRoot,
    },
};
const managedTestRunners = {
    jest: ['pnpm', 'test'],
    cypress: ['pnpm', 'run', 'e2e:cypress:endurance:quick'],
    detox: ['pnpm', 'run', 'e2e:detox:endurance:quick'],
};
const incidentRunbookDefinitions = {
    'backend-outage': {
        name: 'backend-outage',
        title: 'Backend Outage Recovery',
        description: 'Captures observability, restarts backend, verifies health, and records error snippets.',
        steps: [
            { id: 'capture-snapshot', title: 'Capture observability snapshot' },
            { id: 'restart-backend', title: 'Restart backend service' },
            { id: 'verify-health', title: 'Verify backend health and reachability' },
            { id: 'collect-errors', title: 'Collect latest error/warn snippets' },
        ],
    },
};
const incidentRuns = new Map();
function resolveCommand(command) {
    if (isWindows && command === 'pnpm') {
        return 'pnpm.cmd';
    }
    return command;
}
function appendManagedLog(service, chunk) {
    const current = managedLogs.get(service) ?? [];
    const lines = chunk.split(/\r?\n/).filter((line) => line.length > 0);
    const next = [...current, ...lines].slice(-MAX_LOG_LINES);
    managedLogs.set(service, next);
}
async function isPortOpen(port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(1000);
        socket.once('connect', () => {
            socket.destroy();
            resolve(true);
        });
        socket.once('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        socket.once('error', () => {
            resolve(false);
        });
        socket.connect(port, '127.0.0.1');
    });
}
async function waitForPortOpen(port, timeoutMs = 20000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        // eslint-disable-next-line no-await-in-loop
        const open = await isPortOpen(port);
        if (open) {
            return true;
        }
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 400));
    }
    return false;
}
function getManagedProcess(name) {
    const proc = managedProcesses.get(name);
    if (!proc) {
        return null;
    }
    if (proc.killed || proc.exitCode !== null) {
        managedProcesses.delete(name);
        return null;
    }
    return proc;
}
async function getServiceStatuses() {
    const entries = Object.values(serviceDefinitions);
    const statuses = await Promise.all(entries.map(async (service) => {
        const proc = getManagedProcess(service.name);
        const open = await isPortOpen(service.port);
        return {
            name: service.name,
            port: service.port,
            open,
            managed: Boolean(proc),
            pid: proc?.pid ?? null,
        };
    }));
    return statuses;
}
async function stopManagedService(name) {
    const proc = getManagedProcess(name);
    if (!proc) {
        return { status: 'ok', message: 'not-managed' };
    }
    try {
        if (isWindows && proc.pid) {
            await new Promise((resolve) => {
                exec(`taskkill /PID ${proc.pid} /T /F`, () => resolve());
            });
        }
        else {
            proc.kill('SIGTERM');
        }
        managedProcesses.delete(name);
        return { status: 'ok' };
    }
    catch (error) {
        return { status: 'error', message: error instanceof Error ? error.message : String(error) };
    }
}
async function startManagedService(name) {
    const definition = serviceDefinitions[name];
    if (!definition) {
        return { status: 'error', message: `Unknown service: ${name}` };
    }
    const existing = getManagedProcess(name);
    if (existing) {
        const statuses = await getServiceStatuses();
        const current = statuses.find((entry) => entry.name === name);
        return {
            status: 'ok',
            message: 'already-running',
            service: current,
        };
    }
    const command = resolveCommand(definition.command);
    const child = spawn(command, definition.args, {
        cwd: definition.cwd,
        env: process.env,
        shell: false,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    managedProcesses.set(name, child);
    managedLogs.set(name, []);
    child.stdout.on('data', (chunk) => {
        appendManagedLog(name, chunk.toString());
    });
    child.stderr.on('data', (chunk) => {
        appendManagedLog(name, chunk.toString());
    });
    child.once('exit', () => {
        managedProcesses.delete(name);
    });
    const open = await waitForPortOpen(definition.port);
    const statuses = await getServiceStatuses();
    const service = statuses.find((entry) => entry.name === name);
    if (!open) {
        return {
            status: 'error',
            message: `Service ${name} did not become healthy on port ${definition.port} in time`,
            service,
        };
    }
    return {
        status: 'ok',
        service,
    };
}
function parseServiceName(input) {
    if (input === 'backend' || input === 'admin-panel' || input === 'web') {
        return input;
    }
    return null;
}
function parseRunnerName(input) {
    if (input === 'jest' || input === 'cypress' || input === 'detox') {
        return input;
    }
    return null;
}
function createIncidentRun(name) {
    const definition = incidentRunbookDefinitions[name];
    const runId = `${name}-${Date.now()}`;
    const now = new Date().toISOString();
    const run = {
        runId,
        name,
        title: definition.title,
        status: 'running',
        createdAt: now,
        updatedAt: now,
        steps: definition.steps.map((step) => ({ id: step.id, title: step.title, status: 'pending' })),
        timeline: [`${now} | incident runbook started`],
    };
    incidentRuns.set(runId, run);
    return run;
}
function getIncidentRun(runId) {
    return incidentRuns.get(runId) ?? null;
}
async function executeIncidentStep(run, stepId) {
    const step = run.steps.find((entry) => entry.id === stepId);
    if (!step) {
        throw new Error(`Unknown incident step: ${stepId}`);
    }
    if (step.status === 'completed') {
        return step;
    }
    step.startedAt = new Date().toISOString();
    try {
        switch (step.id) {
            case 'capture-snapshot': {
                const snapshot = await ipcMain.emitWithResult('tools:observabilitySnapshot');
                const serviceCount = Array.isArray(snapshot?.services) ? snapshot.services.length : 0;
                const alertCount = Array.isArray(snapshot?.alerts) ? snapshot.alerts.length : 0;
                step.result = `snapshot captured (services=${serviceCount}, alerts=${alertCount})`;
                break;
            }
            case 'restart-backend': {
                await stopManagedService('backend');
                const restartResult = await startManagedService('backend');
                if (restartResult.status !== 'ok') {
                    throw new Error(restartResult.message || 'backend restart failed');
                }
                step.result = `backend restart completed (pid=${restartResult.service?.pid ?? 'n/a'})`;
                break;
            }
            case 'verify-health': {
                const health = await ipcMain.emitWithResult('tools:healthCheck');
                const backendStatus = await getServiceStatuses();
                const backend = backendStatus.find((entry) => entry.name === 'backend');
                const isHealthy = health?.status !== 'error' && Boolean(backend?.open);
                if (!isHealthy) {
                    throw new Error(`backend health verification failed (health=${health?.status ?? 'unknown'}, open=${backend?.open ?? false})`);
                }
                step.result = `backend health verified (health=${health.status}, open=${backend?.open})`;
                break;
            }
            case 'collect-errors': {
                const snapshot = await ipcMain.emitWithResult('tools:observabilitySnapshot');
                const snippets = Array.isArray(snapshot?.errorSnippets) ? snapshot.errorSnippets.slice(-5) : [];
                step.result = snippets.length > 0 ? snippets.join(' | ') : 'no recent error/warn snippets';
                break;
            }
            default:
                throw new Error(`Unsupported step action: ${step.id}`);
        }
        step.status = 'completed';
        step.completedAt = new Date().toISOString();
        run.timeline.push(`${step.completedAt} | step completed: ${step.title} | ${step.result || ''}`);
    }
    catch (error) {
        step.status = 'failed';
        step.completedAt = new Date().toISOString();
        step.error = error instanceof Error ? error.message : String(error);
        run.status = 'failed';
        run.timeline.push(`${step.completedAt} | step failed: ${step.title} | ${step.error}`);
    }
    run.updatedAt = new Date().toISOString();
    if (run.status !== 'failed' && run.steps.every((entry) => entry.status === 'completed')) {
        run.status = 'completed';
        run.timeline.push(`${run.updatedAt} | incident runbook completed`);
    }
    return step;
}
// 1. Run safe shell commands
ipcMain.handle('tools:runCommand', async (_event, command) => {
    const trimmed = command.trim();
    const allowedPrefixes = ['pnpm ', 'npx ', 'node ', 'npm ', 'yarn ', 'echo '];
    const hasBlockedChars = /[;&|><`$]/.test(trimmed);
    if (!allowedPrefixes.some((prefix) => trimmed.startsWith(prefix)) || hasBlockedChars) {
        return { status: 'error', error: 'Command not allowed (must use approved prefix and no shell control characters)' };
    }
    return await new Promise((resolve) => {
        exec(trimmed, { timeout: 15000 }, (err, stdout, stderr) => {
            if (err)
                return resolve({ status: 'error', error: stderr || err.message });
            resolve({ status: 'ok', output: stdout });
        });
    });
});
// 2. List running services (backend, admin, web)
ipcMain.handle('tools:listServices', async () => {
    return await getServiceStatuses();
});
ipcMain.handle('tools:serviceCatalog', async () => {
    return Object.values(serviceDefinitions).map((service) => ({
        name: service.name,
        port: service.port,
        command: [service.command, ...service.args].join(' '),
        cwd: service.cwd,
    }));
});
ipcMain.handle('tools:serviceStatus', async (_event, serviceName) => {
    if (!serviceName) {
        return { status: 'ok', services: await getServiceStatuses() };
    }
    const parsed = parseServiceName(serviceName);
    if (!parsed) {
        return { status: 'error', error: `Unknown service: ${serviceName}` };
    }
    const statuses = await getServiceStatuses();
    return {
        status: 'ok',
        service: statuses.find((entry) => entry.name === parsed) ?? null,
    };
});
ipcMain.handle('tools:serviceStart', async (_event, serviceName) => {
    const parsed = parseServiceName(serviceName);
    if (!parsed) {
        return { status: 'error', error: `Unknown service: ${serviceName}` };
    }
    const result = await startManagedService(parsed);
    if (result.status !== 'ok') {
        return { status: 'error', error: result.message, service: result.service ?? null };
    }
    return { status: 'ok', message: result.message ?? 'started', service: result.service ?? null };
});
ipcMain.handle('tools:serviceStop', async (_event, serviceName) => {
    const parsed = parseServiceName(serviceName);
    if (!parsed) {
        return { status: 'error', error: `Unknown service: ${serviceName}` };
    }
    const result = await stopManagedService(parsed);
    if (result.status !== 'ok') {
        return { status: 'error', error: result.message ?? 'Unable to stop service' };
    }
    return { status: 'ok', message: result.message ?? 'stopped' };
});
ipcMain.handle('tools:serviceRestart', async (_event, serviceName) => {
    const parsed = parseServiceName(serviceName);
    if (!parsed) {
        return { status: 'error', error: `Unknown service: ${serviceName}` };
    }
    await stopManagedService(parsed);
    const result = await startManagedService(parsed);
    if (result.status !== 'ok') {
        return { status: 'error', error: result.message, service: result.service ?? null };
    }
    return { status: 'ok', service: result.service ?? null };
});
ipcMain.handle('tools:serviceLogs', async (_event, serviceName, lines = 80) => {
    const parsed = parseServiceName(serviceName);
    if (!parsed) {
        return { status: 'error', error: `Unknown service: ${serviceName}` };
    }
    const buffer = managedLogs.get(parsed) ?? [];
    return { status: 'ok', logs: buffer.slice(-Math.max(1, lines)) };
});
// 3. Read and parse .env
ipcMain.handle('tools:readEnv', async (_event, filePath = '.env') => {
    try {
        const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
        const content = fs.readFileSync(abs, 'utf8');
        const env = Object.fromEntries(content.split(/\r?\n/).filter(Boolean).map((line) => {
            const [k, ...v] = line.split('=');
            return [k, v.join('=')];
        }));
        return { status: 'ok', env };
    }
    catch (error) {
        return { status: 'error', error: error instanceof Error ? error.message : String(error) };
    }
});
// 4. Search logs for errors/warnings
ipcMain.handle('tools:searchLogs', async (_event, filePath, pattern = 'error|fail|warn') => {
    try {
        const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
        const content = fs.readFileSync(abs, 'utf8');
        const regex = new RegExp(pattern, 'ig');
        const matches = content.split(/\r?\n/).filter((line) => regex.test(line));
        return { status: 'ok', matches };
    }
    catch (error) {
        return { status: 'error', error: error instanceof Error ? error.message : String(error) };
    }
});
// 5. Get git status
ipcMain.handle('tools:getGitStatus', async () => {
    return await new Promise((resolve) => {
        exec('git status --porcelain -b', { timeout: 10000 }, (err, stdout, stderr) => {
            if (err)
                return resolve({ status: 'error', error: stderr || err.message });
            resolve({ status: 'ok', output: stdout });
        });
    });
});
// 6. Plugin system (load user scripts from plugins/)
ipcMain.handle('tools:runPlugin', async (_event, pluginName, ...args) => {
    try {
        const pluginPath = path.join(process.cwd(), 'plugins', pluginName + '.js');
        if (!fs.existsSync(pluginPath))
            throw new Error('Plugin not found');
        const pluginModule = await import(pathToFileURL(pluginPath).toString());
        const plugin = pluginModule.default;
        if (typeof plugin !== 'function')
            throw new Error('Plugin must export default function');
        const result = await plugin(...args);
        return { status: 'ok', result };
    }
    catch (error) {
        return { status: 'error', error: error instanceof Error ? error.message : String(error) };
    }
});
// 7. Observability/telemetry (track metrics, alerting)
// (Stub: extend with real metrics/alerting as needed)
ipcMain.handle('tools:trackMetric', async (_event, metric, value) => {
    // For now, just log
    console.log(`[METRIC] ${metric}:`, value);
    return { status: 'ok' };
});
// 8. Test runner integration (Jest, Cypress)
ipcMain.handle('tools:runTests', async (_event, runner = 'jest') => {
    const parsed = parseRunnerName(runner);
    if (!parsed) {
        return { status: 'error', error: `Unsupported runner: ${runner}. Allowed: jest, cypress, detox` };
    }
    const [command, ...args] = managedTestRunners[parsed];
    const resolvedCommand = resolveCommand(command);
    const shellCommand = [resolvedCommand, ...args].join(' ');
    return await new Promise((resolve) => {
        exec(shellCommand, { cwd: workspaceRoot, timeout: 180000 }, (err, stdout, stderr) => {
            if (err)
                return resolve({ status: 'error', error: stderr || err.message, runner: parsed });
            resolve({ status: 'ok', output: stdout });
        });
    });
});
ipcMain.handle('tools:commandCenterStatus', async () => {
    const services = await getServiceStatuses();
    return {
        status: 'ok',
        services,
        supportedTests: Object.keys(managedTestRunners),
    };
});
ipcMain.handle('tools:observabilitySnapshot', async () => {
    const services = await getServiceStatuses();
    const health = await ipcMain.emitWithResult('tools:healthCheck');
    const alerts = [];
    for (const service of services) {
        if (!service.open) {
            alerts.push({
                severity: service.name === 'backend' ? 'high' : 'medium',
                message: `${service.name} is not reachable on port ${service.port}`,
            });
        }
    }
    if (health?.status === 'error') {
        alerts.push({
            severity: 'high',
            message: `Backend health check failed: ${health.error || 'unknown error'}`,
        });
    }
    const recentLogs = ['backend', 'admin-panel', 'web'].map((name) => {
        const lines = (managedLogs.get(name) ?? []).slice(-20);
        return { name, lines };
    });
    const errorSnippets = recentLogs.flatMap((entry) => {
        const matches = entry.lines.filter((line) => /error|fail|warn/i.test(line));
        return matches.map((line) => `[${entry.name}] ${line}`);
    }).slice(-20);
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        health,
        services,
        alerts,
        recentLogs,
        errorSnippets,
    };
});
ipcMain.handle('tools:incidentRunbookCatalog', async () => {
    return {
        status: 'ok',
        runbooks: Object.values(incidentRunbookDefinitions),
    };
});
ipcMain.handle('tools:incidentRunbookStart', async (_event, name) => {
    if (!incidentRunbookDefinitions[name]) {
        return { status: 'error', error: `Unknown runbook: ${name}` };
    }
    const run = createIncidentRun(name);
    return { status: 'ok', run };
});
ipcMain.handle('tools:incidentRunbookStatus', async (_event, runId) => {
    const run = getIncidentRun(runId);
    if (!run) {
        return { status: 'error', error: `Unknown run ID: ${runId}` };
    }
    return { status: 'ok', run };
});
ipcMain.handle('tools:incidentRunbookListRuns', async () => {
    return {
        status: 'ok',
        runs: Array.from(incidentRuns.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20),
    };
});
ipcMain.handle('tools:incidentRunbookExecuteStep', async (_event, runId, stepId) => {
    const run = getIncidentRun(runId);
    if (!run) {
        return { status: 'error', error: `Unknown run ID: ${runId}` };
    }
    const step = await executeIncidentStep(run, stepId);
    if (step.status === 'failed') {
        return { status: 'error', error: step.error || 'step failed', run };
    }
    return { status: 'ok', run };
});
ipcMain.handle('tools:incidentRunbookExecuteNext', async (_event, runId) => {
    const run = getIncidentRun(runId);
    if (!run) {
        return { status: 'error', error: `Unknown run ID: ${runId}` };
    }
    const nextStep = run.steps.find((entry) => entry.status === 'pending');
    if (!nextStep) {
        return { status: 'ok', message: 'no pending steps', run };
    }
    const step = await executeIncidentStep(run, nextStep.id);
    if (step.status === 'failed') {
        return { status: 'error', error: step.error || 'step failed', run };
    }
    return { status: 'ok', run };
});
