import { PoseidonAgent } from './agent';
import { ToolExecutionContext } from './tool-interfaces';
export type OrchestratorStep = {
    description: string;
    action: (agent: PoseidonAgent) => Promise<any>;
    requiresApproval?: boolean;
    rollback?: (agent: PoseidonAgent) => Promise<any>;
};
export declare class PoseidonOrchestrator {
    private agent;
    private context;
    private history;
    constructor(agent: PoseidonAgent, context: ToolExecutionContext);
    executePlan(steps: OrchestratorStep[], approvalCallback?: (step: OrchestratorStep) => Promise<boolean>): Promise<any[]>;
    getHistory(): {
        step: OrchestratorStep;
        result: any;
        error?: any;
    }[];
}
