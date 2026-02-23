// File write safety layer for Poseidon agent
import { FileTool } from './tool-interfaces';

export class SafeFileTool implements FileTool {
  constructor(private fileTool: FileTool, private allowWrites: boolean) {}

  async readFile(path: string) {
    return this.fileTool.readFile(path);
  }

  async writeFile(path: string, content: string) {
    if (!this.allowWrites) throw new Error('File writes are not allowed in this context.');
    return this.fileTool.writeFile(path, content);
  }

  async createFile(path: string, content = '') {
    if (!this.allowWrites) throw new Error('File writes are not allowed in this context.');
    return this.fileTool.createFile(path, content);
  }

  async deleteFile(path: string) {
    if (!this.allowWrites) throw new Error('File writes are not allowed in this context.');
    return this.fileTool.deleteFile(path);
  }

  async moveFile(src: string, dest: string) {
    if (!this.allowWrites) throw new Error('File writes are not allowed in this context.');
    return this.fileTool.moveFile(src, dest);
  }

  async createFolder(path: string) {
    if (!this.allowWrites) throw new Error('File writes are not allowed in this context.');
    return this.fileTool.createFolder(path);
  }
}
