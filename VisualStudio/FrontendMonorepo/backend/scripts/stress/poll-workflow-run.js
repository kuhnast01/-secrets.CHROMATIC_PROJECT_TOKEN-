"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const CURRENT_SCHEMA_VERSION = 1;
class PollError extends Error {
    constructor(message, exitCode, errorType) {
        super(message);
        this.exitCode = exitCode;
        this.errorType = errorType;
    }
}
function usageError(message) {
    return new PollError(message, 2, 'usage');
}
function authError(message) {
    return new PollError(message, 3, 'auth');
}
function apiError(message) {
    return new PollError(message, 4, 'api');
}
function workflowError(message) {
    return new PollError(message, 5, 'workflow');
}
function timeoutError(message) {
    return new PollError(message, 6, 'timeout');
}
function emitJson(result) {
    console.log(JSON.stringify(result, null, 2));
}
function parseInputs(value) {
    try {
        const parsed = JSON.parse(value);
        return Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, String(v)]));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw usageError(`Invalid JSON for --inputs: ${message}`);
    }
}
function parseOptions(argv) {
    if (argv.includes('--help') || argv.includes('-h')) {
        return {
            help: true,
            workflow: '',
            ref: 'main',
            dispatch: false,
            inputs: {},
            intervalSeconds: 15,
            timeoutSeconds: 1800,
            json: false,
            outputPath: undefined,
            summaryOut: 'stress-artifacts/workflow-run-summary.md',
            summaryFormat: 'md',
        };
    }
    const args = [...argv];
    const workflow = args.shift();
    if (!workflow || workflow.startsWith('--')) {
        throw usageError('Missing workflow file/id argument (example: backend-weekly-reliability.yml).');
    }
    let ref = 'main';
    let repo;
    let dispatch = false;
    let inputs = {};
    let intervalSeconds = 15;
    let timeoutSeconds = 1800;
    let json = false;
    let outputPath;
    let summaryOut = 'stress-artifacts/workflow-run-summary.md';
    let summaryFormat = 'md';
    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (arg === '--ref') {
            const value = args[index + 1];
            if (!value || value.startsWith('--'))
                throw usageError('Missing value for --ref.');
            ref = value;
            index += 1;
            continue;
        }
        if (arg === '--repo') {
            const value = args[index + 1];
            if (!value || value.startsWith('--'))
                throw usageError('Missing value for --repo (owner/repo).');
            repo = value;
            index += 1;
            continue;
        }
        if (arg === '--dispatch') {
            dispatch = true;
            continue;
        }
        if (arg === '--inputs') {
            const value = args[index + 1];
            if (!value || value.startsWith('--'))
                throw usageError('Missing JSON value for --inputs.');
            inputs = parseInputs(value);
            index += 1;
            continue;
        }
        if (arg === '--interval') {
            const value = Number(args[index + 1]);
            if (!Number.isFinite(value) || value <= 0)
                throw usageError('Invalid value for --interval.');
            intervalSeconds = value;
            index += 1;
            continue;
        }
        if (arg === '--timeout') {
            const value = Number(args[index + 1]);
            if (!Number.isFinite(value) || value <= 0)
                throw usageError('Invalid value for --timeout.');
            timeoutSeconds = value;
            index += 1;
            continue;
        }
        if (arg === '--json') {
            json = true;
            continue;
        }
        if (arg === '--output') {
            const value = args[index + 1];
            if (!value || value.startsWith('--'))
                throw usageError('Missing value for --output.');
            outputPath = value;
            index += 1;
            continue;
        }
        if (arg === '--summary-out') {
            const value = args[index + 1];
            if (!value || value.startsWith('--'))
                throw usageError('Missing value for --summary-out.');
            summaryOut = value;
            index += 1;
            continue;
        }
        if (arg === '--summary-format') {
            const value = args[index + 1];
            if (!value || value.startsWith('--'))
                throw usageError('Missing value for --summary-format.');
            if (value !== 'md' && value !== 'json' && value !== 'both' && value !== 'none') {
                throw usageError('Invalid value for --summary-format. Use one of: md, json, both, none.');
            }
            summaryFormat = value;
            index += 1;
            continue;
        }
        throw usageError(`Unknown option: ${arg}`);
    }
    return {
        help: false,
        workflow,
        ref,
        repo,
        dispatch,
        inputs,
        intervalSeconds,
        timeoutSeconds,
        json,
        outputPath,
        summaryOut,
        summaryFormat,
    };
}
function printUsage() {
    console.log('Usage: pnpm exec tsx scripts/stress/poll-workflow-run.ts <workflow> [--dispatch] [--ref <branch>] [--repo <owner/repo>] [--inputs <json>] [--interval <sec>] [--timeout <sec>] [--output <path>] [--summary-out <path>] [--summary-format <md|json|both|none>] [--json]');
    console.log('');
    console.log('Examples:');
    console.log('  pnpm exec tsx scripts/stress/poll-workflow-run.ts backend-label-bootstrap.yml --dispatch --ref main --inputs "{\"mode\":\"dry-run\"}"');
    console.log('  pnpm exec tsx scripts/stress/poll-workflow-run.ts backend-weekly-reliability.yml --dispatch --ref main --inputs "{\"failOnWarn\":\"true\"}"');
    console.log('');
    console.log('Exit codes: 0 success, 2 usage, 3 auth, 4 api, 5 workflow failed, 6 timeout, 1 unknown');
}
function getSummaryPathFromArgv(argv) {
    const index = argv.indexOf('--summary-out');
    if (index >= 0) {
        const value = argv[index + 1];
        if (value && !value.startsWith('--')) {
            return value;
        }
    }
    return 'stress-artifacts/workflow-run-summary.md';
}
function getSummaryFormatFromArgv(argv) {
    const index = argv.indexOf('--summary-format');
    if (index >= 0) {
        const value = argv[index + 1];
        if (value === 'md' || value === 'json' || value === 'both' || value === 'none') {
            return value;
        }
    }
    return 'md';
}
function deriveJsonSummaryPath(path) {
    if (path.toLowerCase().endsWith('.md')) {
        return `${path.slice(0, -3)}.json`;
    }
    return `${path}.json`;
}
function writePrimaryOutput(path, payload) {
    (0, node_fs_1.mkdirSync)((0, node_path_1.dirname)(path), { recursive: true });
    (0, node_fs_1.writeFileSync)(path, `${JSON.stringify(payload, null, 2)}\n`);
}
function buildCanonicalDefaults() {
    return {
        profile: null,
        repository: null,
        branch: null,
        runId: null,
        runNumber: null,
        runUrl: null,
        reportPassed: false,
        warningCount: 0,
        warningThreshold: null,
        shouldOpenIssue: false,
        shouldCloseIssue: false,
        baselineComparable: false,
        failOnWarning: false,
        metadataPath: null,
        summaryPath: null,
        reportPath: null,
    };
}
function writeSummaryArtifacts(path, format, lines, jsonSummary) {
    const result = {};
    if (format === 'none') {
        return result;
    }
    if (format === 'md' || format === 'both') {
        (0, node_fs_1.mkdirSync)((0, node_path_1.dirname)(path), { recursive: true });
        (0, node_fs_1.writeFileSync)(path, `${lines.join('\n')}\n`);
        result.summaryPath = path;
    }
    if (format === 'json' || format === 'both') {
        const jsonPath = deriveJsonSummaryPath(path);
        (0, node_fs_1.mkdirSync)((0, node_path_1.dirname)(jsonPath), { recursive: true });
        (0, node_fs_1.writeFileSync)(jsonPath, `${JSON.stringify(jsonSummary, null, 2)}\n`);
        result.summaryJsonPath = jsonPath;
    }
    return result;
}
function getToken() {
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!token)
        throw authError('Missing token. Set GITHUB_TOKEN (or GH_TOKEN).');
    return token;
}
function getRepository(explicitRepo) {
    const source = explicitRepo || process.env.GITHUB_REPOSITORY;
    if (!source || !source.includes('/')) {
        throw usageError('Repository not provided. Pass --repo owner/repo or set GITHUB_REPOSITORY.');
    }
    const [owner, repo] = source.split('/', 2);
    if (!owner || !repo)
        throw usageError(`Invalid repository value: ${source}`);
    return { owner, repo };
}
async function githubRequest(token, path, method, body) {
    let response;
    try {
        response = await fetch(`https://api.github.com${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'User-Agent': 'backend-workflow-poll-helper',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw apiError(`GitHub API request failed: ${message}`);
    }
    if (!response.ok) {
        const text = await response.text();
        if (response.status === 401 || response.status === 403) {
            throw authError(`GitHub API authentication failed (${response.status}): ${text}`);
        }
        throw apiError(`GitHub API ${method} ${path} failed (${response.status}): ${text}`);
    }
    if (response.status === 204) {
        return undefined;
    }
    return (await response.json());
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function dispatchWorkflow(token, owner, repo, workflow, ref, inputs) {
    await githubRequest(token, `/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`, 'POST', { ref, inputs });
}
async function findDispatchedRun(token, owner, repo, workflow, ref, earliestIso) {
    const response = await githubRequest(token, `/repos/${owner}/${repo}/actions/workflows/${workflow}/runs?event=workflow_dispatch&branch=${encodeURIComponent(ref)}&per_page=20`, 'GET');
    return response.workflow_runs
        .filter((run) => new Date(run.created_at).getTime() >= new Date(earliestIso).getTime())
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
}
async function waitForCompletion(token, owner, repo, runId, timeoutSeconds, intervalSeconds) {
    const deadline = Date.now() + timeoutSeconds * 1000;
    while (Date.now() < deadline) {
        const run = await githubRequest(token, `/repos/${owner}/${repo}/actions/runs/${runId}`, 'GET');
        if (run.status === 'completed') {
            return run;
        }
        await sleep(intervalSeconds * 1000);
    }
    throw timeoutError(`Timed out waiting for workflow run ${runId} after ${timeoutSeconds}s.`);
}
async function main() {
    const options = parseOptions(process.argv.slice(2));
    if (options.help) {
        printUsage();
        return;
    }
    const token = getToken();
    const { owner, repo } = getRepository(options.repo);
    const earliest = new Date(Date.now() - 10000).toISOString();
    if (options.dispatch) {
        await dispatchWorkflow(token, owner, repo, options.workflow, options.ref, options.inputs);
        if (!options.json) {
            console.log(`Dispatched workflow '${options.workflow}' for ${owner}/${repo} on '${options.ref}'.`);
        }
    }
    const deadline = Date.now() + options.timeoutSeconds * 1000;
    let discoveredRun;
    while (!discoveredRun && Date.now() < deadline) {
        discoveredRun = await findDispatchedRun(token, owner, repo, options.workflow, options.ref, earliest);
        if (!discoveredRun) {
            await sleep(options.intervalSeconds * 1000);
        }
    }
    if (!discoveredRun) {
        throw timeoutError(`Unable to find a matching workflow_dispatch run for '${options.workflow}' on '${options.ref}' within timeout.`);
    }
    const completedRun = await waitForCompletion(token, owner, repo, discoveredRun.id, Math.max(1, Math.floor((deadline - Date.now()) / 1000)), options.intervalSeconds);
    const success = completedRun.conclusion === 'success';
    const summaryLines = [
        '## Workflow Run Summary',
        '',
        `- repository: \`${owner}/${repo}\``,
        `- workflow: \`${options.workflow}\``,
        `- ref: \`${options.ref}\``,
        `- dispatched: \`${String(options.dispatch)}\``,
        `- run id: \`${String(completedRun.id)}\``,
        `- run number: \`${String(completedRun.run_number)}\``,
        `- status: \`${completedRun.status}\``,
        `- conclusion: \`${String(completedRun.conclusion)}\``,
        `- run url: ${completedRun.html_url}`,
        `- result: **${success ? 'PASS' : 'FAIL'}**`,
    ];
    const summaryJson = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        ok: success,
        repository: `${owner}/${repo}`,
        workflow: options.workflow,
        ref: options.ref,
        dispatched: options.dispatch,
        runId: completedRun.id,
        runNumber: completedRun.run_number,
        runUrl: completedRun.html_url,
        status: completedRun.status,
        conclusion: completedRun.conclusion,
        message: success
            ? 'Workflow run completed successfully.'
            : `Workflow run completed with conclusion '${completedRun.conclusion}'.`,
        exitCode: success ? 0 : 5,
    };
    const summaryWrite = writeSummaryArtifacts(options.summaryOut, options.summaryFormat, summaryLines, summaryJson);
    if (options.json) {
        const payload = {
            schemaVersion: CURRENT_SCHEMA_VERSION,
            ok: success,
            mode: 'poll',
            ...buildCanonicalDefaults(),
            reportPassed: success,
            repository: `${owner}/${repo}`,
            branch: options.ref,
            runId: completedRun.id,
            runNumber: completedRun.run_number,
            runUrl: completedRun.html_url,
            summaryPath: summaryWrite.summaryPath ?? null,
            workflow: options.workflow,
            ref: options.ref,
            dispatched: options.dispatch,
            status: completedRun.status,
            conclusion: completedRun.conclusion,
            reportPath: null,
            summaryJsonPath: summaryWrite.summaryJsonPath,
            outputPath: options.outputPath,
            message: success
                ? 'Workflow run completed successfully.'
                : `Workflow run completed with conclusion '${completedRun.conclusion}'.`,
            exitCode: success ? 0 : 5,
        };
        if (options.outputPath) {
            writePrimaryOutput(options.outputPath, payload);
        }
        emitJson(payload);
    }
    else {
        if (options.outputPath) {
            const payload = {
                schemaVersion: CURRENT_SCHEMA_VERSION,
                ok: success,
                mode: 'poll',
                ...buildCanonicalDefaults(),
                reportPassed: success,
                repository: `${owner}/${repo}`,
                branch: options.ref,
                runId: completedRun.id,
                runNumber: completedRun.run_number,
                runUrl: completedRun.html_url,
                summaryPath: summaryWrite.summaryPath ?? null,
                workflow: options.workflow,
                ref: options.ref,
                dispatched: options.dispatch,
                status: completedRun.status,
                conclusion: completedRun.conclusion,
                reportPath: null,
                summaryJsonPath: summaryWrite.summaryJsonPath,
                outputPath: options.outputPath,
                message: success
                    ? 'Workflow run completed successfully.'
                    : `Workflow run completed with conclusion '${completedRun.conclusion}'.`,
                exitCode: success ? 0 : 5,
            };
            writePrimaryOutput(options.outputPath, payload);
        }
        console.log(`Workflow run completed: id=${completedRun.id} status=${completedRun.status} conclusion=${completedRun.conclusion} url=${completedRun.html_url}`);
    }
    if (!success) {
        throw workflowError(`Workflow run conclusion was '${completedRun.conclusion}'.`);
    }
}
main().catch((error) => {
    const summaryPath = getSummaryPathFromArgv(process.argv.slice(2));
    const summaryFormat = getSummaryFormatFromArgv(process.argv.slice(2));
    const outputIndex = process.argv.indexOf('--output');
    const outputPath = outputIndex >= 0 && process.argv[outputIndex + 1] && !process.argv[outputIndex + 1].startsWith('--')
        ? process.argv[outputIndex + 1]
        : undefined;
    const message = error instanceof Error ? error.message : String(error);
    const exitCode = error instanceof PollError ? error.exitCode : 1;
    const errorType = error instanceof PollError ? error.errorType : 'unknown';
    const summaryJson = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        ok: false,
        errorType,
        exitCode,
        message,
    };
    const summaryWrite = writeSummaryArtifacts(summaryPath, summaryFormat, [
        '## Workflow Run Summary',
        '',
        '- result: **FAIL**',
        `- error type: \`${errorType}\``,
        `- exit code: \`${String(exitCode)}\``,
        `- message: ${message}`,
    ], summaryJson);
    if (process.argv.includes('--json')) {
        const payload = {
            schemaVersion: CURRENT_SCHEMA_VERSION,
            ok: false,
            mode: 'error',
            ...buildCanonicalDefaults(),
            summaryPath: summaryWrite.summaryPath ?? null,
            message,
            errorType,
            exitCode,
            summaryJsonPath: summaryWrite.summaryJsonPath,
            outputPath,
        };
        if (outputPath) {
            writePrimaryOutput(outputPath, payload);
        }
        emitJson(payload);
    }
    else {
        if (outputPath) {
            const payload = {
                schemaVersion: CURRENT_SCHEMA_VERSION,
                ok: false,
                mode: 'error',
                ...buildCanonicalDefaults(),
                summaryPath: summaryWrite.summaryPath ?? null,
                message,
                errorType,
                exitCode,
                summaryJsonPath: summaryWrite.summaryJsonPath,
                outputPath,
            };
            writePrimaryOutput(outputPath, payload);
        }
        console.error(message);
    }
    process.exit(exitCode);
});
