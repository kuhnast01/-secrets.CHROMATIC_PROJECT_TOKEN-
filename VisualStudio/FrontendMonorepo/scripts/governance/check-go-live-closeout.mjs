import fs from 'node:fs';
import path from 'node:path';

const repoRoot = globalThis.process.cwd();
const closeoutPath = path.join(repoRoot, 'GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md');
const reportPath = path.join(repoRoot, 'governance-artifacts', 'go-live-closeout-report.json');

const strictMode = globalThis.process.argv.includes('--strict');
const jsonMode = globalThis.process.argv.includes('--json');

const sectionPattern = /^##\s+(\d+)\)\s+(.+)$/gm;
const checkboxPattern = /^- \[(x| )\] /gim;
const evidenceLinePattern = /^\s*-\s+[^:]+:\s*(.*)$/gm;

function readCloseout() {
  if (!fs.existsSync(closeoutPath)) {
    throw new Error('Missing closeout file: GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md');
  }
  return fs.readFileSync(closeoutPath, 'utf8');
}

function collectSections(content) {
  const matches = [...content.matchAll(sectionPattern)];
  const validationHeaderIndex = content.indexOf('## Validation Commands');
  return matches
    .filter((match) => Number(match[1]) >= 1 && Number(match[1]) <= 5)
    .map((match, index) => {
      const start = match.index ?? 0;
      const nextSectionStart = index + 1 < matches.length ? (matches[index + 1].index ?? content.length) : content.length;
      const end = validationHeaderIndex > start ? Math.min(nextSectionStart, validationHeaderIndex) : nextSectionStart;
      const body = content.slice(start, end);
      return {
        number: Number(match[1]),
        title: match[2].trim(),
        body,
      };
    });
}

function analyzeSection(section) {
  const checkboxes = [...section.body.matchAll(checkboxPattern)];
  const completedCount = checkboxes.filter((entry) => entry[1].toLowerCase() === 'x').length;
  const totalCount = checkboxes.length;

  const evidenceBlockStart = section.body.indexOf('Evidence links:');
  let evidenceItems = [];
  if (evidenceBlockStart >= 0) {
    const evidenceBlock = section.body.slice(evidenceBlockStart);
    evidenceItems = [...evidenceBlock.matchAll(evidenceLinePattern)]
      .map((match) => (match[1] || '').trim())
      .filter((value) => value.length > 0);
  }

  const hasRealEvidence = evidenceItems.some((item) => /\[[^\]]+\]\([^\)]+\)|https?:\/\//.test(item));

  return {
    ...section,
    completedCount,
    totalCount,
    evidenceItems,
    hasRealEvidence,
  };
}

function writeReport(report) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
}

function main() {
  let content = '';
  try {
    content = readCloseout();
  } catch (error) {
    globalThis.console.error(String(error.message || error));
    globalThis.process.exit(1);
  }

  const sections = collectSections(content).map(analyzeSection);
  if (sections.length !== 5) {
    globalThis.console.error(`Expected 5 action sections (1-5), found ${sections.length}.`);
    globalThis.process.exit(1);
  }

  const summary = sections.map((entry) => ({
    number: entry.number,
    title: entry.title,
    completed: entry.completedCount,
    total: entry.totalCount,
    isComplete: entry.totalCount > 0 && entry.completedCount === entry.totalCount,
    hasRealEvidence: entry.hasRealEvidence,
  }));

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    strictMode,
    closeoutFile: path.relative(repoRoot, closeoutPath),
    reportFile: path.relative(repoRoot, reportPath),
    sections: summary,
    strictFailures: [],
  };

  globalThis.console.log('Governance go-live closeout status:');
  for (const item of summary) {
    globalThis.console.log(`- ${item.number}) ${item.title}: ${item.completed}/${item.total} complete${item.hasRealEvidence ? ' | evidence-linked' : ''}`);
  }

  if (!strictMode) {
    globalThis.console.log('Closeout structure check passed. Use --strict to enforce full completion and evidence.');
    report.ok = true;
    writeReport(report);
    globalThis.console.log(`Closeout report written: ${path.relative(repoRoot, reportPath)}`);
    if (jsonMode) {
      globalThis.console.log(JSON.stringify(report, null, 2));
    }
    return;
  }

  const strictFailures = [];
  for (const item of sections) {
    if (item.totalCount === 0) {
      strictFailures.push(`Section ${item.number} has no checklist items.`);
      continue;
    }
    if (item.completedCount !== item.totalCount) {
      strictFailures.push(`Section ${item.number} is not complete (${item.completedCount}/${item.totalCount}).`);
    }
    if (!item.hasRealEvidence) {
      strictFailures.push(`Section ${item.number} is missing linked evidence.`);
    }
  }

  report.strictFailures = strictFailures;
  report.ok = strictFailures.length === 0;
  writeReport(report);
  globalThis.console.log(`Closeout report written: ${path.relative(repoRoot, reportPath)}`);

  if (jsonMode) {
    globalThis.console.log(JSON.stringify(report, null, 2));
  }

  if (strictFailures.length > 0) {
    for (const failure of strictFailures) {
      globalThis.console.error(failure);
    }
    globalThis.process.exit(1);
  }

  globalThis.console.log('Closeout strict check passed.');
}

main();
