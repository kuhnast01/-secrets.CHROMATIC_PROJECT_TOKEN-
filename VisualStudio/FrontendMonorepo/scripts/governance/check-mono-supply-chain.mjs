import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = globalThis.process.cwd();
const strictMode = globalThis.process.argv.includes('--strict');
const jsonMode = globalThis.process.argv.includes('--json');

const policyPath = path.join(repoRoot, 'governance', 'policies', 'supply-chain-policy.json');
const sbomPath = path.join(repoRoot, 'governance-artifacts', 'mono-sbom.json');
const reportPath = path.join(repoRoot, 'governance-artifacts', 'mono-supply-chain-report.json');
const lockfilePath = path.join(repoRoot, 'pnpm-lock.yaml');
const rootPackageJsonPath = path.join(repoRoot, 'package.json');

const dependencySections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function normalizePath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function listWorkspaceManifestPaths() {
  const roots = [
    rootPackageJsonPath,
    path.join(repoRoot, 'backend', 'package.json'),
    path.join(repoRoot, 'poseidon-desktop', 'package.json'),
    path.join(repoRoot, 'poseidon-desktop', 'renderer', 'package.json'),
  ];

  const dynamicRoots = [
    { baseDir: path.join(repoRoot, 'apps'), includeNested: false },
    { baseDir: path.join(repoRoot, 'packages'), includeNested: false },
  ];

  for (const target of dynamicRoots) {
    if (!fs.existsSync(target.baseDir)) continue;
    const entries = fs.readdirSync(target.baseDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const manifest = path.join(target.baseDir, entry.name, 'package.json');
      roots.push(manifest);
    }
  }

  return [...new Set(roots.filter((filePath) => fs.existsSync(filePath)))].sort((a, b) => a.localeCompare(b));
}

function parsePolicy() {
  if (!fs.existsSync(policyPath)) {
    fail('Missing file: governance/policies/supply-chain-policy.json');
  }

  const policy = readJson(policyPath);

  if (!Array.isArray(policy.disallowedVersionLiterals)) {
    fail('supply-chain-policy.json: disallowedVersionLiterals must be an array.');
  }

  if (!Array.isArray(policy.disallowedSpecProtocols)) {
    fail('supply-chain-policy.json: disallowedSpecProtocols must be an array.');
  }

  if (typeof policy.requirePnpmPackageManager !== 'boolean') {
    fail('supply-chain-policy.json: requirePnpmPackageManager must be boolean.');
  }

  if (typeof policy.requirePnpmLockfile !== 'boolean') {
    fail('supply-chain-policy.json: requirePnpmLockfile must be boolean.');
  }

  if (!Number.isInteger(policy.minComponentCount) || policy.minComponentCount < 1) {
    fail('supply-chain-policy.json: minComponentCount must be a positive integer.');
  }

  if (typeof policy.allowWorkspaceProtocol !== 'boolean') {
    fail('supply-chain-policy.json: allowWorkspaceProtocol must be boolean.');
  }

  return policy;
}

