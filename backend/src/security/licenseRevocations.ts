import fs from 'node:fs';
import path from 'node:path';

const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;

export type LicenseRevocationEntry = {
  keyHash: string;
  reason: string;
  revokedAt: string;
  actorId?: string;
};

type RevocationStoreFile = {
  schemaVersion: 1;
  generatedAt: string;
  revocations: LicenseRevocationEntry[];
};

const runtimeRevocations = new Map<string, LicenseRevocationEntry>();

function getStorePath(env: NodeJS.ProcessEnv = process.env): string {
  const configured = env.POSEIDON_LICENSE_REVOCATION_STORE_PATH?.trim();
  if (configured) {
    return path.resolve(configured);
  }
  return path.resolve(process.cwd(), 'tmp/licensing/revocations.json');
}

function normalizeHash(input: string): string {
  return input.trim().toLowerCase();
}

function isValidHash(input: string): boolean {
  return SHA256_HEX_PATTERN.test(normalizeHash(input));
}

function toStorePayload(entries: LicenseRevocationEntry[]): RevocationStoreFile {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    revocations: entries,
  };
}

export function loadRuntimeRevocations(env: NodeJS.ProcessEnv = process.env): void {
  const storePath = getStorePath(env);
  if (!fs.existsSync(storePath)) {
    return;
  }

  let parsed: RevocationStoreFile;
  try {
    parsed = JSON.parse(fs.readFileSync(storePath, 'utf8')) as RevocationStoreFile;
  } catch {
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

export function listRuntimeRevocations(): LicenseRevocationEntry[] {
  return Array.from(runtimeRevocations.values()).sort((left, right) =>
    left.revokedAt.localeCompare(right.revokedAt),
  );
}

export function getRuntimeRevokedHashes(env: NodeJS.ProcessEnv = process.env): Set<string> {
  const envHashes = (env.POSEIDON_LICENSE_REVOKED_HASHES ?? '')
    .split(',')
    .map((item) => normalizeHash(item))
    .filter((item) => isValidHash(item));

  const combined = new Set<string>(envHashes);
  for (const keyHash of runtimeRevocations.keys()) {
    combined.add(keyHash);
  }

  return combined;
}

function persist(env: NodeJS.ProcessEnv = process.env): void {
  const storePath = getStorePath(env);
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  const payload = toStorePayload(listRuntimeRevocations());
  fs.writeFileSync(storePath, JSON.stringify(payload, null, 2), 'utf8');
}

export function addRuntimeRevocation(
  keyHash: string,
  reason: string,
  actorId?: string,
  env: NodeJS.ProcessEnv = process.env,
): LicenseRevocationEntry {
  const normalized = normalizeHash(keyHash);
  if (!isValidHash(normalized)) {
    throw new Error('invalid_key_hash');
  }

  const entry: LicenseRevocationEntry = {
    keyHash: normalized,
    reason: reason.trim().length > 0 ? reason.trim() : 'manual_revocation',
    revokedAt: new Date().toISOString(),
    actorId,
  };

  runtimeRevocations.set(normalized, entry);
  persist(env);
  return entry;
}

export function removeRuntimeRevocation(keyHash: string, env: NodeJS.ProcessEnv = process.env): boolean {
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
