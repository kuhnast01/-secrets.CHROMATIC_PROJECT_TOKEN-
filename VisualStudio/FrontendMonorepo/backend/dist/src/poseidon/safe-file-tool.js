export class SafeFileTool {
    constructor(fileTool, allowWrites) {
        this.fileTool = fileTool;
        this.allowWrites = allowWrites;
    }
    async readFile(path) {
        return this.fileTool.readFile(path);
    }
    async writeFile(path, content) {
        if (!this.allowWrites)
            throw new Error('File writes are not allowed in this context.');
        return this.fileTool.writeFile(path, content);
    }
    async createFile(path, content = '') {
        if (!this.allowWrites)
            throw new Error('File writes are not allowed in this context.');
        return this.fileTool.createFile(path, content);
    }
    async deleteFile(path) {
        if (!this.allowWrites)
            throw new Error('File writes are not allowed in this context.');
        return this.fileTool.deleteFile(path);
    }
    async moveFile(src, dest) {
        if (!this.allowWrites)
            throw new Error('File writes are not allowed in this context.');
        return this.fileTool.moveFile(src, dest);
    }
    async createFolder(path) {
        if (!this.allowWrites)
            throw new Error('File writes are not allowed in this context.');
        return this.fileTool.createFolder(path);
    }
}
