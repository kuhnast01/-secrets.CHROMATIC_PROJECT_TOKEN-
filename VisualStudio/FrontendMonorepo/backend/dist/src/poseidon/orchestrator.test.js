import 'jest';
// Sprint 4: Orchestrator/Task Planner tests for Poseidon Agent
import 'jest';
import { PoseidonAgent } from './agent';
import { PoseidonOrchestrator } from './orchestrator';
import fs from 'fs/promises';
import path from 'path';
describe('Poseidon Orchestrator', () => {
    const sandboxRoot = path.resolve(__dirname, '../../tmp/poseidon-orchestrator-test');
    const context = { user: 'test', sandboxRoot, allowWrites: true };
    let agent;
    let orchestrator;
    beforeAll(async () => {
        await fs.mkdir(sandboxRoot, { recursive: true });
        agent = new PoseidonAgent(context);
        orchestrator = new PoseidonOrchestrator(agent, context);
    });
    afterAll(async () => {
        await fs.rm(sandboxRoot, { recursive: true, force: true });
    });
    it('should execute a multi-step plan', async () => {
        const steps = [
            {
                description: 'Write file',
                action: async (agent) => agent.safeWriteFile('foo.txt', 'bar'),
                rollback: async (agent) => fs.rm(path.join(sandboxRoot, 'foo.txt'), { force: true }),
            },
            {
                description: 'Read file',
                action: async (agent) => agent.fileTool.readFile(path.join(sandboxRoot, 'foo.txt')),
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
