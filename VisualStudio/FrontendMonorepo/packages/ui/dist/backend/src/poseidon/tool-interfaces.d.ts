export interface FileTool {
    readFile(path: string): Promise<string>;
    writeFile(path: string, content: string): Promise<void>;
    createFile(path: string, content?: string): Promise<void>;
    deleteFile(path: string): Promise<void>;
    moveFile(src: string, dest: string): Promise<void>;
    createFolder(path: string): Promise<void>;
}
export interface CodeTool {
    runTests(targetPath?: string): Promise<{
        success: boolean;
        output: string;
    }>;
    runLint(targetPath?: string): Promise<{
        success: boolean;
        output: string;
    }>;
    runBuild(targetPath?: string): Promise<{
        success: boolean;
        output: string;
    }>;
}
export interface GitTool {
    status(): Promise<string>;
    diff(targetPath?: string): Promise<string>;
    commit(message: string, files?: string[]): Promise<string>;
}
export interface ToolExecutionContext {
    user: string;
    sandboxRoot: string;
    allowWrites: boolean;
}
