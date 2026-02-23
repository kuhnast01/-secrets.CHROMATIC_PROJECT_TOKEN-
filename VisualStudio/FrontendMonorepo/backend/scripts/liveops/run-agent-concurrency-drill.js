"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const agent_collaboration_1 = require("../../src/poseidon/agent-collaboration");
const agent_1 = require("../../src/poseidon/agent");
const backendRoot = node_path_1.default.resolve(__dirname, '..', '..');
function parseArgs(argv) {
    return argv.reduce((accumulator, argument) => {
        const [rawKey, ...rest] = argument.split('=');
        if (!rawKey?.startsWith('--') || rest.length === 0) {
            return accumulator;
        }
        accumulator[rawKey.slice(2)] = rest.join('=');
        return accumulator;
    }, {});
}
function utcTimestampCompact(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const now = new Date();
    const timestamp = utcTimestampCompact(now);
    const runId = `agent-conflict-${timestamp}`;
    const policy = 'priority';
    const conflictRoot = node_path_1.default.resolve(args.conflictDir ?? node_path_1.default.join(backendRoot, 'tmp/agent-conflicts', runId));
    const reportPath = node_path_1.default.resolve(args.reportDir ?? node_path_1.default.join(backendRoot, 'tmp/liveops-artifacts'), `agent-02-concurrency-${timestamp}.json`);
    await promises_1.default.mkdir(conflictRoot, { recursive: true });
    await promises_1.default.mkdir(node_path_1.default.join(conflictRoot, 'rollout'), { recursive: true });
    await promises_1.default.mkdir(node_path_1.default.join(conflictRoot, 'reporting'), { recursive: true });
    await promises_1.default.mkdir(node_path_1.default.dirname(reportPath), { recursive: true });
    const contexts = [
        { user: 'engineering-agent', sandboxRoot: conflictRoot, allowWrites: true },
        { user: 'qa-agent', sandboxRoot: conflictRoot, allowWrites: true },
        { user: 'sre-agent', sandboxRoot: conflictRoot, allowWrites: true },
    ];
    const agents = contexts.map((context) => new agent_1.PoseidonAgent(context));
    const manager = new agent_collaboration_1.AgentCollaborationManager(agents, contexts);
    const steps = [];
    const events = [];
    let resolutions = [];
    const sharedResource = 'rollout/feature-flags.json';
    const independentResource = 'reporting/health-summary.json';
    const actions = [
        {
            agentIndex: 0,
            resource: sharedResource,
            priority: 1,
            requestedAt: 2,
            action: async (agent) => {
                await agent.safeWriteFile(sharedResource, JSON.stringify({
                    owner: 'engineering-agent',
                    strategy: 'gradual-5-percent',
                    generatedAt: new Date().toISOString(),
                }, null, 2));
                return {
                    owner: 'engineering-agent',
                    strategy: 'gradual-5-percent',
                };
            },
        },
        {
            agentIndex: 1,
            resource: sharedResource,
            priority: 2,
            requestedAt: 2,
            action: async (agent) => {
                await agent.safeWriteFile(sharedResource, JSON.stringify({
                    owner: 'qa-agent',
                    strategy: 'hold-for-regression',
                    generatedAt: new Date().toISOString(),
                }, null, 2));
                return {
                    owner: 'qa-agent',
                    strategy: 'hold-for-regression',
                };
            },
        },
        {
            agentIndex: 2,
            resource: sharedResource,
            priority: 5,
            requestedAt: 1,
            action: async (agent) => {
                await agent.safeWriteFile(sharedResource, JSON.stringify({
                    owner: 'sre-agent',
                    strategy: 'pause-and-rollback-ready',
                    generatedAt: new Date().toISOString(),
                }, null, 2));
                return {
                    owner: 'sre-agent',
                    strategy: 'pause-and-rollback-ready',
                };
            },
        },
        {
            agentIndex: 0,
            resource: independentResource,
            priority: 1,
            requestedAt: 1,
            action: async (agent) => {
                await agent.safeWriteFile(independentResource, JSON.stringify({
                    owner: 'engineering-agent',
                    status: 'healthy',
                    generatedAt: new Date().toISOString(),
                }, null, 2));
                return {
                    owner: 'engineering-agent',
                    status: 'healthy',
                };
            },
        },
    ];
    try {
        const run = await manager.runConcurrentConflictWorkflow(actions, policy);
        resolutions = run.resolutions;
        const sharedResolution = resolutions.find((resolution) => resolution.resource === sharedResource);
        const independentResolution = resolutions.find((resolution) => resolution.resource === independentResource);
        if (!sharedResolution) {
            throw new Error('Missing shared resource resolution record.');
        }
        if (!independentResolution) {
            throw new Error('Missing independent resource resolution record.');
        }
        if (sharedResolution.winnerUser !== 'sre-agent') {
            throw new Error(`Expected shared resource winner to be sre-agent, received ${sharedResolution.winnerUser}.`);
        }
        if (sharedResolution.skippedAgentIndexes.length !== 2) {
            throw new Error('Shared resource should skip 2 conflicting agents under priority policy.');
        }
        if (independentResolution.contenderCount !== 1 || independentResolution.skippedAgentIndexes.length !== 0) {
            throw new Error('Independent resource should execute without conflict skips.');
        }
        const eventTime = new Date().toISOString();
        events.push(...resolutions.map((resolution) => ({
            timestamp: eventTime,
            resource: resolution.resource,
            policy: resolution.policy,
            winner: resolution.winnerUser,
            contenders: resolution.contenderAgentIndexes.map((index) => contexts[index]?.user ?? `agent-${index}`),
            skipped: resolution.skippedAgentIndexes.map((index) => contexts[index]?.user ?? `agent-${index}`),
        })));
        steps.push({
            name: 'agent-conflict-policy-resolution',
            status: 'pass',
            details: `Resolved ${resolutions.length} resources with policy ${policy}; shared winner=${sharedResolution.winnerUser}`,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'unknown_error';
        steps.push({
            name: 'agent-conflict-policy-resolution',
            status: 'fail',
            details: message,
        });
    }
    const status = steps.every((step) => step.status === 'pass') ? 'pass' : 'fail';
    const artifact = {
        schemaVersion: 1,
        pipeline: 'AGENT-02',
        status,
        generatedAt: new Date().toISOString(),
        reportPath,
        runId,
        conflictDirectory: conflictRoot,
        policy,
        steps,
        resolutions,
        events,
    };
    await promises_1.default.writeFile(reportPath, JSON.stringify(artifact, null, 2), 'utf8');
    console.log(JSON.stringify(artifact, null, 2));
    if (status === 'fail') {
        process.exit(1);
    }
}
main().catch((error) => {
    const message = error instanceof Error ? error.message : 'unknown_error';
    console.error(JSON.stringify({ error: message }, null, 2));
    process.exit(1);
});
