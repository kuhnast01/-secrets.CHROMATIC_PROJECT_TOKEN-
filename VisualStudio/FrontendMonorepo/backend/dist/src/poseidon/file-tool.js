// File tool implementation for Poseidon agent
import fs from 'fs/promises';
export class LocalFileTool {
    async readFile(filePath) {
        return fs.readFile(filePath, 'utf-8');
    }
    async writeFile(filePath, content) {
        await fs.writeFile(filePath, content, 'utf-8');
    }
    async createFile(filePath, content = '') {
        await fs.writeFile(filePath, content, { flag: 'wx' });
    }
    async deleteFile(filePath) {
        await fs.unlink(filePath);
    }
    async moveFile(src, dest) {
        await fs.rename(src, dest);
    }
    async createFolder(folderPath) {
        await fs.mkdir(folderPath, { recursive: true });
    }
}
