import { CodeTool } from './tool-interfaces';
export declare class LocalCodeTool implements CodeTool {
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
