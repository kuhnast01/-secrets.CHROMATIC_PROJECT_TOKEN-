import fs from 'node:fs/promises';
import path from 'node:path';
import { createLicenseKey, hashLicenseKey, normalizeLicenseKey, validateLicenseKey } from '../../src/security/license';
import {
  addRuntimeRevocation,
  getRuntimeRevokedHashes,
  listRuntimeRevocations,
  removeRuntimeRevocation,
} from '../../src/security/licenseRevocations';

type DrillStatus = 'pass' | 'fail';

type LicenseRevocationRotationPolicy = {
  schemaVersion: number;
  description: string;
  rotation: {
    requireRotationMetadata: boolean;
    revokePreviousByDefault: boolean;
    minimumRotationTtlSeconds: number;
  };
  revocation: {
    requireSha256Hash: boolean;
    allowedReasons: string[];
    requireAuditActor: boolean;
  };
  evidence: {
    artifactPrefix: string;
    requireMachineReadableReport: boolean;
  };
};

type DrillArtifact = {
  schemaVersion: number;
  pipeline: 'LIC-01';
  status: DrillStatus;
  generatedAt: string;
  runId: string;
  policyPath: string;
  reportPath: string;
  workPath: string;
  policy: LicenseRevocationRotationPolicy;
  checks: Array<{
    name: string;
    status: DrillStatus;
    details: string;
  }>;
  summary: {
    oldKeyHash: string;
    rotatedKeyHash: string;
    revokedByRuntimeStore: boolean;
    oldLicenseReactivatedAfterRemove: boolean;
    rotatedLicenseValid: boolean;
  };
};

const backendRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(backendRoot, '..');

function parseArgs(argv: string[]): Record<string, string> {
  return argv.reduce<Record<string, string>>((accumulator, argument) => {
    const [rawKey, ...rest] = argument.split('=');
    if (!rawKey?.startsWith('--') || rest.length === 0) {
      return accumulator;
    }
    accumulator[rawKey.slice(2)] = rest.join('=');
    return accumulator;
  }, {});
}

