import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
const backendRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(backendRoot, '..');
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
function signaturePayload(record) {
    return `${record.suggestionId}|${record.approver}|${record.role}|${record.approvedAt}|${record.reason}`;
}
function signRecord(record) {
    return crypto.createHash('sha256').update(signaturePayload(record)).digest('hex');
}
function verifySignature(record) {
    const unsigned = {
        suggestionId: record.suggestionId,
        approver: record.approver,
        role: record.role,
        approvedAt: record.approvedAt,
        reason: record.reason,
    };
    return signRecord(unsigned) === record.signature;
}
async function readPolicy(policyPath) {
    const raw = await fs.readFile(policyPath, 'utf8');
    return JSON.parse(raw);
}
function evaluateGate(suggestion, policy, approvals) {
    const requiresApproval = policy.approvalRequiredFor.includes(suggestion.type);
    if (!requiresApproval) {
        return {
            suggestionId: suggestion.id,
            type: suggestion.type,
            requiresApproval,
            approved: true,
            decision: 'executed',
            reason: 'approval_not_required',
        };
    }
    const approval = approvals.find((entry) => entry.suggestionId === suggestion.id);
    if (!approval) {
        return {
            suggestionId: suggestion.id,
            type: suggestion.type,
            requiresApproval,
            approved: false,
            decision: 'blocked',
            reason: 'missing_approval_record',
        };
    }
    if (!policy.requiredApproverRoles.includes(approval.role)) {
        return {
            suggestionId: suggestion.id,
            type: suggestion.type,
            requiresApproval,
            approved: false,
            decision: 'blocked',
            reason: `invalid_approver_role:${approval.role}`,
        };
    }
    if (policy.requireSignedApprovalRecord && !verifySignature(approval)) {
        return {
            suggestionId: suggestion.id,
            type: suggestion.type,
            requiresApproval,
            approved: false,
            decision: 'blocked',
            reason: 'invalid_approval_signature',
        };
    }
    const ageMinutes = (Date.now() - new Date(approval.approvedAt).getTime()) / 60000;
    if (ageMinutes > policy.maxApprovalAgeMinutes) {
        return {
            suggestionId: suggestion.id,
            type: suggestion.type,
            requiresApproval,
            approved: false,
            decision: 'blocked',
            reason: `approval_stale:${ageMinutes.toFixed(2)}m`,
        };
    }
    return {
        suggestionId: suggestion.id,
        type: suggestion.type,
        requiresApproval,
        approved: true,
        decision: 'executed',
        reason: `approved_by:${approval.approver}`,
    };
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const timestamp = utcTimestampCompact(new Date());
    const runId = `ai-approval-gate-${timestamp}`;
    const policyPath = path.resolve(args.policyPath ?? path.join(repoRoot, 'governance/policies/ai-approval-gate-policy.json'));
    const reportPath = path.resolve(args.reportDir ?? path.join(backendRoot, 'tmp/liveops-artifacts'), `ai-03-approval-gate-${timestamp}.json`);
    const approvalRecordPath = path.resolve(args.workDir ?? path.join(backendRoot, 'tmp/ai-approval-gate', runId), 'approvals.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.mkdir(path.dirname(approvalRecordPath), { recursive: true });
    const policy = await readPolicy(policyPath);
    const suggestions = [
        {
            id: 'SUG-BAL-001',
            type: 'balancing',
            summary: 'Increase event reward multiplier by +8% for stage cohort.',
            risk: 'medium',
        },
        {
            id: 'SUG-DEP-001',
            type: 'deployment',
            summary: 'Promote rollout config from stage to prod channel.',
            risk: 'high',
        },
    ];
    const deniedWithoutApproval = suggestions.map((suggestion) => evaluateGate(suggestion, policy, []));
    const approvalSeed = suggestions.map((suggestion, index) => {
        const base = {
            suggestionId: suggestion.id,
            approver: index === 0 ? 'liveops-owner' : 'sre-owner',
            role: index === 0 ? 'LiveOpsLead' : 'SRELead',
            approvedAt: new Date().toISOString(),
            reason: index === 0 ? 'validated-economy-sim' : 'validated-rollout-and-rollback-plan',
        };
        return {
            ...base,
            signature: signRecord(base),
        };
    });
    await fs.writeFile(approvalRecordPath, JSON.stringify({ schemaVersion: 1, approvals: approvalSeed }, null, 2), 'utf8');
    const executedWithApproval = suggestions.map((suggestion) => evaluateGate(suggestion, policy, approvalSeed));
    const checks = [
        {
            name: 'gate-blocks-without-approval',
            status: deniedWithoutApproval.every((decision) => decision.decision === 'blocked') ? 'pass' : 'fail',
            details: deniedWithoutApproval.map((decision) => `${decision.suggestionId}:${decision.reason}`).join(', '),
        },
        {
            name: 'gate-allows-with-explicit-approval',
            status: executedWithApproval.every((decision) => decision.decision === 'executed') ? 'pass' : 'fail',
            details: executedWithApproval.map((decision) => `${decision.suggestionId}:${decision.reason}`).join(', '),
        },
    ];
    const status = checks.every((check) => check.status === 'pass') ? 'pass' : 'fail';
    const artifact = {
        schemaVersion: 1,
        pipeline: 'AI-03',
        status,
        generatedAt: new Date().toISOString(),
        runId,
        policyPath,
        reportPath,
        approvalRecordPath,
        policy,
        suggestions,
        checks,
        deniedWithoutApproval,
        executedWithApproval,
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
