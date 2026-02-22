export declare class ToolSandbox {
    private root;
    constructor(root: string);
    resolveSafePath(target: string): string;
    runInSandbox<T>(fn: (sandboxRoot: string) => Promise<T>): Promise<T>;
}
export declare function generateDiff(fileA: string, fileB: string): Promise<string>;
