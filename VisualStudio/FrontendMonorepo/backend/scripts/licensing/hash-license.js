"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const license_1 = require("../../src/security/license");
function parseArgs(argv) {
    return argv.reduce((acc, item) => {
        const [key, value] = item.split('=');
        if (key?.startsWith('--') && value !== undefined) {
            acc[key.slice(2)] = value;
        }
        return acc;
    }, {});
}
function splitKeys(raw) {
    return raw
        .split(/[\r\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);
}
function loadRawInput(args) {
    if (args.license) {
        return args.license;
    }
    if (args.file) {
        return node_fs_1.default.readFileSync(args.file, 'utf8');
    }
    if (!process.stdin.isTTY) {
        return node_fs_1.default.readFileSync(0, 'utf8');
    }
    return '';
}
const args = parseArgs(process.argv.slice(2));
const rawInput = loadRawInput(args);
if (!rawInput.trim()) {
    console.error('Provide input via --license=..., --file=..., or stdin.');
    process.exit(1);
}
const uniqueKeys = Array.from(new Set(splitKeys(rawInput).map(license_1.normalizeLicenseKey)));
const hashes = uniqueKeys.map((key) => (0, license_1.hashLicenseKey)(key));
const output = {
    totalKeys: uniqueKeys.length,
    hashes,
    envValue: hashes.join(','),
};
console.log(JSON.stringify(output, null, 2));
