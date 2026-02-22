"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalCodeTool = void 0;
// Code tool implementation for Poseidon agent
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class LocalCodeTool {
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
exports.LocalCodeTool = LocalCodeTool;
