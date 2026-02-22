"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
// Sprint 4: Orchestrator/Task Planner extension tests
require("jest");
const agent_1 = require("./agent");
const orchestrator_1 = require("./orchestrator");
const orchestrator_extensions_1 = require("./orchestrator-extensions");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
describe('Poseidon Orchestrator Extensions', () => {
    const sandboxRoot = path_1.default.resolve(__dirname, '../../tmp/poseidon-orchestrator-ext-test');
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
    it('should block forbidden destructive plans', async () => {
        const steps = [
            {
                description: 'Delete all user data',
                action: async () => 'should not run',
            },
        ];
        await expect((0, orchestrator_extensions_1.safeExecutePlan)(orchestrator, steps, 'test')).rejects.toThrow('forbidden destructive action');
    });
    it('should require approval for dangerous steps', async () => {
        const steps = [
            {
                description: 'Dangerous migration',
                action: async () => 'should not run',
                requiresApproval: true,
            },
        ];
        await expect((0, orchestrator_extensions_1.safeExecutePlan)(orchestrator, steps, 'test')).rejects.toThrow('Step not approved');
    });
    it('should execute safe plans', async () => {
        const steps = [
            {
                description: 'Write file',
                action: async (agent) => agent.safeWriteFile('bar.txt', 'baz'),
                rollback: async (agent) => promises_1.default.rm(path_1.default.join(sandboxRoot, 'bar.txt'), { force: true }),
            },
            {
                description: 'Read file',
                action: async (agent) => agent.fileTool.readFile(path_1.default.join(sandboxRoot, 'bar.txt')),
            },
        ];
        const results = await (0, orchestrator_extensions_1.safeExecutePlan)(orchestrator, steps, 'test');
        expect(results[1]).toBe('baz');
    });
});
