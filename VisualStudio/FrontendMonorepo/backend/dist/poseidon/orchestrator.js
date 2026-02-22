"use strict";
// Sprint 4: Orchestrator/Task Planner for Poseidon Agent
// This module enables multi-step reasoning, planning, and execution.
// It provides safety guardrails, rollback, and human approval integration.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoseidonOrchestrator = void 0;
class PoseidonOrchestrator {
    constructor(agent, context) {
        this.agent = agent;
        this.context = context;
        this.history = [];
    }
    async executePlan(steps, approvalCallback) {
        const results = [];
        for (const step of steps) {
            if (step.requiresApproval && approvalCallback) {
                const approved = await approvalCallback(step);
                if (!approved) {
                    this.history.push({ step, result: null, error: 'Not approved' });
                    throw new Error(`Step not approved: ${step.description}`);
                }
            }
            try {
                const result = await step.action(this.agent);
                this.history.push({ step, result });
                results.push(result);
            }
            catch (error) {
                this.history.push({ step, result: null, error });
                // Rollback if defined
                if (step.rollback) {
                    await step.rollback(this.agent);
                }
                throw error;
            }
        }
        return results;
    }
    getHistory() {
        return this.history;
    }
}
exports.PoseidonOrchestrator = PoseidonOrchestrator;
