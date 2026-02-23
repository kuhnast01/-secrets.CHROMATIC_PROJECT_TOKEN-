"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRuntimeRevocations = loadRuntimeRevocations;
exports.listRuntimeRevocations = listRuntimeRevocations;
exports.getRuntimeRevokedHashes = getRuntimeRevokedHashes;
exports.addRuntimeRevocation = addRuntimeRevocation;
exports.removeRuntimeRevocation = removeRuntimeRevocation;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
const runtimeRevocations = new Map();
function getStorePath(env = process.env) {
    const configured = env.POSEIDON_LICENSE_REVOCATION_STORE_PATH?.trim();
    if (configured) {
        return node_path_1.default.resolve(configured);
    }
    return node_path_1.default.resolve(process.cwd(), 'tmp/licensing/revocations.json');
}
function normalizeHash(input) {
    return input.trim().toLowerCase();
}
function isValidHash(input) {
    return SHA256_HEX_PATTERN.test(normalizeHash(input));
}
function toStorePayload(entries) {
    return {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        revocations: entries,
    };
}
function loadRuntimeRevocations(env = process.env) {
    const storePath = getStorePath(env);
    if (!node_fs_1.default.existsSync(storePath)) {
        return;
    }
    let parsed;
    try {
        parsed = JSON.parse(node_fs_1.default.readFileSync(storePath, 'utf8'));
    }
    catch {
        return;
    }
    const entries = Array.isArray(parsed?.revocations) ? parsed.revocations : [];
    for (const entry of entries) {
        if (!entry || typeof entry !== 'object') {
            continue;
        }
        const keyHash = typeof entry.keyHash === 'string' ? normalizeHash(entry.keyHash) : '';
        const reason = typeof entry.reason === 'string' && entry.reason.trim().length > 0 ? entry.reason.trim() : 'manual_revocation';
        const revokedAt = typeof entry.revokedAt === 'string' && entry.revokedAt.trim().length > 0 ? entry.revokedAt.trim() : new Date().toISOString();
        if (!isValidHash(keyHash)) {
            continue;
        }
        runtimeRevocations.set(keyHash, {
            keyHash,
            reason,
            revokedAt,
            actorId: typeof entry.actorId === 'string' ? entry.actorId : undefined,
        });
    }
}
function listRuntimeRevocations() {
    return Array.from(runtimeRevocations.values()).sort((left, right) => left.revokedAt.localeCompare(right.revokedAt));
}
function getRuntimeRevokedHashes(env = process.env) {
    const envHashes = (env.POSEIDON_LICENSE_REVOKED_HASHES ?? '')
        .split(',')
        .map((item) => normalizeHash(item))
        .filter((item) => isValidHash(item));
    const combined = new Set(envHashes);
    for (const keyHash of runtimeRevocations.keys()) {
        combined.add(keyHash);
    }
    return combined;
}
function persist(env = process.env) {
    const storePath = getStorePath(env);
    node_fs_1.default.mkdirSync(node_path_1.default.dirname(storePath), { recursive: true });
    const payload = toStorePayload(listRuntimeRevocations());
    node_fs_1.default.writeFileSync(storePath, JSON.stringify(payload, null, 2), 'utf8');
}
function addRuntimeRevocation(keyHash, reason, actorId, env = process.env) {
    const normalized = normalizeHash(keyHash);
    if (!isValidHash(normalized)) {
        throw new Error('invalid_key_hash');
    }
    const entry = {
        keyHash: normalized,
        reason: reason.trim().length > 0 ? reason.trim() : 'manual_revocation',
        revokedAt: new Date().toISOString(),
        actorId,
    };
    runtimeRevocations.set(normalized, entry);
    persist(env);
    return entry;
}
function removeRuntimeRevocation(keyHash, env = process.env) {
    const normalized = normalizeHash(keyHash);
    if (!isValidHash(normalized)) {
        return false;
    }
    const removed = runtimeRevocations.delete(normalized);
    if (removed) {
        persist(env);
    }
    return removed;
}
loadRuntimeRevocations();
