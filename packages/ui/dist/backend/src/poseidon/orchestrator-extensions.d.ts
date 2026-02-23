import { PoseidonOrchestrator, OrchestratorStep } from './orchestrator';
export declare function enhancedApprovalCallback(step: OrchestratorStep, user: string): Promise<boolean>;
export declare function safeExecutePlan(orchestrator: PoseidonOrchestrator, steps: OrchestratorStep[], user: string): Promise<any[]>;
