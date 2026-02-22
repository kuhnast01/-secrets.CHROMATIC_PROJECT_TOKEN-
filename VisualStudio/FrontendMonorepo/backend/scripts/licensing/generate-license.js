"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = __importDefault(require("node:crypto"));
function parseArgs(argv) {
    return argv.reduce((acc, item) => {
        const [key, value] = item.split('=');
        if (key && value !== undefined && key.startsWith('--')) {
            acc[key.slice(2)] = value;
        }
        return acc;
    }, {});
}
function base64urlEncode(value) {
    return Buffer.from(value, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function parseFeatures(raw) {
    if (!raw)
        return [];
    return raw.split(/[\s,]+/).map((feature) => feature.trim()).filter(Boolean);
}
const args = parseArgs(process.argv.slice(2));
const secret = process.env.POSEIDON_LICENSE_SECRET;
if (!secret) {
    console.error('POSEIDON_LICENSE_SECRET is required in environment.');
    process.exit(1);
}
const now = Math.floor(Date.now() / 1000);
const ttlDays = Number(args.ttlDays ?? '365');
const exp = now + ttlDays * 24 * 60 * 60;
const payload = {
    org: args.org ?? 'unknown-org',
    tier: args.tier ?? 'enterprise',
    nbf: now,
    exp,
    features: parseFeatures(args.features),
};
const encodedPayload = base64urlEncode(JSON.stringify(payload));
const signature = node_crypto_1.default.createHmac('sha256', secret).update(encodedPayload).digest('hex');
const licenseKey = `POSEIDON-LIC.${encodedPayload}.${signature}`;
console.log(JSON.stringify({ payload, licenseKey }, null, 2));
