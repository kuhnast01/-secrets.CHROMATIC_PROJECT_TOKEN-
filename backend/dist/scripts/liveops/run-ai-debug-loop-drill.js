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
async function readPolicy(policyPath) {
    const raw = await fs.readFile(policyPath, 'utf8');
    return JSON.parse(raw);
}
async function writeSeedArtifacts(logArtifactPath, testArtifactPath) {
    const logLines = [
        '[2026-02-18T20:20:00.000Z] INFO api starting regression sweep',
        '[2026-02-18T20:20:03.120Z] ERROR stage-regression checksum mismatch on channel=prod',
        '[2026-02-18T20:20:04.980Z] WARN cypress timeout waiting for rollout banner (8s)',
        '[2026-02-18T20:20:05.220Z] ERROR dependency audit detected moderate vulnerability in transitive package',
    ];
    const testArtifact = {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        total: 42,
        passed: 40,
        failed: 2,
        failingTests: [
            {
                suite: 'apps/web/liveops-regression',
                test: 'rollout banner renders on targeted stage users',
                error: 'TimeoutError: expected banner after 8000ms',
            },
            {
                suite: 'apps/mobile/event-guardrails',
                test: 'rollback prompt appears after risky reward delta',
                error: 'AssertionError: rollback prompt was not visible',
            },
        ],
    };
    await fs.mkdir(path.dirname(logArtifactPath), { recursive: true });
    await fs.mkdir(path.dirname(testArtifactPath), { recursive: true });
    await fs.writeFile(logArtifactPath, `${logLines.join('\n')}\n`, 'utf8');
    await fs.writeFile(testArtifactPath, JSON.stringify(testArtifact, null, 2), 'utf8');
}
function parseLogErrors(logText) {
    return logText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.includes('ERROR') || line.includes('WARN'));
}
function buildProposals(policy, logArtifactPath, testArtifactPath, logFindings, failingTests) {
    const proposals = [];
    if (failingTests.length > 0) {
        proposals.push({
            id: 'AI02-P0-TEST-FAILURES',
            priority: 'P0',
            category: 'test-failure',
            owner: policy.ownerByCategory['test-failure'] ?? 'Engineering',
            summary: 'Stabilize failing regression tests blocking release confidence.',
            rootCauseHypothesis: 'UI rollout synchronization and rollback prompt hooks are drifting from expected state transitions.',
            recommendedActions: [
                'Add deterministic wait for rollout-state hydration before banner assertions.',
                'Patch mobile rollback trigger predicate to use staged risk signal contract.',
                'Add unit coverage for rollback prompt visibility conditions.',
            ],
            command: 'pnpm exec jest apps/web/src apps/mobile/src --runInBand',
            evidence: [
                `${testArtifactPath}#failingTests`,
            ],
        });
    }
    const latencyHint = logFindings.find((line) => /timeout/i.test(line));
    if (latencyHint) {
        proposals.push({
            id: 'AI02-P1-LATENCY',
            priority: 'P1',
            category: 'latency',
            owner: policy.ownerByCategory['latency'] ?? 'SRE',
            summary: 'Reduce rollout validation timeout risk in staging checks.',
            rootCauseHypothesis: 'Rollout banner fetch path intermittently exceeds timeout budget under concurrent validation load.',
            recommendedActions: [
                'Instrument banner fetch latency histogram in staging.',
                'Raise retry budget from 1 to 3 with exponential backoff in regression harness.',
                'Alert when p95 exceeds 2.5s for rollout banner endpoint.',
            ],
            command: 'pnpm --dir backend exec tsx scripts/liveops/run-agent-slo-drill.ts',
            evidence: [
                `${logArtifactPath}#timeout-warning`,
            ],
        });
    }
    const dependencyHint = logFindings.find((line) => /dependency audit/i.test(line));
    if (dependencyHint) {
        proposals.push({
            id: 'AI02-P1-DEPENDENCY',
            priority: 'P1',
            category: 'dependency',
            owner: policy.ownerByCategory['dependency'] ?? 'Security',
            summary: 'Remediate moderate dependency advisory before next release lane promotion.',
            rootCauseHypothesis: 'A transitive package introduced by recent regression tooling update contains known advisory risk.',
            recommendedActions: [
                'Run production audit and capture vulnerable dependency tree.',
                'Pin patched transitive version via overrides and regenerate lockfile.',
                'Re-run MONO-03 supply-chain gate after patch.',
            ],
            command: 'pnpm run audit:prod',
            evidence: [
                `${logArtifactPath}#dependency-audit-error`,
            ],
        });
    }
    if (logFindings.some((line) => /checksum mismatch/i.test(line))) {
        proposals.push({
            id: 'AI02-P2-REGRESSION-GUARD',
            priority: 'P2',
            category: 'regression',
            owner: policy.ownerByCategory['regression'] ?? 'QA',
            summary: 'Harden stage->prod channel checksum consistency checks.',
            rootCauseHypothesis: 'Artifact promotion sequence can race with channel snapshot publication.',
            recommendedActions: [
                'Gate prod checksum verify on stage promotion completion marker.',
                'Persist stage and prod checksums in one canonical comparison report.',
            ],
            command: 'pnpm --dir backend exec tsx scripts/liveops/run-channel-regression.ts --channels=stage,prod',
            evidence: [
                `${logArtifactPath}#checksum-mismatch`,
            ],
        });
    }
    const order = new Map(policy.priorityOrder.map((item, idx) => [item, idx]));
    proposals.sort((a, b) => {
        const left = order.get(a.priority) ?? Number.MAX_SAFE_INTEGER;
        const right = order.get(b.priority) ?? Number.MAX_SAFE_INTEGER;
        if (left !== right)
            return left - right;
        return a.id.localeCompare(b.id);
    });
    return proposals;
}
function validateProposals(policy, proposals) {
    const checks = [];
    checks.push({
        name: 'proposal-count',
        status: proposals.length >= policy.minimumProposalCount ? 'pass' : 'fail',
        details: `found=${proposals.length}, required>=${policy.minimumProposalCount}`,
    });
    if (policy.requireCommandSuggestion) {
        const missingCommand = proposals.filter((proposal) => !proposal.command || proposal.command.trim().length === 0);
        checks.push({
            name: 'proposal-command-suggestions',
            status: missingCommand.length === 0 ? 'pass' : 'fail',
            details: missingCommand.length === 0 ? 'all proposals include commands' : `missing command count=${missingCommand.length}`,
        });
    }
    if (policy.requireEvidenceReference) {
        const missingEvidence = proposals.filter((proposal) => proposal.evidence.length === 0);
        checks.push({
            name: 'proposal-evidence-references',
            status: missingEvidence.length === 0 ? 'pass' : 'fail',
            details: missingEvidence.length === 0 ? 'all proposals include evidence references' : `missing evidence count=${missingEvidence.length}`,
        });
    }
    return checks;
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const timestamp = utcTimestampCompact(new Date());
    const runId = `ai-debug-loop-${timestamp}`;
    const policyPath = path.resolve(args.policyPath ?? path.join(repoRoot, 'governance/policies/ai-debug-loop-policy.json'));
    const reportPath = path.resolve(args.reportDir ?? path.join(backendRoot, 'tmp/liveops-artifacts'), `ai-02-debug-loop-${timestamp}.json`);
    const workDir = path.resolve(args.workDir ?? path.join(backendRoot, 'tmp/ai-debug-loop', runId));
    const logArtifactPath = path.join(workDir, 'debug.log');
    const testArtifactPath = path.join(workDir, 'test-results.json');
    const proposalPath = path.join(workDir, 'remediation-proposals.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.mkdir(workDir, { recursive: true });
    await writeSeedArtifacts(logArtifactPath, testArtifactPath);
    const policy = await readPolicy(policyPath);
    const logText = await fs.readFile(logArtifactPath, 'utf8');
    const testArtifact = JSON.parse(await fs.readFile(testArtifactPath, 'utf8'));
    const logFindings = parseLogErrors(logText);
    const proposals = buildProposals(policy, logArtifactPath, testArtifactPath, logFindings, testArtifact.failingTests);
    const checks = validateProposals(policy, proposals);
    await fs.writeFile(proposalPath, JSON.stringify({ schemaVersion: 1, runId, proposals }, null, 2), 'utf8');
    const status = checks.every((check) => check.status === 'pass') ? 'pass' : 'fail';
    const artifact = {
        schemaVersion: 1,
        pipeline: 'AI-02',
        status,
        generatedAt: new Date().toISOString(),
        runId,
        policyPath,
        reportPath,
        logArtifactPath,
        testArtifactPath,
        proposalPath,
        policy,
        sourceSummary: {
            logErrors: logFindings.length,
            testFailures: testArtifact.failed,
        },
        checks,
        proposals,
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
