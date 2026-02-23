"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_readline_1 = __importDefault(require("node:readline"));
const node_path_1 = __importDefault(require("node:path"));
const license_event_summary_1 = require("./lib/license-event-summary");
function parseArgs(argv) {
    return argv.reduce((acc, item) => {
        const [key, value] = item.split('=');
        if (key?.startsWith('--') && value !== undefined) {
            acc[key.slice(2)] = value;
        }
        return acc;
    }, {});
}
function toNumber(value, fallback) {
    if (!value)
        return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}
function getFormats(value) {
    const normalized = (value ?? 'both').trim().toLowerCase();
    if (normalized === 'both')
        return ['json', 'csv'];
    if (normalized === 'json' || normalized === 'csv')
        return [normalized];
    throw new Error('Invalid --format value. Use json, csv, or both.');
}
function utcTimestampCompact(date) {
    const iso = date.toISOString();
    return iso.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const filePath = args.file;
    if (!filePath) {
        console.error('Provide --file=<path-to-log.ndjson>');
        process.exit(1);
    }
    if (!node_fs_1.default.existsSync(filePath)) {
        console.error(`Log file not found: ${filePath}`);
        process.exit(1);
    }
    const sinceHours = toNumber(args.sinceHours, 24);
    const formats = getFormats(args.format);
    const outDir = args.outDir ?? 'stress-artifacts';
    const stream = node_fs_1.default.createReadStream(filePath, { encoding: 'utf8' });
    const rl = node_readline_1.default.createInterface({ input: stream, crlfDelay: Infinity });
    const lines = [];
    for await (const line of rl) {
        lines.push(line);
    }
    const now = new Date();
    const timestamp = utcTimestampCompact(now);
    const result = (0, license_event_summary_1.summarizeLicenseEvents)({ lines, sinceHours, nowMs: now.getTime() });
    node_fs_1.default.mkdirSync(outDir, { recursive: true });
    const outputs = [];
    for (const format of formats) {
        const ext = format === 'json' ? 'json' : 'csv';
        const outPath = node_path_1.default.join(outDir, `license-events-summary-${timestamp}.${ext}`);
        node_fs_1.default.writeFileSync(outPath, (0, license_event_summary_1.renderSummary)(result, format), { encoding: 'utf8' });
        outputs.push({ format, path: outPath });
    }
    console.log(JSON.stringify({
        schemaVersion: 1,
        timestamp,
        sinceHours,
        sourceFile: filePath,
        outputs,
    }, null, 2));
}
main().catch((error) => {
    const message = error instanceof Error ? error.message : 'unknown_error';
    console.error(JSON.stringify({ error: message }, null, 2));
    process.exit(1);
});
