import axios from 'axios';
import fs from 'node:fs';

type ArgMap = Record<string, string>;

type ValidateResponse = {
  valid: boolean;
  reason: string | null;
  revoked: boolean;
  keyHash: string;
};

function parseArgs(argv: string[]): ArgMap {
  return argv.reduce<ArgMap>((acc, item) => {
    const [key, value] = item.split('=');
    if (key?.startsWith('--') && value !== undefined) {
      acc[key.slice(2)] = value;
    }
    return acc;
  }, {});
}

function splitValues(raw: string): string[] {
  return raw
    .split(/[\r\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function loadKeys(args: ArgMap): string[] {
  const fromArg = args.license ?? '';
  const fromFile = args.file ? fs.readFileSync(args.file, 'utf8') : '';
  const fromStdin = process.stdin.isTTY ? '' : fs.readFileSync(0, 'utf8');

  const unique = new Set<string>([...splitValues(fromArg), ...splitValues(fromFile), ...splitValues(fromStdin)]);
  return Array.from(unique.values());
}

async function resolveToken(baseUrl: string, args: ArgMap): Promise<string> {
  if (args.token) return args.token;

  const username = args.username;
  const password = args.password;

  if (!username || !password) {
    throw new Error('Provide --token or both --username and --password');
  }

  const response = await axios.post<{ token: string }>(
    `${baseUrl}/auth/login`,
    { username, password },
    { timeout: 10000 },
  );

  if (!response.data?.token) {
    throw new Error('Login succeeded but token is missing in response');
  }

  return response.data.token;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = (args.baseUrl ?? 'http://127.0.0.1:4000').replace(/\/$/, '');
  const keys = loadKeys(args);

  if (keys.length === 0) {
    console.error('Provide keys using --license=..., --file=..., or stdin.');
    process.exit(1);
  }

  const token = await resolveToken(baseUrl, args);
  const headers = { Authorization: `Bearer ${token}` };

  const results: Array<ValidateResponse & { index: number }> = [];

  for (let index = 0; index < keys.length; index += 1) {
    const licenseKey = keys[index];
    const response = await axios.post<ValidateResponse>(
      `${baseUrl}/license/tools/validate`,
      { licenseKey },
      { headers, timeout: 10000 },
    );

    results.push({ index: index + 1, ...response.data });
  }

  const summary = {
    total: results.length,
    valid: results.filter((item) => item.valid).length,
    revoked: results.filter((item) => item.revoked).length,
    invalid: results.filter((item) => !item.valid).length,
    reasons: results.reduce<Record<string, number>>((acc, item) => {
      const key = item.reason ?? 'valid';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  };

  console.log(
    JSON.stringify(
      {
        summary,
        results,
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const body = error.response?.data;
    console.error(JSON.stringify({ error: 'request_failed', status, body }, null, 2));
    process.exit(1);
  }

  const message = error instanceof Error ? error.message : 'unknown_error';
  console.error(JSON.stringify({ error: message }, null, 2));
  process.exit(1);
});
