// Poseidon agent integrating all tools (Sprint 3)
import { LocalFileTool } from './file-tool';
import { SafeFileTool } from './safe-file-tool';
import { LocalCodeTool } from './code-tool';
import { LocalGitTool } from './git-tool';
import { ToolSandbox } from './tool-sandbox';
export class PoseidonAgent {
    constructor(context) {
        this.sandbox = new ToolSandbox(context.sandboxRoot);
        const localFileTool = new LocalFileTool();
        this.fileTool = new SafeFileTool(localFileTool, context.allowWrites);
        this.codeTool = new LocalCodeTool();
        this.gitTool = new LocalGitTool();
    }
    // Example: run a safe file write
    async safeWriteFile(relPath, content) {
        const absPath = this.sandbox.resolveSafePath(relPath);
        await this.fileTool.writeFile(absPath, content);
    }
    // Example: run tests in sandbox
    async runTests(targetPath = '.') {
        return this.codeTool.runTests(this.sandbox.resolveSafePath(targetPath));
    }
    // Example: get git status in sandbox
    async gitStatus() {
        return this.gitTool.status();
    }
}
