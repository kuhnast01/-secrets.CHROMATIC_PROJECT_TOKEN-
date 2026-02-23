import fs from 'node:fs';
import path from 'node:path';

const repoRoot = globalThis.process.cwd();
const matrixPath = path.join(repoRoot, 'GOVERNANCE_CONTROLS_MATRIX.md');
const expectedHeader = '| Control | Owner | Automation / Guard | Evidence artifact |';

let hasFailure = false;

function fail(message) {
  hasFailure = true;
  globalThis.console.error(message);
}

if (!fs.existsSync(matrixPath)) {
  fail('Missing file: GOVERNANCE_CONTROLS_MATRIX.md');
  globalThis.console.info('Recovery: Please create GOVERNANCE_CONTROLS_MATRIX.md using the template in docs/governance-controls-matrix-template.md or restore from version control.');
} else {
  const content = fs.readFileSync(matrixPath, 'utf8');
  const lines = content.split(/\r?\n/);

  const headerIndex = lines.findIndex((line) => line.trim() === expectedHeader);
  if (headerIndex < 0) {
    fail('GOVERNANCE_CONTROLS_MATRIX.md: missing expected controls table header.');
  } else {
    const separatorIndex = headerIndex + 1;
    if (!lines[separatorIndex] || !lines[separatorIndex].includes('---')) {
      fail('GOVERNANCE_CONTROLS_MATRIX.md: missing markdown separator line after table header.');
    }

    let rowCount = 0;
    for (let index = separatorIndex + 1; index < lines.length; index += 1) {
      const rawLine = lines[index];
      const line = rawLine.trim();

      if (!line.startsWith('|')) {
        if (rowCount > 0) {
          break;
        }
        continue;
      }

      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());

      if (cells.length !== 4) {
        fail(`GOVERNANCE_CONTROLS_MATRIX.md: row ${rowCount + 1} has ${cells.length} cells (expected 4).`);
        rowCount += 1;
        continue;
      }

      const [control, owner, automation, evidence] = cells;
      if (!control) fail(`GOVERNANCE_CONTROLS_MATRIX.md: row ${rowCount + 1} missing Control value.`);
      if (!owner) fail(`GOVERNANCE_CONTROLS_MATRIX.md: row ${rowCount + 1} missing Owner value.`);
      if (!automation) fail(`GOVERNANCE_CONTROLS_MATRIX.md: row ${rowCount + 1} missing Automation / Guard value.`);
      if (!evidence) fail(`GOVERNANCE_CONTROLS_MATRIX.md: row ${rowCount + 1} missing Evidence artifact value.`);

      rowCount += 1;
    }

    if (rowCount === 0) {
      fail('GOVERNANCE_CONTROLS_MATRIX.md: controls table has no data rows.');
    }
  }
}

if (hasFailure) {
  globalThis.process.exit(1);
}

globalThis.console.log('Governance controls matrix schema check passed.');
