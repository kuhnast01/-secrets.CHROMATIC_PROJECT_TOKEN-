import fs from 'node:fs';
import path from 'node:path';
import { recordNamePattern, requiredReleaseRecordSnippets } from './release-record-schema.mjs';

const repoRoot = globalThis.process.cwd();
const releasesDir = path.join(repoRoot, 'legal', 'releases');
const allowedNonRecordFiles = new Set(['RETENTION_POLICY.md']);

function fail(message) {
  globalThis.console.error(message);
  globalThis.process.exitCode = 1;
}

if (!fs.existsSync(releasesDir)) {
  fail(`Missing releases directory: ${releasesDir}`);
  globalThis.process.exit(1);
}

const files = fs
  .readdirSync(releasesDir)
  .filter((name) => name.toLowerCase().endsWith('.md'))
  .sort();

const recordFiles = [];

for (const file of files) {
  if (allowedNonRecordFiles.has(file)) {
    continue;
  }

  if (!recordNamePattern.test(file)) {
    fail(`Invalid release record filename: ${file}. Expected LEGAL-BUNDLE-YYYYMMDD-X.Y.Z.md`);
    continue;
  }

  recordFiles.push(file);
}

if (recordFiles.length === 0) {
  fail('No legal release records found in legal/releases/.');
}

for (const file of recordFiles) {
  const fullPath = path.join(releasesDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const expectedBundleId = file.replace(/\.md$/i, '');

  for (const snippet of requiredReleaseRecordSnippets) {
    if (!content.includes(snippet)) {
      fail(`${file}: missing required section/field: ${snippet}`);
    }
  }

  const bundleIdLine = content
    .split(/\r?\n/)
    .find((line) => line.trim().startsWith('- Bundle ID:') || line.trim().startsWith('Bundle ID:'));

  if (!bundleIdLine || !bundleIdLine.includes(expectedBundleId)) {
    fail(`${file}: Bundle ID line must include ${expectedBundleId}`);
  }

  const versionMatch = file.match(recordNamePattern);
  if (versionMatch) {
    const expectedVersion = versionMatch[2];
    const versionLine = content
      .split(/\r?\n/)
      .find((line) => line.trim().startsWith('- Bundle version:') || line.trim().startsWith('Bundle version:'));

    if (!versionLine || !versionLine.includes(expectedVersion)) {
      fail(`${file}: Bundle version line must include ${expectedVersion}`);
    }
  }
}

if (globalThis.process.exitCode && globalThis.process.exitCode !== 0) {
  globalThis.process.exit(globalThis.process.exitCode);
}

globalThis.console.log(`Legal release record check passed (${recordFiles.length} record file(s) validated).`);
