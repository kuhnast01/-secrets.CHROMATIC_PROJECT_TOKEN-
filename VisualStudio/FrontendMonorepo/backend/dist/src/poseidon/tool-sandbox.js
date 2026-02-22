import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
export class ToolSandbox {
    constructor(root) {
        this.root = root;
    }
    resolveSafePath(target) {
        const resolved = path.resolve(this.root, target);
        if (!resolved.startsWith(this.root)) {
            throw new Error('Unsafe path: outside sandbox root');
        }
        return resolved;
    }
    async runInSandbox(fn) {
        return fn(this.root);
    }
}
export async function generateDiff(fileA, fileB) {
    // Use git diff --no-index for arbitrary files
    const { stdout, stderr } = await execAsync(`git diff --no-index --color=always "${fileA}" "${fileB}"`);
    return stdout + stderr;
}
