export type RepoType = 'mobile' | 'web' | 'admin' | 'backend';
export interface RepoConfig {
    type: RepoType;
    name: string;
    path: string;
    allowWriteBranches: string[];
    prTargetBranch: string;
}
export declare class RepoConnector {
    private config;
    constructor(config: RepoConfig);
    canWriteToBranch(branch: string): boolean;
    getPRTargetBranch(): string;
    openPullRequest(diff: string, branch: string, title: string, description: string): Promise<{
        prUrl: string;
    }>;
    summarizeDiff(diff: string): Promise<string>;
}
