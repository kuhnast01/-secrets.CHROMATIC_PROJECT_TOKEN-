import crypto from 'node:crypto';
import { getLicenseMode, getRevokedLicenseHashes, hashLicenseKey, normalizeLicenseKey, validateLicenseKey, } from './license';
function buildLicense(secret, claims) {
    const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return `POSEIDON-LIC.${payload}.${signature}`;
}
describe('license security helpers', () => {
    it('defaults to warn mode for invalid values', () => {
        expect(getLicenseMode({ POSEIDON_LICENSE_ENFORCEMENT: 'invalid' })).toBe('warn');
    });
    it('normalizes and hashes keys consistently', () => {
        const raw = 'abc.123';
        const prefixed = `POSEIDON-LIC.${raw}`;
        expect(normalizeLicenseKey(prefixed)).toBe(raw);
        expect(hashLicenseKey(normalizeLicenseKey(prefixed))).toBe(hashLicenseKey(raw));
    });
    it('parses revoked hash list from env', () => {
        const values = getRevokedLicenseHashes({
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
        const revoked = new Set([hashLicenseKey(normalizeLicenseKey(key))]);
        const result = validateLicenseKey(key, secret, revoked);
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('license_revoked');
    });
});
