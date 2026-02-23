"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = __importDefault(require("node:crypto"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const ALGORITHM = 'aes-256-gcm';
const KEY_BYTES = 32;
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
function deriveKey(secret, salt) {
    return node_crypto_1.default.scryptSync(secret, salt, KEY_BYTES);
}
function encryptJson(plain, keyId, secret) {
    const salt = node_crypto_1.default.randomBytes(16);
    const iv = node_crypto_1.default.randomBytes(12);
    const key = deriveKey(secret, salt);
    const cipher = node_crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    const plaintext = JSON.stringify(plain);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
        schemaVersion: 1,
        keyId,
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        ciphertext: encrypted.toString('base64'),
        encryptedAt: new Date().toISOString(),
    };
}
function decryptJson(payload, secret) {
    const salt = Buffer.from(payload.salt, 'base64');
    const iv = Buffer.from(payload.iv, 'base64');
    const tag = Buffer.from(payload.tag, 'base64');
    const ciphertext = Buffer.from(payload.ciphertext, 'base64');
    const key = deriveKey(secret, salt);
    const decipher = node_crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return JSON.parse(decrypted.toString('utf8'));
}
function fingerprintSecret(secret) {
    return node_crypto_1.default.createHash('sha256').update(secret).digest('hex').slice(0, 12);
}
function writeJsonFile(filePath, payload) {
    node_fs_1.default.mkdirSync(node_path_1.default.dirname(filePath), { recursive: true });
    node_fs_1.default.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
}
async function runStep(name, steps, fn) {
    const started = Date.now();
    try {
        const details = await fn();
        steps.push({ name, status: 'pass', durationMs: Date.now() - started, details });
    }
    catch (error) {
        const details = error instanceof Error ? error.message : 'unknown_error';
        steps.push({ name, status: 'fail', durationMs: Date.now() - started, details });
        throw error;
    }
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const now = new Date();
    const timestamp = utcTimestampCompact(now);
    const backendRoot = node_path_1.default.resolve(__dirname, '..', '..');
    const reportPath = node_path_1.default.resolve(args.reportDir ?? node_path_1.default.join(backendRoot, 'tmp/liveops-artifacts'), `local-03-secrets-rotation-${timestamp}.json`);
    const secretFilePath = node_path_1.default.resolve(args.secretDir ?? node_path_1.default.join(backendRoot, 'tmp/liveops-secrets'), 'active-secret.enc.json');
    const originalSecret = args.originalKey ?? node_crypto_1.default.randomBytes(24).toString('hex');
    const rotatedSecret = args.rotatedKey ?? node_crypto_1.default.randomBytes(24).toString('hex');
    const keyFingerprints = {
        original: fingerprintSecret(originalSecret),
        rotated: fingerprintSecret(rotatedSecret),
    };
    const secretMaterial = {
        provider: 'poseidon-local',
        token: node_crypto_1.default.randomBytes(32).toString('hex'),
        generatedAt: now.toISOString(),
        scope: 'LOCAL-03-drill',
    };
    const steps = [];
    await runStep('secrets-at-rest:encrypt-with-original-key', steps, async () => {
        const encrypted = encryptJson(secretMaterial, 'local-03-k1', originalSecret);
        writeJsonFile(secretFilePath, encrypted);
        return `Encrypted secret material written to ${secretFilePath}`;
    });
    await runStep('secrets-at-rest:verify-no-plaintext-leak', steps, async () => {
        const raw = node_fs_1.default.readFileSync(secretFilePath, 'utf8');
        if (raw.includes(secretMaterial.token)) {
            throw new Error('Encrypted file contains plaintext token');
        }
        return 'Encrypted file does not expose plaintext token';
    });
    let decryptedByOriginal;
    await runStep('secrets-at-rest:decrypt-with-original-key', steps, async () => {
        const encrypted = JSON.parse(node_fs_1.default.readFileSync(secretFilePath, 'utf8'));
        decryptedByOriginal = decryptJson(encrypted, originalSecret);
        if (JSON.stringify(decryptedByOriginal) !== JSON.stringify(secretMaterial)) {
            throw new Error('Decrypted payload does not match original secret material');
        }
        return 'Original key decrypts encrypted secret successfully';
    });
    await runStep('rotation:re-encrypt-with-rotated-key', steps, async () => {
        const encrypted = encryptJson(decryptedByOriginal, 'local-03-k2', rotatedSecret);
        writeJsonFile(secretFilePath, encrypted);
        return 'Secret was re-encrypted with rotated key';
    });
    await runStep('rotation:verify-rotated-key-works', steps, async () => {
        const encrypted = JSON.parse(node_fs_1.default.readFileSync(secretFilePath, 'utf8'));
        const decrypted = decryptJson(encrypted, rotatedSecret);
        if (JSON.stringify(decrypted) !== JSON.stringify(secretMaterial)) {
            throw new Error('Rotated key failed to decrypt expected secret material');
        }
        return 'Rotated key decrypts re-encrypted secret successfully';
    });
    await runStep('rotation:verify-original-key-fails-post-rotation', steps, async () => {
        const encrypted = JSON.parse(node_fs_1.default.readFileSync(secretFilePath, 'utf8'));
        try {
            decryptJson(encrypted, originalSecret);
        }
        catch {
            return 'Original key can no longer decrypt rotated secret (expected)';
        }
        throw new Error('Original key unexpectedly decrypted rotated secret');
    });
    const status = steps.every((step) => step.status === 'pass') ? 'pass' : 'fail';
    const artifact = {
        schemaVersion: 1,
        pipeline: 'LOCAL-03',
        status,
        generatedAt: new Date().toISOString(),
        reportPath,
        secretFilePath,
        steps,
        keyFingerprints,
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
