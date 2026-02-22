// Git tool implementation for Poseidon agent
import { exec } from 'child_process';
import { promisify } from 'util';
import { GitTool } from './tool-interfaces';

const execAsync = promisify(exec);

export class LocalGitTool implements GitTool {
  async status(): Promise<string> {
    const { stdout, stderr } = await execAsync('git status --short --branch');
    return stdout + stderr;
  }

  async diff(targetPath = '.'): Promise<string> {
    const { stdout, stderr } = await execAsync(`git diff ${targetPath}`);
    return stdout + stderr;
  }

  async commit(message: string, files?: string[]): Promise<string> {
    if (files && files.length > 0) {
      await execAsync(`git add ${files.join(' ')}`);
    } else {
      await execAsync('git add .');
    }
    const { stdout, stderr } = await execAsync(`git commit -m "${message}"`);
    return stdout + stderr;
  }
}
