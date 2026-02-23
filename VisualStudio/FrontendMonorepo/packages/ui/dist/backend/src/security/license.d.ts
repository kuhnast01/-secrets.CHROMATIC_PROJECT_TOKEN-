export type LicenseEnforcementMode = 'off' | 'warn' | 'strict';
export interface LicenseClaims {
    org?: string;
    tier?: string;
    exp?: number;
    nbf?: number;
    features?: string[];
    [key: string]: unknown;
}
export interface LicenseValidationResult {
    valid: boolean;
    reason?: string;
    claims?: LicenseClaims;
}
export declare function normalizeLicenseKey(input: string): string;
export declare function hashLicenseKey(input: string): string;
export declare function getLicenseMode(env?: NodeJS.ProcessEnv): LicenseEnforcementMode;
export declare function getExemptPaths(env?: NodeJS.ProcessEnv): string[];
export declare function isLicenseExemptPath(path: string, exemptPaths: string[]): boolean;
export declare function validateLicenseKey(licenseKey: string | undefined, secret: string | undefined, revokedHashes?: Set<string>, nowMs?: number): LicenseValidationResult;
export declare function resolveLicenseKey(headerValue: string | string[] | undefined, env?: NodeJS.ProcessEnv): string | undefined;
export declare function getRevokedLicenseHashes(env?: NodeJS.ProcessEnv): Set<string>;
