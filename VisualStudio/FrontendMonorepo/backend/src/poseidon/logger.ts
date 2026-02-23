// Simple logging and request history for Poseidon
import fs from 'fs/promises';
import path from 'path';

const LOG_FILE = path.resolve(__dirname, '../../poseidon_request_history.log');

export async function logPoseidonRequest(data: any) {
  const entry = {
    timestamp: new Date().toISOString(),
    ...data,
  };
  const line = JSON.stringify(entry) + '\n';
  await fs.appendFile(LOG_FILE, line, 'utf-8');
}

export async function getPoseidonRequestHistory(limit = 100) {
  try {
    const content = await fs.readFile(LOG_FILE, 'utf-8');
    const lines = content.trim().split('\n');
    return lines.slice(-limit).map(line => JSON.parse(line));
  } catch {
    return [];
  }
}
