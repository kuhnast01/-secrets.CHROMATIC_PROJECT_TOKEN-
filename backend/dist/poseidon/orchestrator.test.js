"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
// Sprint 4: Orchestrator/Task Planner tests for Poseidon Agent
require("jest");
const agent_1 = require("./agent");
const orchestrator_1 = require("./orchestrator");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
describe('Poseidon Orchestrator', () => {
    const sandboxRoot = path_1.default.resolve(__dirname, '../../tmp/poseidon-orchestrator-test');
    const context = { user: 'test', sandboxRoot, allowWrites: true };
    let agent;
    let orchestrator;
    beforeAll(async () => {
        await promises_1.default.mkdir(sandboxRoot, { recursive: true });
        agent = new agent_1.PoseidonAgent(context);
        orchestrator = new orchestrator_1.PoseidonOrchestrator(agent, context);
    });
    afterAll(async () => {
        await promises_1.default.rm(sandboxRoot, { recursive: true, force: true });
    });
    it('should execute a multi-step plan', async () => {
        const steps = [
            {
                description: 'Write file',
                action: async (agent) => agent.safeWriteFile('foo.txt', 'bar'),
                rollback: async (agent) => promises_1.default.rm(path_1.default.join(sandboxRoot, 'foo.txt'), { force: true }),
            },
            {
                description: 'Read file',
                action: async (agent) => agent.fileTool.readFile(path_1.default.join(sandboxRoot, 'foo.txt')),
            },
        ];
        const results = await orchestrator.executePlan(steps);
        expect(results[1]).toBe('bar');
    });
    it('should require approval for critical steps', async () => {
        const steps = [
            {
                description: 'Dangerous step',
                action: async () => 'ok',
                requiresApproval: true,
            },
        ];
        let approvalCalled = false;
        const approvalCallback = async () => {
            approvalCalled = true;
            return false;
        };
        await expect(orchestrator.executePlan(steps, approvalCallback)).rejects.toThrow('Step not approved');
        expect(approvalCalled).toBe(true);
    });
    it('should rollback on error', async () => {
        let rollbackCalled = false;
        const steps = [
            {
                description: 'Step 1',
                action: async () => { throw new Error('fail'); },
                rollback: async () => { rollbackCalled = true; },
            },
        ];
        await expect(orchestrator.executePlan(steps)).rejects.toThrow('fail');
        expect(rollbackCalled).toBe(true);
    });
});
