"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = __importDefault(require("node:crypto"));
const license_1 = require("./license");
function buildLicense(secret, claims) {
    const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
    const signature = node_crypto_1.default.createHmac('sha256', secret).update(payload).digest('hex');
    return `POSEIDON-LIC.${payload}.${signature}`;
}
describe('license security helpers', () => {
    it('defaults to warn mode for invalid values', () => {
        expect((0, license_1.getLicenseMode)({ POSEIDON_LICENSE_ENFORCEMENT: 'invalid' })).toBe('warn');
    });
    it('normalizes and hashes keys consistently', () => {
        const raw = 'abc.123';
        const prefixed = `POSEIDON-LIC.${raw}`;
        expect((0, license_1.normalizeLicenseKey)(prefixed)).toBe(raw);
        expect((0, license_1.hashLicenseKey)((0, license_1.normalizeLicenseKey)(prefixed))).toBe((0, license_1.hashLicenseKey)(raw));
    });
    it('parses revoked hash list from env', () => {
        const values = (0, license_1.getRevokedLicenseHashes)({
            POSEIDON_LICENSE_REVOKED_HASHES: '  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa , BB,cc,deadbeef,FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  ',
        });
        expect(values.has('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toBe(true);
        expect(values.has('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')).toBe(true);
        expect(values.has('deadbeef')).toBe(false);
        expect(values.has('bb')).toBe(false);
    });
    it('rejects revoked valid keys before signature/claims checks complete', () => {
        const secret = 'test-secret';
        const nowSec = Math.floor(Date.now() / 1000);
        const key = buildLicense(secret, {
            org: 'PoseidonLabs',
            tier: 'enterprise',
            nbf: nowSec - 60,
            exp: nowSec + 3600,
        });
        const revoked = new Set([(0, license_1.hashLicenseKey)((0, license_1.normalizeLicenseKey)(key))]);
        const result = (0, license_1.validateLicenseKey)(key, secret, revoked);
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('license_revoked');
    });
});
