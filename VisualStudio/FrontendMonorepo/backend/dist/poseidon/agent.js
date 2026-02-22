"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoseidonAgent = void 0;
// Poseidon agent integrating all tools (Sprint 3)
const file_tool_1 = require("./file-tool");
const safe_file_tool_1 = require("./safe-file-tool");
const code_tool_1 = require("./code-tool");
const git_tool_1 = require("./git-tool");
const tool_sandbox_1 = require("./tool-sandbox");
class PoseidonAgent {
    constructor(context) {
        this.sandbox = new tool_sandbox_1.ToolSandbox(context.sandboxRoot);
        const localFileTool = new file_tool_1.LocalFileTool();
        this.fileTool = new safe_file_tool_1.SafeFileTool(localFileTool, context.allowWrites);
        this.codeTool = new code_tool_1.LocalCodeTool();
        this.gitTool = new git_tool_1.LocalGitTool();
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
exports.PoseidonAgent = PoseidonAgent;
