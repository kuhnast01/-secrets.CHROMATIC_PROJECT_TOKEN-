type LabelSpec = {
    name: string;
    color: string;
    description: string;
};
type RepoContext = {
    owner: string;
    repo: string;
};
type CliOptions = {
    repoArg?: string;
    dryRun: boolean;
    listDefaults: boolean;
    help: boolean;
    json: boolean;
};
type JsonResult = {
    ok: boolean;
    mode: 'help' | 'list-defaults' | 'dry-run' | 'apply' | 'error';
    message?: string;
    errorType?: 'usage' | 'auth' | 'api' | 'unknown';
    exitCode?: number;
    repository?: string;
    dryRun?: boolean;
    labels?: LabelSpec[];
    missingLabels?: LabelSpec[];
    createdLabels?: string[];
    existingCount?: number;
};
declare class ToolError extends Error {
    readonly errorType: 'usage' | 'auth' | 'api';
    readonly exitCode: 2 | 3 | 4;
    constructor(message: string, errorType: 'usage' | 'auth' | 'api', exitCode: 2 | 3 | 4);
}
declare function usageError(message: string): ToolError;
declare function authError(message: string): ToolError;
declare function apiError(message: string): ToolError;
declare const DEFAULT_LABELS: LabelSpec[];
declare function parseRepoContext(raw?: string): RepoContext;
declare function printUsage(): void;
declare function printUsageJson(): void;
declare function printDefaultLabels(): void;
declare function emitJson(result: JsonResult): void;
declare function argvHasJsonFlag(argv: string[]): boolean;
declare function parseCliOptions(argv: string[]): CliOptions;
declare function requireToken(): string;
declare function githubRequest<T>(token: string, path: string, method?: string, body?: unknown): Promise<T>;
declare function main(): Promise<void>;
