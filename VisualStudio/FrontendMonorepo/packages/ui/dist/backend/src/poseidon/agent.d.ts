import { SafeFileTool } from './safe-file-tool';
import { LocalCodeTool } from './code-tool';
import { LocalGitTool } from './git-tool';
import { ToolSandbox } from './tool-sandbox';
import { ToolExecutionContext } from './tool-interfaces';
export declare class PoseidonAgent {
    fileTool: SafeFileTool;
    codeTool: LocalCodeTool;
    gitTool: LocalGitTool;
    sandbox: ToolSandbox;
    constructor(context: ToolExecutionContext);
    safeWriteFile(relPath: string, content: string): Promise<void>;
    runTests(targetPath?: string): Promise<{
        success: boolean;
        output: string;
    }>;
    gitStatus(): Promise<string>;
}
