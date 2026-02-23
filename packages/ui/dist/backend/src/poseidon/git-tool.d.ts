import { GitTool } from './tool-interfaces';
export declare class LocalGitTool implements GitTool {
    status(): Promise<string>;
    diff(targetPath?: string): Promise<string>;
    commit(message: string, files?: string[]): Promise<string>;
}
