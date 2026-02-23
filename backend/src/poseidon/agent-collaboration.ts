// Sprint 5: Multi-Agent Collaboration for Poseidon
// Enables agent-to-agent communication, delegation, and parallel workflows.

import { PoseidonAgent } from './agent';
import { ToolExecutionContext } from './tool-interfaces';
import { OrchestratorStep } from './orchestrator';

export type ConflictResolutionPolicy = 'priority' | 'first-write-wins';

export type ConcurrentAgentAction = {
  agentIndex: number;
  resource: string;
  action: (agent: PoseidonAgent) => Promise<any>;
  priority?: number;
  requestedAt?: number;
};

export type ConflictResolutionRecord = {
  resource: string;
  policy: ConflictResolutionPolicy;
  winnerAgentIndex: number;
  winnerUser: string;
  contenderAgentIndexes: number[];
  skippedAgentIndexes: number[];
  contenderCount: number;
};

export type ConflictWorkflowResult = {
  resolutions: ConflictResolutionRecord[];
  winnerResults: Array<{
    resource: string;
    winnerAgentIndex: number;
    result: any;
  }>;
};

export class AgentCollaborationManager {
  agents: PoseidonAgent[];
  contexts: ToolExecutionContext[];

  constructor(agents: PoseidonAgent[], contexts: ToolExecutionContext[]) {
    this.agents = agents;
    this.contexts = contexts;
  }

  // Sequential workflow: each agent executes a step in order
  async runSequentialWorkflow(steps: OrchestratorStep[]): Promise<any[]> {
    const results = [];
    for (let i = 0; i < steps.length; i++) {
      const agent = this.agents[i % this.agents.length];
      const result = await steps[i].action(agent);
      results.push(result);
    }
    return results;
  }

  // Parallel workflow: all agents execute their assigned steps concurrently
  async runParallelWorkflow(agentSteps: OrchestratorStep[][]): Promise<any[][]> {
    return Promise.all(
      agentSteps.map((steps, idx) => {
        const agent = this.agents[idx % this.agents.length];
        return Promise.all(steps.map(step => step.action(agent)));
      }),
    );
  }

  // Agent-to-agent message passing (simple broadcast)
  async broadcastMessage(message: string): Promise<void> {
    for (const agent of this.agents) {
      if (typeof (agent as any).receiveMessage === 'function') {
        await (agent as any).receiveMessage(message);
      }
    }
  }

  async runConcurrentConflictWorkflow(
    actions: ConcurrentAgentAction[],
    policy: ConflictResolutionPolicy = 'priority',
  ): Promise<ConflictWorkflowResult> {
    const grouped = new Map<string, ConcurrentAgentAction[]>();

    for (const action of actions) {
      if (!grouped.has(action.resource)) {
        grouped.set(action.resource, []);
      }
      grouped.get(action.resource)?.push(action);
    }

    const resolutions: ConflictResolutionRecord[] = [];
    const winnerResults = await Promise.all(
      [...grouped.entries()].map(async ([resource, contenders]) => {
        const sorted = [...contenders].sort((left, right) => {
          if (policy === 'priority') {
            const priorityDelta = (right.priority ?? 0) - (left.priority ?? 0);
            if (priorityDelta !== 0) {
              return priorityDelta;
            }
          }

          const requestedAtDelta = (left.requestedAt ?? 0) - (right.requestedAt ?? 0);
          if (requestedAtDelta !== 0) {
            return requestedAtDelta;
          }

          return left.agentIndex - right.agentIndex;
        });

        const winner = sorted[0];
        const winnerAgent = this.agents[winner.agentIndex];

        if (!winnerAgent) {
          throw new Error(`No agent found for winner index ${winner.agentIndex}`);
        }

        const contenderIndexes = sorted.map((candidate) => candidate.agentIndex);
        const skippedAgentIndexes = contenderIndexes.slice(1);

        resolutions.push({
          resource,
          policy,
          winnerAgentIndex: winner.agentIndex,
          winnerUser: this.contexts[winner.agentIndex]?.user ?? `agent-${winner.agentIndex}`,
          contenderAgentIndexes: contenderIndexes,
          skippedAgentIndexes,
          contenderCount: contenderIndexes.length,
        });

        const result = await winner.action(winnerAgent);
        return {
          resource,
          winnerAgentIndex: winner.agentIndex,
          result,
        };
      }),
    );

    return {
      resolutions,
      winnerResults,
    };
  }
}
