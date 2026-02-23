"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolSandbox = void 0;
exports.generateDiff = generateDiff;
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class ToolSandbox {
    constructor(root) {
        this.root = root;
    }
    resolveSafePath(target) {
        const resolved = path_1.default.resolve(this.root, target);
        if (!resolved.startsWith(this.root)) {
            throw new Error('Unsafe path: outside sandbox root');
        }
        return resolved;
    }
    async runInSandbox(fn) {
        return fn(this.root);
    }
}
exports.ToolSandbox = ToolSandbox;
async function generateDiff(fileA, fileB) {
    // Use git diff --no-index for arbitrary files
    const { stdout, stderr } = await execAsync(`git diff --no-index --color=always "${fileA}" "${fileB}"`);
    return stdout + stderr;
}
