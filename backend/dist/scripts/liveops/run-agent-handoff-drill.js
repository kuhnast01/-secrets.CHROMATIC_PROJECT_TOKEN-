import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PoseidonAgent } from '../../src/poseidon/agent';
import { AgentCollaborationManager } from '../../src/poseidon/agent-collaboration';
const backendRoot = path.resolve(__dirname, '..', '..');
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
function sha256Hex(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}
async function readText(filePath) {
    return fs.readFile(filePath, 'utf8');
}
async function appendAuditEvent(eventLogPath, event) {
    await fs.appendFile(eventLogPath, `${JSON.stringify(event)}\n`, 'utf8');
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const now = new Date();
    const timestamp = utcTimestampCompact(now);
    const correlationId = `agent-handoff-${timestamp}`;
    const handoffRoot = path.resolve(args.handoffDir ?? path.join(backendRoot, 'tmp/agent-handoff', correlationId));
    const reportPath = path.resolve(args.reportDir ?? path.join(backendRoot, 'tmp/liveops-artifacts'), `agent-01-handoff-${timestamp}.json`);
    const eventLogPath = path.join(handoffRoot, 'handoff-events.ndjson');
    const engineeringRoot = path.join(handoffRoot, 'engineering');
    const qaRoot = path.join(handoffRoot, 'qa');
    const sreRoot = path.join(handoffRoot, 'sre');
    await fs.mkdir(engineeringRoot, { recursive: true });
    await fs.mkdir(qaRoot, { recursive: true });
    await fs.mkdir(sreRoot, { recursive: true });
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    const contexts = [
        { user: 'engineering-agent', sandboxRoot: engineeringRoot, allowWrites: true },
        { user: 'qa-agent', sandboxRoot: qaRoot, allowWrites: true },
        { user: 'sre-agent', sandboxRoot: sreRoot, allowWrites: true },
    ];
    const engineeringAgent = new PoseidonAgent(contexts[0]);
    const qaAgent = new PoseidonAgent(contexts[1]);
    const sreAgent = new PoseidonAgent(contexts[2]);
    const manager = new AgentCollaborationManager([engineeringAgent, qaAgent, sreAgent], contexts);
    const events = [];
    const steps = [];
    let sequence = 1;
    const stepsPlan = [
        {
            description: 'Engineering creates handoff packet',
            action: async (agent) => {
                const engineeringPacket = {
                    correlationId,
                    owner: 'Engineering',
                    buildId: `build-${timestamp}`,
                    changeSummary: 'Implemented core event pipeline and regression guardrails',
                    target: 'QA',
                    createdAt: new Date().toISOString(),
                };
                const packetText = JSON.stringify(engineeringPacket, null, 2);
                const packetPath = path.join(engineeringRoot, 'engineering-handoff.json');
                await agent.safeWriteFile('engineering-handoff.json', packetText);
                const event = {
                    sequence: sequence++,
                    timestamp: new Date().toISOString(),
                    correlationId,
                    from: 'Engineering',
                    to: 'QA',
                    handoffArtifact: packetPath,
                    artifactSha256: sha256Hex(packetText),
                    summary: 'Engineering handed off build packet to QA',
                };
                events.push(event);
                await appendAuditEvent(eventLogPath, event);
                return packetPath;
            },
        },
        {
            description: 'QA validates packet and hands off to SRE',
            action: async (agent) => {
                const packetPath = path.join(engineeringRoot, 'engineering-handoff.json');
                const packetText = await readText(packetPath);
                const packet = JSON.parse(packetText);
                if (packet.correlationId !== correlationId) {
                    throw new Error('QA validation failed: correlationId mismatch');
                }
                const qaReport = {
                    correlationId,
                    owner: 'QA',
                    sourceBuildId: packet.buildId,
                    smokeValidation: 'pass',
                    regressionSummary: 'No critical regressions detected',
                    target: 'SRE',
                    validatedAt: new Date().toISOString(),
                };
                const qaText = JSON.stringify(qaReport, null, 2);
                const qaPath = path.join(qaRoot, 'qa-handoff.json');
                await agent.safeWriteFile('qa-handoff.json', qaText);
                const event = {
                    sequence: sequence++,
                    timestamp: new Date().toISOString(),
                    correlationId,
                    from: 'QA',
                    to: 'SRE',
                    handoffArtifact: qaPath,
                    artifactSha256: sha256Hex(qaText),
                    summary: 'QA validated build and handed off deployment packet to SRE',
                };
                events.push(event);
                await appendAuditEvent(eventLogPath, event);
                return qaPath;
            },
        },
        {
            description: 'SRE acknowledges rollout readiness',
            action: async (agent) => {
                const qaPath = path.join(qaRoot, 'qa-handoff.json');
                const qaText = await readText(qaPath);
                const qaPacket = JSON.parse(qaText);
                if (qaPacket.correlationId !== correlationId || qaPacket.smokeValidation !== 'pass') {
                    throw new Error('SRE gating failed: QA packet is not deploy-ready');
                }
                const sreReport = {
                    correlationId,
                    owner: 'SRE',
                    deploymentGate: 'approved',
                    rollbackPlanId: `rb-${timestamp}`,
                    approvedAt: new Date().toISOString(),
                };
                const sreText = JSON.stringify(sreReport, null, 2);
                const srePath = path.join(sreRoot, 'sre-ack.json');
                await agent.safeWriteFile('sre-ack.json', sreText);
                const event = {
                    sequence: sequence++,
                    timestamp: new Date().toISOString(),
                    correlationId,
                    from: 'SRE',
                    to: 'SRE',
                    handoffArtifact: srePath,
                    artifactSha256: sha256Hex(sreText),
                    summary: 'SRE acknowledged deployment readiness and rollback reference',
                };
                events.push(event);
                await appendAuditEvent(eventLogPath, event);
                return srePath;
            },
        },
    ];
    try {
        await manager.runSequentialWorkflow(stepsPlan);
        steps.push({
            name: 'agent-handoff:engineering-qa-sre',
            status: 'pass',
            details: `Completed ${events.length} traceable handoff events with correlationId ${correlationId}`,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'unknown_error';
        steps.push({
            name: 'agent-handoff:engineering-qa-sre',
            status: 'fail',
            details: message,
        });
    }
    const status = steps.every((step) => step.status === 'pass') ? 'pass' : 'fail';
    const artifact = {
        schemaVersion: 1,
        pipeline: 'AGENT-01',
        status,
        generatedAt: new Date().toISOString(),
        reportPath,
        correlationId,
        handoffDirectory: handoffRoot,
        steps,
        events,
    };
    await fs.writeFile(reportPath, JSON.stringify(artifact, null, 2), 'utf8');
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
