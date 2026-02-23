import { FileTool } from './tool-interfaces';
export declare class SafeFileTool implements FileTool {
    private fileTool;
    private allowWrites;
    constructor(fileTool: FileTool, allowWrites: boolean);
    readFile(path: string): Promise<string>;
    writeFile(path: string, content: string): Promise<void>;
    createFile(path: string, content?: string): Promise<void>;
    deleteFile(path: string): Promise<void>;
    moveFile(src: string, dest: string): Promise<void>;
    createFolder(path: string): Promise<void>;
}
