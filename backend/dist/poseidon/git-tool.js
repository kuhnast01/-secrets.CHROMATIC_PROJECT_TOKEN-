"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalGitTool = void 0;
// Git tool implementation for Poseidon agent
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class LocalGitTool {
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
exports.LocalGitTool = LocalGitTool;
