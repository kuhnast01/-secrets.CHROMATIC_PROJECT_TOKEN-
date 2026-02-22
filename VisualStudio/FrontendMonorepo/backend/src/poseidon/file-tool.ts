// File tool implementation for Poseidon agent
import fs from 'fs/promises';
import path from 'path';
import { FileTool } from './tool-interfaces';

export class LocalFileTool implements FileTool {
  async readFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content, 'utf-8');
  }

  async createFile(filePath: string, content = ''): Promise<void> {
    await fs.writeFile(filePath, content, { flag: 'wx' });
  }

  async deleteFile(filePath: string): Promise<void> {
    await fs.unlink(filePath);
  }

  async moveFile(src: string, dest: string): Promise<void> {
    await fs.rename(src, dest);
  }

  async createFolder(folderPath: string): Promise<void> {
    await fs.mkdir(folderPath, { recursive: true });
  }
}
