import 'jest';
// Sprint 5: Multi-Agent Collaboration tests for Poseidon
import 'jest';
import { PoseidonAgent } from './agent';
import { ToolExecutionContext } from './tool-interfaces';
import { AgentCollaborationManager } from './agent-collaboration';
import fs from 'fs/promises';
import path from 'path';

describe('Agent Collaboration Manager', () => {
  const sandboxRoot1 = path.resolve(__dirname, '../../tmp/agent-collab-1');
  const sandboxRoot2 = path.resolve(__dirname, '../../tmp/agent-collab-2');
  const context1: ToolExecutionContext = { user: 'agent1', sandboxRoot: sandboxRoot1, allowWrites: true };
  const context2: ToolExecutionContext = { user: 'agent2', sandboxRoot: sandboxRoot2, allowWrites: true };
  let agent1: PoseidonAgent;
  let agent2: PoseidonAgent;
  let manager: AgentCollaborationManager;

  beforeAll(async () => {
    await fs.mkdir(sandboxRoot1, { recursive: true });
    await fs.mkdir(sandboxRoot2, { recursive: true });
    agent1 = new PoseidonAgent(context1);
    agent2 = new PoseidonAgent(context2);
    manager = new AgentCollaborationManager([agent1, agent2], [context1, context2]);
  });

  afterAll(async () => {
    await fs.rm(sandboxRoot1, { recursive: true, force: true });
    await fs.rm(sandboxRoot2, { recursive: true, force: true });
  });

  it('should run a sequential workflow across agents', async () => {
    const steps = [
      {
        description: 'Agent1 writes file',
        action: async (agent: PoseidonAgent) => agent.safeWriteFile('a.txt', 'foo'),
      },
      {
        description: 'Agent2 writes file',
        action: async (agent: PoseidonAgent) => agent.safeWriteFile('b.txt', 'bar'),
      },
    ];
    const results = await manager.runSequentialWorkflow(steps);
    expect(results.length).toBe(2);
    const content1 = await agent1.fileTool.readFile(path.join(sandboxRoot1, 'a.txt'));
    const content2 = await agent2.fileTool.readFile(path.join(sandboxRoot2, 'b.txt'));
    expect(content1).toBe('foo');
    expect(content2).toBe('bar');
  });

  it('should run parallel workflows for agents', async () => {
    const steps1 = [
      {
        description: 'Agent1 writes file',
        action: async (agent: PoseidonAgent) => agent.safeWriteFile('c.txt', 'baz'),
      },
    ];
    const steps2 = [
      {
        description: 'Agent2 writes file',
        action: async (agent: PoseidonAgent) => agent.safeWriteFile('d.txt', 'qux'),
      },
    ];
    const results = await manager.runParallelWorkflow([steps1, steps2]);
    expect(results.length).toBe(2);
    const content1 = await agent1.fileTool.readFile(path.join(sandboxRoot1, 'c.txt'));
    const content2 = await agent2.fileTool.readFile(path.join(sandboxRoot2, 'd.txt'));
    expect(content1).toBe('baz');
    expect(content2).toBe('qux');
  });

  it('should broadcast messages to all agents', async () => {
    let received1 = '';
    let received2 = '';
    (agent1 as any).receiveMessage = async (msg: string) => { received1 = msg; };
    (agent2 as any).receiveMessage = async (msg: string) => { received2 = msg; };
    await manager.broadcastMessage('hello agents');
    expect(received1).toBe('hello agents');
    expect(received2).toBe('hello agents');
  });

  it('should resolve concurrent actions by priority policy', async () => {
    const resource = 'shared/policy.json';
    const run = await manager.runConcurrentConflictWorkflow(
      [
        {
          agentIndex: 0,
          resource,
          priority: 1,
          requestedAt: 2,
          action: async (agent: PoseidonAgent) => {
            await agent.safeWriteFile('priority-loser.txt', 'agent1');
            return 'agent1';
          },
        },
        {
          agentIndex: 1,
          resource,
          priority: 5,
          requestedAt: 1,
          action: async (agent: PoseidonAgent) => {
            await agent.safeWriteFile('priority-winner.txt', 'agent2');
            return 'agent2';
          },
        },
      ],
      'priority',
    );

    expect(run.resolutions).toHaveLength(1);
    expect(run.resolutions[0].winnerAgentIndex).toBe(1);
    expect(run.resolutions[0].skippedAgentIndexes).toEqual([0]);

    const winnerContent = await agent2.fileTool.readFile(path.join(sandboxRoot2, 'priority-winner.txt'));
    expect(winnerContent).toBe('agent2');
    await expect(agent1.fileTool.readFile(path.join(sandboxRoot1, 'priority-loser.txt'))).rejects.toThrow();
  });
});
