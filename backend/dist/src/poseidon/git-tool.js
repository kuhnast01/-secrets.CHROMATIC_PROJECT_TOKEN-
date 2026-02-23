// Git tool implementation for Poseidon agent
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
export class LocalGitTool {
    async status() {
        const { stdout, stderr } = await execAsync('git status --short --branch');
        return stdout + stderr;
    }
    async diff(targetPath = '.') {
        const { stdout, stderr } = await execAsync(`git diff ${targetPath}`);
        return stdout + stderr;
    }
    async commit(message, files) {
        if (files && files.length > 0) {
            await execAsync(`git add ${files.join(' ')}`);
        }
        else {
            await execAsync('git add .');
        }
        const { stdout, stderr } = await execAsync(`git commit -m "${message}"`);
        return stdout + stderr;
    }
}
