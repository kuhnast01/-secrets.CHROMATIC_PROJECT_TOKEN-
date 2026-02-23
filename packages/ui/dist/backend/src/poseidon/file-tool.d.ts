import { FileTool } from './tool-interfaces';
export declare class LocalFileTool implements FileTool {
    readFile(filePath: string): Promise<string>;
    writeFile(filePath: string, content: string): Promise<void>;
    createFile(filePath: string, content?: string): Promise<void>;
    deleteFile(filePath: string): Promise<void>;
    moveFile(src: string, dest: string): Promise<void>;
    createFolder(folderPath: string): Promise<void>;
}
