// Code tool implementation for Poseidon agent
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
export class LocalCodeTool {
    async runTests(targetPath = '.') {
        try {
            const { stdout, stderr } = await execAsync(`npx jest ${targetPath}`);
            return { success: true, output: stdout + stderr };
        }
        catch (err) {
            return { success: false, output: err.stdout + err.stderr };
        }
    }
    async runLint(targetPath = '.') {
        try {
            const { stdout, stderr } = await execAsync(`npx eslint ${targetPath}`);
            return { success: true, output: stdout + stderr };
        }
        catch (err) {
            return { success: false, output: err.stdout + err.stderr };
        }
    }
    async runBuild(targetPath = '.') {
        try {
            const { stdout, stderr } = await execAsync(`npm run build --workspace ${targetPath}`);
            return { success: true, output: stdout + stderr };
        }
        catch (err) {
            return { success: false, output: err.stdout + err.stderr };
        }
    }
}
