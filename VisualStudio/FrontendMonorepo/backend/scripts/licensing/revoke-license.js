"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const license_1 = require("../../src/security/license");
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
function parseArgs(argv) {
    return argv.reduce((acc, item) => {
        const [key, value] = item.split('=');
        if (key?.startsWith('--') && value !== undefined) {
            acc[key.slice(2)] = value;
        }
        return acc;
    }, {});
}
function splitValues(raw) {
    return raw
        .split(/[\r\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);
}
function readOptionalFile(filePath) {
    if (!filePath)
        return '';
    return node_fs_1.default.readFileSync(filePath, 'utf8');
}
function readStdinIfPiped() {
    if (process.stdin.isTTY)
        return '';
    return node_fs_1.default.readFileSync(0, 'utf8');
}
function toHashes(tokens) {
    const hashes = [];
    for (const token of tokens) {
        const normalized = token.toLowerCase();
        if (SHA256_HEX_PATTERN.test(normalized)) {
            hashes.push(normalized);
            continue;
        }
        hashes.push((0, license_1.hashLicenseKey)((0, license_1.normalizeLicenseKey)(token)));
    }
    return hashes;
}
const args = parseArgs(process.argv.slice(2));
const existingInput = args.existing ?? process.env.POSEIDON_LICENSE_REVOKED_HASHES ?? '';
const hashInput = args.hash ?? '';
const licenseInput = args.license ?? '';
const fileInput = readOptionalFile(args.file);
const stdinInput = readStdinIfPiped();
const existingHashes = splitValues(existingInput)
    .map((value) => value.toLowerCase())
    .filter((value) => SHA256_HEX_PATTERN.test(value));
const newTokens = [hashInput, licenseInput, fileInput, stdinInput]
    .flatMap(splitValues)
    .filter(Boolean);
if (newTokens.length === 0) {
    console.error('Provide revocations via --license=..., --hash=..., --file=..., or stdin.');
    process.exit(1);
}
const merged = new Set(existingHashes);
const beforeSize = merged.size;
for (const hash of toHashes(newTokens)) {
    merged.add(hash);
}
const mergedHashes = Array.from(merged.values()).sort();
console.log(JSON.stringify({
    existingCount: existingHashes.length,
    addedCount: merged.size - beforeSize,
    totalHashes: merged.size,
    envValue: mergedHashes.join(','),
    hashes: mergedHashes,
}, null, 2));