function utcTimestampCompact(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

async function readPolicy(policyPath: string): Promise<LicenseRevocationRotationPolicy> {
  const raw = await fs.readFile(policyPath, 'utf8');
  return JSON.parse(raw) as LicenseRevocationRotationPolicy;
}

function buildClaims(nowSeconds: number, expSeconds: number): Record<string, unknown> {
  return {
    org: 'PoseidonLabs',
    tier: 'enterprise',
    features: ['alerts', 'analytics'],
    nbf: nowSeconds - 30,
    exp: nowSeconds + expSeconds,
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const timestamp = utcTimestampCompact(new Date());
  const runId = `license-revocation-rotation-${timestamp}`;

  const policyPath = path.resolve(
    args.policyPath ?? path.join(repoRoot, 'governance/policies/license-revocation-rotation-policy.json'),
  );
  const reportPath = path.resolve(
    args.reportDir ?? path.join(backendRoot, 'tmp/liveops-artifacts'),
    `lic-01-license-revocation-rotation-${timestamp}.json`,
  );
  const workPath = path.resolve(
    args.workDir ?? path.join(backendRoot, 'tmp/licensing-revocation-rotation', runId),
  );

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.mkdir(workPath, { recursive: true });

  const revocationStorePath = path.join(workPath, 'revocations.json');
  process.env.POSEIDON_LICENSE_REVOCATION_STORE_PATH = revocationStorePath;

  for (const entry of listRuntimeRevocations()) {
    removeRuntimeRevocation(entry.keyHash);
  }

  const policy = await readPolicy(policyPath);
  const secret = 'license-drill-secret';
  const nowSeconds = Math.floor(Date.now() / 1000);
  const rotationTtl = Math.max(policy.rotation.minimumRotationTtlSeconds, 600);

  const sourceClaims = buildClaims(nowSeconds, 3600);
  const sourceLicenseKey = createLicenseKey(sourceClaims, secret);
  const oldKeyHash = hashLicenseKey(normalizeLicenseKey(sourceLicenseKey));

  const sourceValidation = validateLicenseKey(sourceLicenseKey, secret, getRuntimeRevokedHashes());

  const revocationReason = policy.revocation.allowedReasons.includes('rotated_license')
    ? 'rotated_license'
    : policy.revocation.allowedReasons[0] ?? 'manual_revocation';
  addRuntimeRevocation(oldKeyHash, revocationReason, 'drill-actor-admin');

  const revokedValidation = validateLicenseKey(sourceLicenseKey, secret, getRuntimeRevokedHashes());

  const rotatedClaims = {
    ...buildClaims(nowSeconds, rotationTtl),
    rotatedFrom: oldKeyHash,
  };
  const rotatedLicenseKey = createLicenseKey(rotatedClaims, secret);
  const rotatedKeyHash = hashLicenseKey(normalizeLicenseKey(rotatedLicenseKey));
  const rotatedValidation = validateLicenseKey(rotatedLicenseKey, secret, getRuntimeRevokedHashes());

  const removed = removeRuntimeRevocation(oldKeyHash);
  const reactivatedValidation = validateLicenseKey(sourceLicenseKey, secret, getRuntimeRevokedHashes());

  const checks: DrillArtifact['checks'] = [
    {
      name: 'source-license-valid-before-revocation',
      status: sourceValidation.valid ? 'pass' : 'fail',
      details: sourceValidation.reason ?? 'valid',
    },
    {
      name: 'source-license-blocked-after-revocation',
      status: revokedValidation.valid === false && revokedValidation.reason === 'license_revoked' ? 'pass' : 'fail',
      details: revokedValidation.reason ?? 'unexpected',
    },
    {
      name: 'rotated-license-valid',
      status: rotatedValidation.valid ? 'pass' : 'fail',
      details: rotatedValidation.reason ?? 'valid',
    },
    {
      name: 'revocation-removal-reactivates-source-license',
      status: removed && reactivatedValidation.valid ? 'pass' : 'fail',
      details: `removed=${String(removed)}; reason=${reactivatedValidation.reason ?? 'valid'}`,
    },
    {
      name: 'rotation-includes-metadata',
      status:
        policy.rotation.requireRotationMetadata &&
        typeof rotatedValidation.claims?.rotatedFrom === 'string' &&
        rotatedValidation.claims.rotatedFrom === oldKeyHash
          ? 'pass'
          : 'fail',
      details: `rotatedFrom=${String(rotatedValidation.claims?.rotatedFrom ?? '')}`,
    },
  ];

  const status: DrillStatus = checks.every((check) => check.status === 'pass') ? 'pass' : 'fail';

  const simulationPath = path.join(workPath, 'rotation-simulation.json');
  await fs.writeFile(
    simulationPath,
    JSON.stringify(
      {
        schemaVersion: 1,
        runId,
        generatedAt: new Date().toISOString(),
        oldKeyHash,
        rotatedKeyHash,
        checks,
      },
      null,
      2,
    ),
    'utf8',
  );

  const artifact: DrillArtifact = {
    schemaVersion: 1,
    pipeline: 'LIC-01',
    status,
    generatedAt: new Date().toISOString(),
    runId,
    policyPath,
    reportPath,
    workPath,
    policy,
    checks,
    summary: {
      oldKeyHash,
      rotatedKeyHash,
      revokedByRuntimeStore: revokedValidation.reason === 'license_revoked',
      oldLicenseReactivatedAfterRemove: reactivatedValidation.valid,
      rotatedLicenseValid: rotatedValidation.valid,
    },
  };

  await fs.writeFile(reportPath, JSON.stringify(artifact, null, 2), 'utf8');
  console.log(JSON.stringify(artifact, null, 2));

  if (status === 'fail') {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'unknown_error';
  console.error(JSON.stringify({ error: message }, null, 2));
  process.exit(1);
});