function collectComponents(manifestPaths) {
  const components = [];
  const dependencyIndex = new Map();

  for (const manifestPath of manifestPaths) {
    const manifest = readJson(manifestPath);
    const packageName = typeof manifest.name === 'string' && manifest.name.trim().length > 0
      ? manifest.name
      : normalizePath(manifestPath);
    const packageVersion = typeof manifest.version === 'string' ? manifest.version : '0.0.0';

    const deps = [];
    for (const section of dependencySections) {
      const source = manifest[section];
      if (!source || typeof source !== 'object') continue;

      const names = Object.keys(source).sort((a, b) => a.localeCompare(b));
      for (const name of names) {
        const spec = String(source[name]);
        deps.push({
          name,
          spec,
          scope: section,
          purl: `pkg:npm/${encodeURIComponent(name)}@${encodeURIComponent(spec)}`,
        });

        if (!dependencyIndex.has(name)) {
          dependencyIndex.set(name, {
            name,
            specs: new Set(),
            consumers: new Set(),
            scopes: new Set(),
          });
        }

        const entry = dependencyIndex.get(name);
        entry.specs.add(spec);
        entry.consumers.add(packageName);
        entry.scopes.add(section);
      }
    }

    components.push({
      name: packageName,
      version: packageVersion,
      manifestPath: normalizePath(manifestPath),
      dependencyCount: deps.length,
      dependencies: deps,
    });
  }

  const index = [...dependencyIndex.values()]
    .map((entry) => ({
      name: entry.name,
      specs: [...entry.specs].sort((a, b) => a.localeCompare(b)),
      consumers: [...entry.consumers].sort((a, b) => a.localeCompare(b)),
      scopes: [...entry.scopes].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { components, dependencyIndex: index };
}

function evaluatePolicy({ policy, components, manifestPaths }) {
  const errors = [];
  const warnings = [];

  const disallowedVersionSet = new Set(policy.disallowedVersionLiterals.map((value) => String(value).toLowerCase()));
  const disallowedProtocols = policy.disallowedSpecProtocols.map((value) => String(value).toLowerCase());

  if (policy.requirePnpmLockfile && !fs.existsSync(lockfilePath)) {
    errors.push('Missing required lockfile: pnpm-lock.yaml');
  }

  if (policy.requirePnpmPackageManager) {
    const rootManifest = readJson(rootPackageJsonPath);
    if (typeof rootManifest.packageManager !== 'string' || !rootManifest.packageManager.startsWith('pnpm@')) {
      errors.push('Root package.json must declare packageManager as pnpm@<version>.');
    }
  }

  if (components.length < policy.minComponentCount) {
    errors.push(`Expected at least ${policy.minComponentCount} SBOM components, found ${components.length}.`);
  }

  for (const manifestPath of manifestPaths) {
    const manifest = readJson(manifestPath);
    const manifestDisplay = normalizePath(manifestPath);

    for (const section of dependencySections) {
      const source = manifest[section];
      if (!source || typeof source !== 'object') continue;

      for (const [pkg, rawSpec] of Object.entries(source)) {
        const spec = String(rawSpec).trim();
        const specLower = spec.toLowerCase();

        if (disallowedVersionSet.has(specLower)) {
          errors.push(`[${manifestDisplay}] ${section}.${pkg} uses disallowed literal version "${spec}".`);
        }

        const isWorkspaceSpec = specLower.startsWith('workspace:');
        if (isWorkspaceSpec && policy.allowWorkspaceProtocol) {
          continue;
        }

        for (const protocol of disallowedProtocols) {
          if (specLower.startsWith(protocol)) {
            errors.push(`[${manifestDisplay}] ${section}.${pkg} uses disallowed protocol "${protocol}" via "${spec}".`);
          }
        }

        if (!isWorkspaceSpec && !/^[~^]?\d+\.\d+\.\d+/.test(spec) && !/^[<>]=?\s*\d+\.\d+\.\d+/.test(spec)) {
          warnings.push(`[${manifestDisplay}] ${section}.${pkg} uses non-standard semver range "${spec}".`);
        }
      }
    }
  }

  return { errors, warnings };
}

function main() {
  const policy = parsePolicy();
  const manifestPaths = listWorkspaceManifestPaths();
  const { components, dependencyIndex } = collectComponents(manifestPaths);
  const policyResult = evaluatePolicy({ policy, components, manifestPaths });

  const lockfileSha256 = fs.existsSync(lockfilePath) ? sha256File(lockfilePath) : null;

  const sbom = {
    schemaVersion: 1,
    format: 'poseidon-sbom-v1',
    generatedAt: new Date().toISOString(),
    check: 'MONO-03',
    lockfile: {
      path: 'pnpm-lock.yaml',
      sha256: lockfileSha256,
    },
    componentCount: components.length,
    dependencyNameCount: dependencyIndex.length,
    components,
    dependencyIndex,
  };

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    strictMode,
    check: 'MONO-03',
    policyFile: normalizePath(policyPath),
    sbomFile: normalizePath(sbomPath),
    reportFile: normalizePath(reportPath),
    summary: {
      manifestsScanned: manifestPaths.length,
      components: components.length,
      dependencyNames: dependencyIndex.length,
      errors: policyResult.errors.length,
      warnings: policyResult.warnings.length,
    },
    lockfile: {
      path: 'pnpm-lock.yaml',
      sha256: lockfileSha256,
      present: fs.existsSync(lockfilePath),
    },
    policy,
    errors: policyResult.errors,
    warnings: policyResult.warnings,
    ok: policyResult.errors.length === 0,
  };

  fs.mkdirSync(path.dirname(sbomPath), { recursive: true });
  fs.writeFileSync(sbomPath, JSON.stringify(sbom, null, 2), 'utf8');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  globalThis.console.log('Monorepo supply-chain status:');
  globalThis.console.log(`- manifests scanned: ${report.summary.manifestsScanned}`);
  globalThis.console.log(`- SBOM components: ${report.summary.components}`);
  globalThis.console.log(`- dependency names: ${report.summary.dependencyNames}`);
  globalThis.console.log(`- policy errors: ${report.summary.errors}`);
  globalThis.console.log(`- policy warnings: ${report.summary.warnings}`);
  globalThis.console.log(`- SBOM artifact: ${normalizePath(sbomPath)}`);
  globalThis.console.log(`- report artifact: ${normalizePath(reportPath)}`);

  if (jsonMode) {
    globalThis.console.log(JSON.stringify(report, null, 2));
  }

  if (strictMode && !report.ok) {
    for (const error of report.errors) {
      globalThis.console.error(error);
    }
    globalThis.process.exit(1);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  globalThis.console.error(`MONO-03 check failed: ${message}`);
  globalThis.process.exit(1);
}
