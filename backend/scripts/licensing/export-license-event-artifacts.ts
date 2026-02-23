import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';
import {
  OutputFormat,
  renderSummary,
  summarizeLicenseEvents,
} from './lib/license-event-summary';

type ArgMap = Record<string, string>;

function parseArgs(argv: string[]): ArgMap {
  return argv.reduce<ArgMap>((acc, item) => {
    const [key, value] = item.split('=');
    if (key?.startsWith('--') && value !== undefined) {
      acc[key.slice(2)] = value;
    }
    return acc;
  }, {});
}

function toNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getFormats(value: string | undefined): OutputFormat[] {
  const normalized = (value ?? 'both').trim().toLowerCase();
  if (normalized === 'both') return ['json', 'csv'];
  if (normalized === 'json' || normalized === 'csv') return [normalized];
  throw new Error('Invalid --format value. Use json, csv, or both.');
}

function utcTimestampCompact(date: Date): string {
  const iso = date.toISOString();
  return iso.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const filePath = args.file;

  if (!filePath) {
    console.error('Provide --file=<path-to-log.ndjson>');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Log file not found: ${filePath}`);
    process.exit(1);
  }

  const sinceHours = toNumber(args.sinceHours, 24);
  const formats = getFormats(args.format);
  const outDir = args.outDir ?? 'stress-artifacts';

  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  const lines: string[] = [];

  for await (const line of rl) {
    lines.push(line);
  }

  const now = new Date();
  const timestamp = utcTimestampCompact(now);
  const result = summarizeLicenseEvents({ lines, sinceHours, nowMs: now.getTime() });

  fs.mkdirSync(outDir, { recursive: true });

  const outputs: Array<{ format: OutputFormat; path: string }> = [];
  for (const format of formats) {
    const ext = format === 'json' ? 'json' : 'csv';
    const outPath = path.join(outDir, `license-events-summary-${timestamp}.${ext}`);
    fs.writeFileSync(outPath, renderSummary(result, format), { encoding: 'utf8' });
    outputs.push({ format, path: outPath });
  }

  console.log(
    JSON.stringify(
      {
        schemaVersion: 1,
        timestamp,
        sinceHours,
        sourceFile: filePath,
        outputs,
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'unknown_error';
  console.error(JSON.stringify({ error: message }, null, 2));
  process.exit(1);
});
