"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const CURRENT_SCHEMA_VERSION = 1;
const ALLOWED_MODES = ['weekly-reliability', 'nightly-stress-smoke', 'poll', 'dispatch', 'error'];
class ValidationError extends Error {
    constructor(message, exitCode) {
        super(message);
        this.exitCode = exitCode;
    }
}
function usage(message) {
    throw new ValidationError(message, 2);
}
function assertType(condition, message) {
    if (!condition) {
        throw new ValidationError(message, 1);
    }
}
function isNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0;
}
function assertNullableStringField(payload, key) {
    const value = payload[key];
    assertType(value === null || typeof value === 'string', `Expected ${String(key)} to be null or a string.`);
}
function assertNullableRunField(payload, key) {
    const value = payload[key];
    assertType(value === null || typeof value === 'string' || typeof value === 'number', `Expected ${key} to be null, string, or number.`);
}
function assertRequiredString(value, fieldName) {
    assertType(isNonEmptyString(value), `Expected non-empty string field: ${fieldName}`);
}
function parseOptions(argv) {
    if (argv.includes('--help') || argv.includes('-h')) {
        return { path: '', json: false };
    }
    let path = '';
    let json = false;
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--path') {
            const value = argv[index + 1];
            if (!value || value.startsWith('--'))
                usage('Missing value for --path.');
            path = value;
            index += 1;
            continue;
        }
        if (arg === '--json') {
            json = true;
            continue;
        }
        usage(`Unknown option: ${arg}`);
    }
    if (!path) {
        usage('Missing required --path argument.');
    }
    return { path, json };
}
function printUsage() {
    console.log('Usage: pnpm exec tsx scripts/stress/validate-canonical-result.ts --path <json-file> [--json]');
}
function loadJson(path) {
    if (!(0, node_fs_1.existsSync)(path)) {
        throw new ValidationError(`Canonical result file not found: ${path}`, 1);
    }
    try {
        return JSON.parse((0, node_fs_1.readFileSync)(path, 'utf8'));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new ValidationError(`Canonical result file is not valid JSON: ${message}`, 1);
    }
}
function validateShape(value) {
    assertType(typeof value === 'object' && value !== null && !Array.isArray(value), 'Payload must be a JSON object.');
    const payload = value;
    assertType(typeof payload.schemaVersion === 'number' && Number.isInteger(payload.schemaVersion), 'Expected integer field: schemaVersion');
    assertType(payload.schemaVersion === CURRENT_SCHEMA_VERSION, `Unsupported schemaVersion: ${String(payload.schemaVersion)} (expected ${CURRENT_SCHEMA_VERSION}).`);
    const requiredBoolean = [
        'ok',
        'reportPassed',
        'shouldOpenIssue',
        'shouldCloseIssue',
        'baselineComparable',
        'failOnWarning',
    ];
    const requiredString = [
        'mode',
    ];
    for (const key of requiredBoolean) {
        assertType(typeof payload[key] === 'boolean', `Expected boolean field: ${String(key)}`);
    }
    for (const key of requiredString) {
        assertType(typeof payload[key] === 'string' && String(payload[key]).length > 0, `Expected non-empty string field: ${String(key)}`);
    }
    assertType(ALLOWED_MODES.includes(payload.mode), `Unsupported mode: ${String(payload.mode)}.`);
    assertNullableStringField(payload, 'profile');
    assertNullableStringField(payload, 'repository');
    assertNullableStringField(payload, 'branch');
    assertNullableStringField(payload, 'runUrl');
    assertNullableStringField(payload, 'metadataPath');
    assertNullableStringField(payload, 'summaryPath');
    assertNullableStringField(payload, 'reportPath');
    assertNullableRunField(payload, 'runId');
    assertNullableRunField(payload, 'runNumber');
    assertType(typeof payload.warningCount === 'number' && Number.isFinite(payload.warningCount), 'Expected warningCount to be a number.');
    assertType(payload.warningThreshold === null || (typeof payload.warningThreshold === 'number' && Number.isFinite(payload.warningThreshold)), 'Expected warningThreshold to be null or a number.');
    const mode = payload.mode;
    if (mode === 'weekly-reliability' || mode === 'nightly-stress-smoke') {
        assertRequiredString(payload.repository, 'repository');
        assertRequiredString(payload.branch, 'branch');
        assertRequiredString(payload.runUrl, 'runUrl');
        assertRequiredString(payload.metadataPath, 'metadataPath');
        assertRequiredString(payload.summaryPath, 'summaryPath');
        assertRequiredString(payload.reportPath, 'reportPath');
        assertType(payload.runId !== null, 'Expected runId to be present for CI canonical payloads.');
        assertType(payload.runNumber !== null, 'Expected runNumber to be present for CI canonical payloads.');
    }
    if (mode === 'poll') {
        assertRequiredString(payload.repository, 'repository');
        assertRequiredString(payload.branch, 'branch');
        assertRequiredString(payload.runUrl, 'runUrl');
        assertType(payload.runId !== null, 'Expected runId to be present for poll payloads.');
        assertType(payload.runNumber !== null, 'Expected runNumber to be present for poll payloads.');
    }
    if (mode === 'dispatch' && payload.ok) {
        assertRequiredString(payload.repository, 'repository');
        assertRequiredString(payload.branch, 'branch');
    }
    return payload;
}
function main() {
    const options = parseOptions(process.argv.slice(2));
    if (!options.path) {
        printUsage();
        process.exit(0);
    }
    const payload = validateShape(loadJson(options.path));
    if (options.json) {
        console.log(JSON.stringify({
            ok: true,
            message: 'Canonical result schema validation passed.',
            path: options.path,
            schemaVersion: payload.schemaVersion,
            mode: payload.mode,
            profile: payload.profile,
        }, null, 2));
    }
    else {
        console.log(`Canonical result schema validation passed: ${options.path}`);
    }
}
try {
    main();
}
catch (error) {
    if (error instanceof ValidationError) {
        console.error(error.message);
        process.exit(error.exitCode);
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
}
