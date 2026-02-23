import { PoseidonAgent } from './agent';
import { ToolExecutionContext } from './tool-interfaces';
import { OrchestratorStep } from './orchestrator';
export declare class AgentCollaborationManager {
    agents: PoseidonAgent[];
    contexts: ToolExecutionContext[];
    constructor(agents: PoseidonAgent[], contexts: ToolExecutionContext[]);
    runSequentialWorkflow(steps: OrchestratorStep[]): Promise<any[]>;
    runParallelWorkflow(agentSteps: OrchestratorStep[][]): Promise<any[][]>;
    broadcastMessage(message: string): Promise<void>;
}
