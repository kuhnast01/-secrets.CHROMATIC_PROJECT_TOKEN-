import 'jest';
// Sprint 4: Orchestrator/Task Planner extension tests
import 'jest';
import { PoseidonAgent } from './agent';
import { ToolExecutionContext } from './tool-interfaces';
import { PoseidonOrchestrator, OrchestratorStep } from './orchestrator';
import { safeExecutePlan } from './orchestrator-extensions';
import fs from 'fs/promises';
import path from 'path';

describe('Poseidon Orchestrator Extensions', () => {
  const sandboxRoot = path.resolve(__dirname, '../../tmp/poseidon-orchestrator-ext-test');
  const context: ToolExecutionContext = { user: 'test', sandboxRoot, allowWrites: true };
  let agent: PoseidonAgent;
  let orchestrator: PoseidonOrchestrator;

  beforeAll(async () => {
    await fs.mkdir(sandboxRoot, { recursive: true });
    agent = new PoseidonAgent(context);
    orchestrator = new PoseidonOrchestrator(agent, context);
  });

  afterAll(async () => {
    await fs.rm(sandboxRoot, { recursive: true, force: true });
  });

  it('should block forbidden destructive plans', async () => {
    const steps: OrchestratorStep[] = [
      {
        description: 'Delete all user data',
        action: async () => 'should not run',
      },
    ];
    await expect(safeExecutePlan(orchestrator, steps, 'test')).rejects.toThrow('forbidden destructive action');
  });

  it('should require approval for dangerous steps', async () => {
    const steps: OrchestratorStep[] = [
      {
        description: 'Dangerous migration',
        action: async () => 'should not run',
        requiresApproval: true,
      },
    ];
    await expect(safeExecutePlan(orchestrator, steps, 'test')).rejects.toThrow('Step not approved');
  });

  it('should execute safe plans', async () => {
    const steps: OrchestratorStep[] = [
      {
        description: 'Write file',
        action: async (agent) => agent.safeWriteFile('bar.txt', 'baz'),
        rollback: async (agent) => fs.rm(path.join(sandboxRoot, 'bar.txt'), { force: true }),
      },
      {
        description: 'Read file',
        action: async (agent) => agent.fileTool.readFile(path.join(sandboxRoot, 'bar.txt')),
      },
    ];
    const results = await safeExecutePlan(orchestrator, steps, 'test');
    expect(results[1]).toBe('baz');
  });
});
