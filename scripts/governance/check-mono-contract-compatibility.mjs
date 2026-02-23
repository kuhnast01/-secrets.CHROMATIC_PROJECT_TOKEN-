/* global process, console */

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const strictMode = process.argv.includes('--strict');
const jsonMode = process.argv.includes('--json');
const reportPath = path.join(repoRoot, 'governance-artifacts', 'mono-contract-compatibility-report.json');

const contracts = {
  api: {
    alias: '@api',
    root: path.join(repoRoot, 'packages', 'api', 'src'),
    packageFile: path.join(repoRoot, 'packages', 'api', 'package.json'),
  },
  models: {
    alias: '@models',
    root: path.join(repoRoot, 'packages', 'models', 'src'),
    packageFile: path.join(repoRoot, 'packages', 'models', 'package.json'),
  },
};

const surfaces = [
  {
    name: 'backend',
    sourceRoot: path.join(repoRoot, 'backend', 'src'),
    packageFile: path.join(repoRoot, 'backend', 'package.json'),
    tsconfigFile: path.join(repoRoot, 'backend', 'tsconfig.json'),
  },
  {
    name: 'admin-panel',
    sourceRoot: path.join(repoRoot, 'apps', 'admin-panel', 'src'),
    packageFile: path.join(repoRoot, 'apps', 'admin-panel', 'package.json'),
    tsconfigFile: path.join(repoRoot, 'apps', 'admin-panel', 'tsconfig.json'),
  },
  {
    name: 'admin-dashboard',
    sourceRoot: path.join(repoRoot, 'apps', 'admin-dashboard', 'src'),
    packageFile: path.join(repoRoot, 'apps', 'admin-dashboard', 'package.json'),
    tsconfigFile: path.join(repoRoot, 'apps', 'admin-dashboard', 'tsconfig.json'),
  },
  {
    name: 'web',
    sourceRoot: path.join(repoRoot, 'apps', 'web', 'src'),
    packageFile: path.join(repoRoot, 'apps', 'web', 'package.json'),
    tsconfigFile: path.join(repoRoot, 'apps', 'web', 'tsconfig.app.json'),
  },
  {
    name: 'mobile',
    sourceRoot: path.join(repoRoot, 'apps', 'mobile', 'src'),
    packageFile: path.join(repoRoot, 'apps', 'mobile', 'package.json'),
    tsconfigFile: path.join(repoRoot, 'apps', 'mobile', 'tsconfig.json'),
  },
];

function stripJsonComments(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s+)\/\/.*$/gm, '$1');
}

function readJsonWithComments(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(stripJsonComments(raw));
  }
}

function walkFiles(rootDir, entries = []) {
  if (!fs.existsSync(rootDir)) return entries;
  const children = fs.readdirSync(rootDir, { withFileTypes: true });

  for (const child of children) {
    if (child.name === 'node_modules' || child.name === 'dist' || child.name === '.next') {
      continue;
    }

    const fullPath = path.join(rootDir, child.name);
    if (child.isDirectory()) {
      walkFiles(fullPath, entries);
      continue;
    }

    if (/\.(ts|tsx|js|jsx)$/.test(child.name)) {
      entries.push(fullPath);
    }
  }

  return entries;
}

function collectImports(fileContent) {
  const imports = [];
  const pattern = /(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)/g;
  let match;
  while ((match = pattern.exec(fileContent)) !== null) {
    const specifier = match[1] || match[2];
    if (specifier) imports.push(specifier);
  }
  return imports;
}

function normalizeContractSubpath(subpath) {
  if (!subpath || subpath === '.') return '';
  return subpath.startsWith('src/') ? subpath.slice(4) : subpath;
}

function resolveContractImport(specifier) {
  const mapping = [
    { key: 'api', alias: '@api', root: contracts.api.root },
    { key: 'models', alias: '@models', root: contracts.models.root },
  ];

  for (const contract of mapping) {
    if (specifier === contract.alias) {
      return { contract: contract.key, basePath: path.join(contract.root, 'index') };
    }

    if (specifier.startsWith(`${contract.alias}/`)) {
      const sub = normalizeContractSubpath(specifier.slice(contract.alias.length + 1));
      return { contract: contract.key, basePath: path.join(contract.root, sub) };
    }
  }

  return null;
}

