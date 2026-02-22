"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
// Sprint 5: Multi-Agent Collaboration tests for Poseidon
require("jest");
const agent_1 = require("./agent");
const agent_collaboration_1 = require("./agent-collaboration");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
describe('Agent Collaboration Manager', () => {
    const sandboxRoot1 = path_1.default.resolve(__dirname, '../../tmp/agent-collab-1');
    const sandboxRoot2 = path_1.default.resolve(__dirname, '../../tmp/agent-collab-2');
    const context1 = { user: 'agent1', sandboxRoot: sandboxRoot1, allowWrites: true };
    const context2 = { user: 'agent2', sandboxRoot: sandboxRoot2, allowWrites: true };
    let agent1;
    let agent2;
    let manager;
    beforeAll(async () => {
        await promises_1.default.mkdir(sandboxRoot1, { recursive: true });
        await promises_1.default.mkdir(sandboxRoot2, { recursive: true });
        agent1 = new agent_1.PoseidonAgent(context1);
        agent2 = new agent_1.PoseidonAgent(context2);
        manager = new agent_collaboration_1.AgentCollaborationManager([agent1, agent2], [context1, context2]);
    });
    afterAll(async () => {
        await promises_1.default.rm(sandboxRoot1, { recursive: true, force: true });
        await promises_1.default.rm(sandboxRoot2, { recursive: true, force: true });
    });
    it('should run a sequential workflow across agents', async () => {
        const steps = [
            {
                description: 'Agent1 writes file',
                action: async (agent) => agent.safeWriteFile('a.txt', 'foo'),
            },
            {
                description: 'Agent2 writes file',
                action: async (agent) => agent.safeWriteFile('b.txt', 'bar'),
            },
        ];
        const results = await manager.runSequentialWorkflow(steps);
        expect(results.length).toBe(2);
        const content1 = await agent1.fileTool.readFile(path_1.default.join(sandboxRoot1, 'a.txt'));
        const content2 = await agent2.fileTool.readFile(path_1.default.join(sandboxRoot2, 'b.txt'));
        expect(content1).toBe('foo');
        expect(content2).toBe('bar');
    });
    it('should run parallel workflows for agents', async () => {
        const steps1 = [
            {
                description: 'Agent1 writes file',
                action: async (agent) => agent.safeWriteFile('c.txt', 'baz'),
            },
        ];
        const steps2 = [
            {
                description: 'Agent2 writes file',
                action: async (agent) => agent.safeWriteFile('d.txt', 'qux'),
            },
        ];
        const results = await manager.runParallelWorkflow([steps1, steps2]);
        expect(results.length).toBe(2);
        const content1 = await agent1.fileTool.readFile(path_1.default.join(sandboxRoot1, 'c.txt'));
        const content2 = await agent2.fileTool.readFile(path_1.default.join(sandboxRoot2, 'd.txt'));
        expect(content1).toBe('baz');
        expect(content2).toBe('qux');
    });
    it('should broadcast messages to all agents', async () => {
        let received1 = '';
        let received2 = '';
        agent1.receiveMessage = async (msg) => { received1 = msg; };
        agent2.receiveMessage = async (msg) => { received2 = msg; };
        await manager.broadcastMessage('hello agents');
        expect(received1).toBe('hello agents');
        expect(received2).toBe('hello agents');
    });
    it('should resolve concurrent actions by priority policy', async () => {
        const resource = 'shared/policy.json';
        const run = await manager.runConcurrentConflictWorkflow([
            {
                agentIndex: 0,
                resource,
                priority: 1,
                requestedAt: 2,
                action: async (agent) => {
                    await agent.safeWriteFile('priority-loser.txt', 'agent1');
                    return 'agent1';
                },
            },
            {
                agentIndex: 1,
                resource,
                priority: 5,
                requestedAt: 1,
                action: async (agent) => {
                    await agent.safeWriteFile('priority-winner.txt', 'agent2');
                    return 'agent2';
                },
            },
        ], 'priority');
        expect(run.resolutions).toHaveLength(1);
        expect(run.resolutions[0].winnerAgentIndex).toBe(1);
        expect(run.resolutions[0].skippedAgentIndexes).toEqual([0]);
        const winnerContent = await agent2.fileTool.readFile(path_1.default.join(sandboxRoot2, 'priority-winner.txt'));
        expect(winnerContent).toBe('agent2');
        await expect(agent1.fileTool.readFile(path_1.default.join(sandboxRoot1, 'priority-loser.txt'))).rejects.toThrow();
    });
});
