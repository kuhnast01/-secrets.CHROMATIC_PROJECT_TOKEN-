import fs from 'node:fs';
import readline from 'node:readline';
import { OutputFormat, renderSummary, summarizeLicenseEvents } from './lib/license-event-summary';

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

function getOutputFormat(value: string | undefined): OutputFormat {
  if (!value) return 'json';
  const normalized = value.trim().toLowerCase();
  if (normalized === 'json' || normalized === 'csv') {
    return normalized;
  }
  throw new Error('Invalid --format value. Use json or csv.');
}

function emitOutput(content: string, outPath: string | undefined): void {
  if (!outPath) {
    console.log(content);
    return;
  }

  fs.writeFileSync(outPath, content, { encoding: 'utf8' });
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
  const format = getOutputFormat(args.format);

  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  const lines: string[] = [];

  for await (const line of rl) {
    lines.push(line);
  }

  const result = summarizeLicenseEvents({ lines, sinceHours });
  emitOutput(renderSummary(result, format), args.out);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'unknown_error';
  console.error(JSON.stringify({ error: message }, null, 2));
  process.exit(1);
});