function resolveExistingModule(basePath) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.d.ts`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
    path.join(basePath, 'index.d.ts'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function evaluateSurface(surface) {
  const errors = [];
  const sourceFiles = walkFiles(surface.sourceRoot);
  const imports = new Map();

  for (const filePath of sourceFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const specifier of collectImports(content)) {
      if (!specifier.startsWith('@api') && !specifier.startsWith('@models')) {
        continue;
      }

      const key = `${filePath}::${specifier}`;
      imports.set(key, { filePath, specifier });
    }
  }

  const tsconfig = fs.existsSync(surface.tsconfigFile)
    ? readJsonWithComments(surface.tsconfigFile)
    : { compilerOptions: {} };
  const pathMap = tsconfig?.compilerOptions?.paths || {};

  const resolved = [];

  for (const { filePath, specifier } of imports.values()) {
    const resolution = resolveContractImport(specifier);

    if (!resolution) {
      errors.push(`${path.relative(repoRoot, filePath)} imports unsupported contract alias: ${specifier}`);
      continue;
    }

    const resolvedPath = resolveExistingModule(resolution.basePath);
    if (!resolvedPath) {
      errors.push(`${path.relative(repoRoot, filePath)} unresolved contract import: ${specifier}`);
      continue;
    }

    if (specifier === '@api' && !pathMap['@api']) {
      errors.push(`${surface.name} missing tsconfig paths mapping for @api`);
    }
    if (specifier.startsWith('@api/') && !pathMap['@api/*']) {
      errors.push(`${surface.name} missing tsconfig paths mapping for @api/*`);
    }
    if (specifier === '@models' && !pathMap['@models']) {
      errors.push(`${surface.name} missing tsconfig paths mapping for @models`);
    }
    if (specifier.startsWith('@models/') && !pathMap['@models/*']) {
      errors.push(`${surface.name} missing tsconfig paths mapping for @models/*`);
    }

    resolved.push({
      sourceFile: path.relative(repoRoot, filePath),
      specifier,
      resolvedTo: path.relative(repoRoot, resolvedPath),
      contract: resolution.contract,
    });
  }

  return {
    name: surface.name,
    sourceRoot: path.relative(repoRoot, surface.sourceRoot),
    sourceFilesScanned: sourceFiles.length,
    contractImportsFound: resolved.length,
    resolved,
    errors,
    passed: errors.length === 0,
  };
}

function main() {
  const contractMeta = Object.entries(contracts).map(([key, value]) => {
    if (!fs.existsSync(value.packageFile)) {
      throw new Error(`Missing contract package file: ${path.relative(repoRoot, value.packageFile)}`);
    }
    const packageJson = readJsonWithComments(value.packageFile);
    return {
      contract: key,
      alias: value.alias,
      packageName: packageJson.name,
      packageVersion: packageJson.version,
      root: path.relative(repoRoot, value.root),
    };
  });

  const results = surfaces.map(evaluateSurface);
  const errors = results.flatMap((surface) => surface.errors.map((error) => `[${surface.name}] ${error}`));

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    strictMode,
    check: 'MONO-01',
    contracts: contractMeta,
    summary: {
      surfacesChecked: results.length,
      surfacesPassed: results.filter((item) => item.passed).length,
      surfacesFailed: results.filter((item) => !item.passed).length,
      errors: errors.length,
    },
    surfaces: results,
    errors,
    ok: errors.length === 0,
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('Monorepo contract compatibility status:');
  console.log(`- surfaces checked: ${report.summary.surfacesChecked}`);
  console.log(`- surfaces passed: ${report.summary.surfacesPassed}`);
  console.log(`- surfaces failed: ${report.summary.surfacesFailed}`);
  console.log(`- import resolution errors: ${report.summary.errors}`);
  console.log(`- report: ${path.relative(repoRoot, reportPath)}`);

  if (jsonMode) {
    console.log(JSON.stringify(report, null, 2));
  }

  if (strictMode && !report.ok) {
    for (const error of errors) {
      console.error(error);
    }
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`MONO-01 check failed: ${message}`);
  process.exit(1);
}
