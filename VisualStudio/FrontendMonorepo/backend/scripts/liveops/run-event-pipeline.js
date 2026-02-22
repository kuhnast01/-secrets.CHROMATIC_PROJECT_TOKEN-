"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const validate_1 = require("../../src/utils/validate");
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
function toOptionalNumber(value) {
    if (!value || value.trim() === '') {
        return undefined;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        throw new Error(`Invalid numeric value: ${value}`);
    }
    return parsed;
}
function utcTimestampCompact(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}
function toFileSlug(input) {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'event';
}
function getDefaultConfig(now) {
    const startAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    const endAt = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();
    return {
        trigger: {
            type: 'schedule',
            startAt,
            endAt,
            timezone: 'UTC',
        },
        segments: ['all_players'],
        rewards: [
            {
                sku: 'coins',
                amount: 250,
            },
        ],
        rollout: {
            mode: 'staged',
            percentage: 10,
        },
        metadata: {
            source: 'AUTO-01-one-click-pipeline',
            generatedAt: now.toISOString(),
        },
    };
}
function readConfigFromFile(configFilePath) {
    const resolvedPath = node_path_1.default.resolve(configFilePath);
    if (!node_fs_1.default.existsSync(resolvedPath)) {
        throw new Error(`Config file not found: ${resolvedPath}`);
    }
    const raw = node_fs_1.default.readFileSync(resolvedPath, 'utf8');
    return JSON.parse(raw);
}
function writeJsonFile(targetPath, value) {
    node_fs_1.default.mkdirSync(node_path_1.default.dirname(targetPath), { recursive: true });
    node_fs_1.default.writeFileSync(targetPath, JSON.stringify(value, null, 2), 'utf8');
}
function defaultEventName(now) {
    return `AUTO-01 Event ${now.toISOString().slice(0, 10)}`;
}
async function main() {
    const startedAt = new Date();
    const args = parseArgs(process.argv.slice(2));
    const reportDir = args.reportDir ?? 'tmp/liveops-artifacts';
    const stageDir = args.stageDir ?? 'tmp/liveops-staging/events';
    const timestamp = utcTimestampCompact(startedAt);
    const reportPath = node_path_1.default.resolve(reportDir, `auto-01-event-pipeline-${timestamp}.json`);
    const steps = [];
    const fail = (error) => {
        const message = error instanceof Error ? error.message : 'unknown_error';
        const failedArtifact = {
            schemaVersion: 1,
            pipeline: 'AUTO-01',
            status: 'failed',
            generatedAt: new Date().toISOString(),
            reportPath,
            steps,
            error: message,
        };
        writeJsonFile(reportPath, failedArtifact);
        console.error(JSON.stringify(failedArtifact, null, 2));
        process.exit(1);
    };
    try {
        const createdBy = toOptionalNumber(args.createdBy);
        const draftName = args.name?.trim() || defaultEventName(startedAt);
        const draftConfig = args.configFile
            ? readConfigFromFile(args.configFile)
            : getDefaultConfig(startedAt);
        const authoredDraft = {
            name: draftName,
            config: draftConfig,
            created_by: createdBy,
        };
        steps.push({ name: 'author', status: 'success', details: 'Draft payload generated' });
        const validation = validate_1.eventSchema.safeParse(authoredDraft);
        if (!validation.success) {
            const details = validation.error.issues
                .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
                .join('; ');
            steps.push({ name: 'validate', status: 'failed', details });
            throw new Error(`Validation failed: ${details}`);
        }
        steps.push({ name: 'validate', status: 'success', details: 'Schema validation passed' });
        const stageId = `${timestamp}-${toFileSlug(validation.data.name)}`;
        const stagePath = node_path_1.default.resolve(stageDir, `${stageId}.json`);
        writeJsonFile(stagePath, {
            schemaVersion: 1,
            stageId,
            stagedAt: new Date().toISOString(),
            pipeline: 'AUTO-01',
            event: validation.data,
        });
        steps.push({ name: 'stage', status: 'success', details: `Staged to ${stagePath}` });
        const successArtifact = {
            schemaVersion: 1,
            pipeline: 'AUTO-01',
            status: 'success',
            generatedAt: new Date().toISOString(),
            stageId,
            stagePath,
            reportPath,
            steps,
            eventDraft: validation.data,
        };
        writeJsonFile(reportPath, successArtifact);
        console.log(JSON.stringify(successArtifact, null, 2));
    }
    catch (error) {
        fail(error);
    }
}
main().catch((error) => {
    const message = error instanceof Error ? error.message : 'unknown_error';
    console.error(JSON.stringify({ error: message }, null, 2));
    process.exit(1);
});
