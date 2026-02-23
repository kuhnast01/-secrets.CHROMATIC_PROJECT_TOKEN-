import crypto from 'node:crypto';
import console from 'node:console';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

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

function walkFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const results = [];
  const stack = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  }

  return results.sort((left, right) => left.localeCompare(right));
}

function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  const data = fs.readFileSync(filePath);
  hash.update(data);
  return hash.digest('hex');
}

function utcTimestampCompact(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function signManifest(manifestPath, privateKeyPem) {
  const manifestBytes = fs.readFileSync(manifestPath);
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(manifestBytes);
  signer.end();

  const signature = signer.sign(privateKeyPem).toString('base64');
  const signaturePath = `${manifestPath}.sig`;
  fs.writeFileSync(signaturePath, `${signature}\n`, 'utf8');
  return signaturePath;
}

function buildManifest({ component, sourceDir, files }) {
  const now = new Date();

  return {
    schemaVersion: 1,
    generatedAt: now.toISOString(),
    generatedAtCompact: utcTimestampCompact(now),
    component,
    sourceDir,
    repository: process.env.GITHUB_REPOSITORY ?? null,
    ref: process.env.GITHUB_REF ?? null,
    sha: process.env.GITHUB_SHA ?? null,
    runId: process.env.GITHUB_RUN_ID ?? null,
    runNumber: process.env.GITHUB_RUN_NUMBER ?? null,
    files,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const component = (args.component ?? 'unknown').trim();
  const sourceDir = path.resolve(args.inputDir ?? 'release-artifacts');
  const outputPath = path.resolve(
    args.output ?? path.join('governance-artifacts', `release-provenance-${component}.json`),
  );

  const files = walkFiles(sourceDir).map((filePath) => {
    const stats = fs.statSync(filePath);
    return {
      path: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
      sizeBytes: stats.size,
      sha256: sha256File(filePath),
    };
  });

  const manifest = buildManifest({
    component,
    sourceDir: path.relative(process.cwd(), sourceDir).replace(/\\/g, '/'),
    files,
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  let signaturePath = null;
  const signingEnabled = (process.env.PROVENANCE_ENABLE_SIGNING ?? '').toLowerCase() === 'true';
  const privateKeyPem = (process.env.PROVENANCE_SIGNING_PRIVATE_KEY ?? '').trim();

  if (signingEnabled) {
    if (!privateKeyPem) {
      console.warn('PROVENANCE_ENABLE_SIGNING=true but PROVENANCE_SIGNING_PRIVATE_KEY is missing. Skipping signature generation.');
    } else {
      signaturePath = signManifest(outputPath, privateKeyPem);
    }
  }

  const summary = {
    schemaVersion: 1,
    component,
    sourceDir: manifest.sourceDir,
    manifestPath: path.relative(process.cwd(), outputPath).replace(/\\/g, '/'),
    signaturePath: signaturePath
      ? path.relative(process.cwd(), signaturePath).replace(/\\/g, '/')
      : null,
    fileCount: files.length,
    totalBytes: files.reduce((accumulator, item) => accumulator + item.sizeBytes, 0),
  };

  console.log(JSON.stringify(summary, null, 2));
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : 'unknown_error';
  console.error(JSON.stringify({ error: message }, null, 2));
  process.exit(1);
}
