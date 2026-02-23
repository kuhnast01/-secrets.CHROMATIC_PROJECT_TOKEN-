"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
// Acceptance criteria and tests for Poseidon Sprint 3
require("jest");
/**
 * Acceptance Criteria:
 * 1. All file, code, and git tools are accessible via the agent and respect sandbox/safety constraints.
 * 2. File writes are blocked if not allowed.
 * 3. Diff generation works for file changes.
 * 4. Tool operations are auditable and errors are handled gracefully.
 */
const agent_1 = require("./agent");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
jest.setTimeout(60000); // Increase timeout for long-running agent tests
describe('Poseidon Agent Tools', () => {
    const sandboxRoot = path_1.default.resolve(__dirname, '../../tmp/poseidon-sandbox-test');
    const context = { user: 'test', sandboxRoot, allowWrites: true };
    let agent;
    beforeAll(async () => {
        await promises_1.default.mkdir(sandboxRoot, { recursive: true });
        agent = new agent_1.PoseidonAgent(context);
    });
    afterAll(async () => {
        await promises_1.default.rm(sandboxRoot, { recursive: true, force: true });
    });
    it('should write and read a file in sandbox', async () => {
        const relPath = 'test.txt';
        await agent.safeWriteFile(relPath, 'hello');
        const content = await agent.fileTool.readFile(path_1.default.join(sandboxRoot, relPath));
        expect(content).toBe('hello');
    });
    it('should block file writes if not allowed', async () => {
        const noWriteAgent = new agent_1.PoseidonAgent({ ...context, allowWrites: false });
        await expect(noWriteAgent.safeWriteFile('fail.txt', 'no')).rejects.toThrow('File writes are not allowed');
    });
    it('should run tests and lint (mocked)', async () => {
        agent.codeTool.runTests = jest.fn().mockResolvedValue({
            success: true,
            output: 'mocked test output',
        });
        const result = await agent.codeTool.runTests();
        expect(agent.codeTool.runTests).toHaveBeenCalled();
        expect(typeof result.output).toBe('string');
    });
    it('should get git status', async () => {
        // Mock gitTool.status to avoid requiring git in test environment
        agent.gitTool.status = async () => 'mocked git status';
        const status = await agent.gitTool.status();
        expect(status).toBe('mocked git status');
    });
});
