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
function evaluateScenario(scenario, policy, values) {
    const signals = [
        {
            name: 'economy_delta_percent',
            value: values.economyDeltaPercent,
            threshold: policy.riskThresholds.maxEconomyDeltaPercent,
            passed: values.economyDeltaPercent <= policy.riskThresholds.maxEconomyDeltaPercent,
        },
        {
            name: 'whale_advantage_index',
            value: values.whaleAdvantageIndex,
            threshold: policy.riskThresholds.maxWhaleAdvantageIndex,
            passed: values.whaleAdvantageIndex <= policy.riskThresholds.maxWhaleAdvantageIndex,
        },
        {
            name: 'inflation_risk_score',
            value: values.inflationRiskScore,
            threshold: policy.riskThresholds.maxInflationRiskScore,
            passed: values.inflationRiskScore <= policy.riskThresholds.maxInflationRiskScore,
        },
        {
            name: 'payout_per_user',
            value: values.payoutPerUser,
            threshold: policy.riskThresholds.maxPayoutPerUser,
            passed: values.payoutPerUser <= policy.riskThresholds.maxPayoutPerUser,
        },
    ];
    const reasons = signals.filter((signal) => !signal.passed).map((signal) => `${signal.name}:${signal.value}>${signal.threshold}`);
    const hasViolations = reasons.length > 0;
    const publishDecision = policy.blockPublishOnViolation
        ? hasViolations
            ? 'block'
            : 'allow'
        : 'allow';
    return {
        scenario,
        publishDecision,
        reasons,
        signals,
    };
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const timestamp = utcTimestampCompact(new Date());
    const runId = `no-code-economy-sim-${timestamp}`;
    const policyPath = path.resolve(args.policyPath ?? path.join(repoRoot, 'governance/policies/no-code-economy-simulation-policy.json'));
    const reportPath = path.resolve(args.reportDir ?? path.join(backendRoot, 'tmp/liveops-artifacts'), `nc-02-economy-simulation-${timestamp}.json`);
    const simulationPath = path.resolve(args.workDir ?? path.join(backendRoot, 'tmp/liveops-simulation', runId), 'economy-simulation.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.mkdir(path.dirname(simulationPath), { recursive: true });
    const policy = await readPolicy(policyPath);
    const validScenario = evaluateScenario('valid', policy, {
        economyDeltaPercent: 8.5,
        whaleAdvantageIndex: 1.9,
        inflationRiskScore: 0.42,
        payoutPerUser: 1450,
    });
    const invalidScenario = evaluateScenario('invalid', policy, {
        economyDeltaPercent: 21.4,
        whaleAdvantageIndex: 3.2,
        inflationRiskScore: 0.78,
        payoutPerUser: 4600,
    });
    await fs.writeFile(simulationPath, JSON.stringify({
        schemaVersion: 1,
        runId,
        generatedAt: new Date().toISOString(),
        scenarios: [validScenario, invalidScenario],
    }, null, 2), 'utf8');
    const requiredSignalSet = new Set(policy.requiredSignals);
    const checks = [
        {
            name: 'required-signals-present',
            status: [validScenario, invalidScenario]
                .flatMap((scenario) => scenario.signals)
                .every((signal) => requiredSignalSet.has(signal.name))
                ? 'pass'
                : 'fail',
            details: `required=${policy.requiredSignals.join(',')}`,
        },
        {
            name: 'valid-scenario-allows-publish',
            status: validScenario.publishDecision === 'allow' ? 'pass' : 'fail',
            details: `decision=${validScenario.publishDecision}`,
        },
        {
            name: 'invalid-scenario-blocks-publish',
            status: invalidScenario.publishDecision === 'block' ? 'pass' : 'fail',
            details: invalidScenario.reasons.join(', ') || 'no_violation_reasons',
        },
    ];
    const status = checks.every((check) => check.status === 'pass') ? 'pass' : 'fail';
    const artifact = {
        schemaVersion: 1,
        pipeline: 'NC-02',
        status,
        generatedAt: new Date().toISOString(),
        runId,
        policyPath,
        reportPath,
        simulationPath,
        policy,
        checks,
        validScenario,
        invalidScenario,
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
