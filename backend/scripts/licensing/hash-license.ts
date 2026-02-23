import fs from 'node:fs';
import { hashLicenseKey, normalizeLicenseKey } from '../../src/security/license';

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

function splitKeys(raw: string): string[] {
  return raw
    .split(/[\r\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function loadRawInput(args: ArgMap): string {
  if (args.license) {
    return args.license;
  }

  if (args.file) {
    return fs.readFileSync(args.file, 'utf8');
  }

  if (!process.stdin.isTTY) {
    return fs.readFileSync(0, 'utf8');
  }

  return '';
}

const args = parseArgs(process.argv.slice(2));
const rawInput = loadRawInput(args);

if (!rawInput.trim()) {
  console.error('Provide input via --license=..., --file=..., or stdin.');
  process.exit(1);
}

const uniqueKeys = Array.from(new Set(splitKeys(rawInput).map(normalizeLicenseKey)));
const hashes = uniqueKeys.map((key) => hashLicenseKey(key));

const output = {
  totalKeys: uniqueKeys.length,
  hashes,
  envValue: hashes.join(','),
};

console.log(JSON.stringify(output, null, 2));
