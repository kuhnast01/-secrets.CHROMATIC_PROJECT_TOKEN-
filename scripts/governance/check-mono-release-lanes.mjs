import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = globalThis.process.cwd();
const strictMode = globalThis.process.argv.includes('--strict');
const jsonMode = globalThis.process.argv.includes('--json');

const policyPath = path.join(repoRoot, 'governance', 'policies', 'release-lanes-policy.json');
const candidatePath = path.join(repoRoot, 'governance', 'release-lanes', 'release-candidate.json');
const reportPath = path.join(repoRoot, 'governance-artifacts', 'mono-release-lanes-report.json');

const WORKSPACE_FINGERPRINT_INPUTS = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'turbo.json',
  'tsconfig.base.json',
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sha256Text(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function isSha256(value) {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

function fail(message) {
  throw new Error(message);
}

function computeWorkspaceFingerprint() {
  const entries = WORKSPACE_FINGERPRINT_INPUTS.map((relativePath) => {
    const absolutePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(absolutePath)) {
      fail(`Missing workspace fingerprint input: ${relativePath}`);
    }
    return {
      file: relativePath,
      sha256: sha256File(absolutePath),
    };
  });

  const canonical = JSON.stringify(entries.sort((a, b) => a.file.localeCompare(b.file)));
  return {
    inputs: entries,
    sha256: sha256Text(canonical),
  };
}

function parsePolicy() {
  if (!fs.existsSync(policyPath)) {
    fail('Missing file: governance/policies/release-lanes-policy.json');
  }

  const policy = readJson(policyPath);
  if (!Array.isArray(policy.requiredLanes) || policy.requiredLanes.length === 0) {
    fail('release-lanes-policy.json: requiredLanes must be a non-empty array.');
  }

  if (!policy.lanePromotion || typeof policy.lanePromotion !== 'object') {
    fail('release-lanes-policy.json: lanePromotion must be an object.');
  }

  if (!Array.isArray(policy.requiredReproducibilityInputs) || policy.requiredReproducibilityInputs.length === 0) {
    fail('release-lanes-policy.json: requiredReproducibilityInputs must be a non-empty array.');
  }

  return policy;
}

function parseCandidate() {
  if (!fs.existsSync(candidatePath)) {
    fail('Missing file: governance/release-lanes/release-candidate.json');
  }

  const candidate = readJson(candidatePath);

  if (!isSha256(candidate.lockfileSha256)) {
    fail('release-candidate.json: lockfileSha256 must be a 64-char lowercase hex SHA-256.');
  }
  if (!isSha256(candidate.workspaceFingerprintSha256)) {
    fail('release-candidate.json: workspaceFingerprintSha256 must be a 64-char lowercase hex SHA-256.');
  }
  if (!isSha256(candidate.bundleSha256)) {
    fail('release-candidate.json: bundleSha256 must be a 64-char lowercase hex SHA-256.');
  }

  return candidate;
}

function evaluateLane(lane, policy, candidate) {
  const errors = [];
  const manifestPath = path.join(repoRoot, 'governance', 'release-lanes', `${lane}.manifest.json`);

  if (!fs.existsSync(manifestPath)) {
    return {
      lane,
      manifestFile: path.relative(repoRoot, manifestPath),
      errors: [`Missing manifest for lane: ${lane}`],
      passed: false,
    };
  }

  const manifest = readJson(manifestPath);

  if (manifest.lane !== lane) {
    errors.push(`lane field must be "${lane}" (found "${String(manifest.lane)}").`);
  }

  const expectedPromotion = Object.prototype.hasOwnProperty.call(policy.lanePromotion, lane)
    ? policy.lanePromotion[lane]
    : undefined;
  if (manifest.promotedFrom !== expectedPromotion) {
    errors.push(`promotedFrom must be ${JSON.stringify(expectedPromotion)} (found ${JSON.stringify(manifest.promotedFrom)}).`);
  }

  if (policy.requireImmutableArtifacts && manifest.immutable !== true) {
    errors.push('immutable must be true.');
  }

  if (!manifest.artifact || typeof manifest.artifact !== 'object') {
    errors.push('artifact block is required.');
  }

  const artifactRelative = manifest.artifact?.file;
  const artifactSha = manifest.artifact?.sha256;
  const artifactWriteOnce = manifest.artifact?.writeOnce;

  let artifactResolved = null;
  let artifactComputedSha = null;
  if (typeof artifactRelative !== 'string' || artifactRelative.trim().length === 0) {
    errors.push('artifact.file must be a non-empty string.');
  } else {
    artifactResolved = path.resolve(repoRoot, artifactRelative);
    if (!artifactResolved.startsWith(path.join(repoRoot, 'governance', 'release-lanes', 'artifacts'))) {
      errors.push(`artifact.file must stay under governance/release-lanes/artifacts (found ${artifactRelative}).`);
    }
    if (!fs.existsSync(artifactResolved)) {
      errors.push(`artifact.file does not exist: ${artifactRelative}`);
    } else {
      artifactComputedSha = sha256File(artifactResolved);
    }
  }

  if (!isSha256(artifactSha)) {
    errors.push('artifact.sha256 must be a 64-char lowercase hex SHA-256.');
  }

  if (policy.requireImmutableArtifacts && artifactWriteOnce !== true) {
    errors.push('artifact.writeOnce must be true.');
  }

  if (artifactComputedSha && artifactSha && artifactComputedSha !== artifactSha) {
    errors.push(`artifact SHA mismatch (manifest ${artifactSha} vs computed ${artifactComputedSha}).`);
  }

  if (policy.requireHashedArtifactFilenames && artifactResolved && artifactSha) {
    const baseName = path.basename(artifactResolved);
    if (!baseName.includes(artifactSha)) {
      errors.push(`artifact filename must include full SHA-256 (${baseName}).`);
    }
  }

  const reproducibility = manifest.reproducibility;
  if (!reproducibility || typeof reproducibility !== 'object') {
    errors.push('reproducibility block is required.');
  } else {
    for (const key of policy.requiredReproducibilityInputs) {
      if (!(key in reproducibility)) {
        errors.push(`reproducibility is missing required key: ${key}`);
      }
    }

    if (reproducibility.lockfileSha256 !== candidate.lockfileSha256) {
      errors.push('reproducibility.lockfileSha256 must match release-candidate.lockfileSha256.');
    }
    if (reproducibility.workspaceFingerprintSha256 !== candidate.workspaceFingerprintSha256) {
      errors.push('reproducibility.workspaceFingerprintSha256 must match release-candidate.workspaceFingerprintSha256.');
    }
    if (reproducibility.bundleSha256 !== candidate.bundleSha256) {
      errors.push('reproducibility.bundleSha256 must match release-candidate.bundleSha256.');
    }
  }

  if (manifest.releaseId !== candidate.releaseId) {
    errors.push('releaseId must match release-candidate.releaseId.');
  }

  return {
    lane,
    manifestFile: path.relative(repoRoot, manifestPath),
    artifactFile: typeof artifactRelative === 'string' ? artifactRelative : null,
    artifactSha256: artifactSha,
    computedArtifactSha256: artifactComputedSha,
    reproducibility,
    errors,
    passed: errors.length === 0,
  };
}

function main() {
  const policy = parsePolicy();
  const candidate = parseCandidate();

  const lockfilePath = path.join(repoRoot, 'pnpm-lock.yaml');
  if (!fs.existsSync(lockfilePath)) {
    fail('Missing file: pnpm-lock.yaml');
  }

  const lockfileSha256 = sha256File(lockfilePath);
  const workspaceFingerprint = computeWorkspaceFingerprint();

  const results = policy.requiredLanes.map((lane) => evaluateLane(lane, policy, candidate));
  const errors = [];

  if (candidate.lockfileSha256 !== lockfileSha256) {
    errors.push(`release-candidate.lockfileSha256 mismatch (candidate ${candidate.lockfileSha256} vs computed ${lockfileSha256}).`);
  }
  if (candidate.workspaceFingerprintSha256 !== workspaceFingerprint.sha256) {
    errors.push(
      `release-candidate.workspaceFingerprintSha256 mismatch (candidate ${candidate.workspaceFingerprintSha256} vs computed ${workspaceFingerprint.sha256}).`
    );
  }

  const laneErrors = results.flatMap((result) => result.errors.map((message) => `[${result.lane}] ${message}`));
  errors.push(...laneErrors);

  if (policy.requireSameBundleAcrossLanes) {
    const laneBundleSet = new Set(results.map((result) => result.artifactSha256).filter(Boolean));
    if (laneBundleSet.size !== 1) {
      errors.push(`Expected a single bundle hash across all lanes, found ${laneBundleSet.size}.`);
    }
    const onlyHash = laneBundleSet.values().next().value;
    if (typeof onlyHash === 'string' && onlyHash !== candidate.bundleSha256) {
      errors.push(`Lane bundle hash ${onlyHash} must match release-candidate.bundleSha256 ${candidate.bundleSha256}.`);
    }
  }

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    strictMode,
    check: 'MONO-02',
    policyFile: path.relative(repoRoot, policyPath),
    candidateFile: path.relative(repoRoot, candidatePath),
    reportFile: path.relative(repoRoot, reportPath),
    summary: {
      lanesRequired: policy.requiredLanes.length,
      lanesPassed: results.filter((result) => result.passed).length,
      lanesFailed: results.filter((result) => !result.passed).length,
      errors: errors.length,
    },
    computed: {
      lockfileSha256,
      workspaceFingerprintSha256: workspaceFingerprint.sha256,
      workspaceFingerprintInputs: workspaceFingerprint.inputs,
    },
    candidate,
    lanes: results,
    errors,
    ok: errors.length === 0,
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  globalThis.console.log('Monorepo release lane status:');
  globalThis.console.log(`- lanes required: ${report.summary.lanesRequired}`);
  globalThis.console.log(`- lanes passed: ${report.summary.lanesPassed}`);
  globalThis.console.log(`- lanes failed: ${report.summary.lanesFailed}`);
  globalThis.console.log(`- validation errors: ${report.summary.errors}`);
  globalThis.console.log(`- report: ${path.relative(repoRoot, reportPath)}`);

  if (jsonMode) {
    globalThis.console.log(JSON.stringify(report, null, 2));
  }

  if (strictMode && !report.ok) {
    for (const error of errors) {
      globalThis.console.error(error);
    }
    globalThis.process.exit(1);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  globalThis.console.error(`MONO-02 check failed: ${message}`);
  globalThis.process.exit(1);
}
