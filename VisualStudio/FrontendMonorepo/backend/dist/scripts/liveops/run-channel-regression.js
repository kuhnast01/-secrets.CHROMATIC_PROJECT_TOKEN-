import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const DEFAULT_CHANNELS = ['dev', 'stage', 'prod'];
const CHANNEL_PLAN = {
    dev: ['pnpm run type-check'],
    stage: ['pnpm run build'],
    prod: ['pnpm run type-check', 'pnpm run build'],
};
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
function parseChannels(value) {
    if (!value || value.trim() === '') {
        return DEFAULT_CHANNELS;
    }
    const parsed = value
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
    const channels = parsed.map((item) => {
        if (item !== 'dev' && item !== 'stage' && item !== 'prod') {
            throw new Error(`Unsupported channel: ${item}. Allowed channels: dev, stage, prod`);
        }
        return item;
    });
    if (channels.length === 0) {
        throw new Error('No valid channels provided');
    }
    return channels;
}
function runShellCommand(command, cwd) {
    return new Promise((resolve) => {
        const started = Date.now();
        const child = spawn(command, {
            cwd,
            stdio: 'inherit',
            shell: true,
            env: process.env,
        });
        child.on('error', () => {
            resolve({ exitCode: 1, durationMs: Date.now() - started });
        });
        child.on('exit', (code) => {
            resolve({
                exitCode: code === null ? 1 : code,
                durationMs: Date.now() - started,
            });
        });
    });
}
function writeJsonFile(filePath, payload) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
}
async function runChannel(channel, commands, cwd) {
    const started = new Date();
    const steps = [];
    for (const command of commands) {
        const { exitCode, durationMs } = await runShellCommand(command, cwd);
        const status = exitCode === 0 ? 'pass' : 'fail';
        steps.push({
            command,
            exitCode,
            durationMs,
            status,
        });
        if (status === 'fail') {
            break;
        }
    }
    const finished = new Date();
    const channelStatus = steps.every((step) => step.status === 'pass') ? 'pass' : 'fail';
    return {
        channel,
        status: channelStatus,
        startedAt: started.toISOString(),
        finishedAt: finished.toISOString(),
        durationMs: finished.getTime() - started.getTime(),
        steps,
    };
}
async function main() {
    const started = Date.now();
    const args = parseArgs(process.argv.slice(2));
    const channels = parseChannels(args.channels);
    const timestamp = utcTimestampCompact(new Date());
    const reportDir = path.resolve(args.reportDir ?? 'tmp/liveops-artifacts');
    const reportPath = path.resolve(reportDir, `auto-02-channel-regression-${timestamp}.json`);
    const cwd = path.resolve(__dirname, '..', '..');
    const results = [];
    for (const channel of channels) {
        const channelResult = await runChannel(channel, CHANNEL_PLAN[channel], cwd);
        results.push(channelResult);
    }
    const steps = results.flatMap((result) => result.steps);
    const channelsPassed = results.filter((result) => result.status === 'pass').length;
    const channelsFailed = results.length - channelsPassed;
    const stepsPassed = steps.filter((step) => step.status === 'pass').length;
    const stepsFailed = steps.length - stepsPassed;
    const status = channelsFailed === 0 ? 'pass' : 'fail';
    const artifact = {
        schemaVersion: 1,
        pipeline: 'AUTO-02',
        status,
        generatedAt: new Date().toISOString(),
        selectedChannels: channels,
        reportPath,
        totals: {
            channels: results.length,
            channelsPassed,
            channelsFailed,
            steps: steps.length,
            stepsPassed,
            stepsFailed,
            durationMs: Date.now() - started,
        },
        channels: results,
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
