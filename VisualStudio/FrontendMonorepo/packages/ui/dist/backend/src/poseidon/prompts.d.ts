export declare const promptTemplates: {
    explain_file: (fileContent: string) => string;
    explain_error: (error: string, fileContent?: string) => string;
    suggest_improvements: (fileContent: string) => string;
};
