// Code tool implementation for Poseidon agent
import { exec } from 'child_process';
import { promisify } from 'util';
import { CodeTool } from './tool-interfaces';

const execAsync = promisify(exec);

export class LocalCodeTool implements CodeTool {
  async runTests(targetPath = '.'): Promise<{ success: boolean; output: string }> {
    try {
      const { stdout, stderr } = await execAsync(`npx jest ${targetPath}`);
      return { success: true, output: stdout + stderr };
    } catch (err: any) {
      return { success: false, output: err.stdout + err.stderr };
    }
  }

  async runLint(targetPath = '.'): Promise<{ success: boolean; output: string }> {
    try {
      const { stdout, stderr } = await execAsync(`npx eslint ${targetPath}`);
      return { success: true, output: stdout + stderr };
    } catch (err: any) {
      return { success: false, output: err.stdout + err.stderr };
    }
  }

  async runBuild(targetPath = '.'): Promise<{ success: boolean; output: string }> {
    try {
      const { stdout, stderr } = await execAsync(`npm run build --workspace ${targetPath}`);
      return { success: true, output: stdout + stderr };
    } catch (err: any) {
      return { success: false, output: err.stdout + err.stderr };
    }
  }
}
