// Tool execution sandbox and diff generation for Poseidon agent
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ToolSandbox {
  constructor(private root: string) {}

  resolveSafePath(target: string): string {
    const resolved = path.resolve(this.root, target);
    if (!resolved.startsWith(this.root)) {
      throw new Error('Unsafe path: outside sandbox root');
    }
    return resolved;
  }

  async runInSandbox<T>(fn: (sandboxRoot: string) => Promise<T>): Promise<T> {
    return fn(this.root);
  }
}

export async function generateDiff(fileA: string, fileB: string): Promise<string> {
  // Use git diff --no-index for arbitrary files
  const { stdout, stderr } = await execAsync(`git diff --no-index --color=always "${fileA}" "${fileB}"`);
  return stdout + stderr;
}
