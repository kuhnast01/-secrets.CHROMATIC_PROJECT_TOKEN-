import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
function formatPercent(value) {
    return `${(value * 100).toFixed(2)}%`;
}
function loadReport(path) {
    if (!existsSync(path)) {
        throw new Error(`Stress report not found: ${path}`);
    }
    return JSON.parse(readFileSync(path, 'utf8'));
}
function maybeLoadBaseline(path) {
    if (!path || !existsSync(path)) {
        return undefined;
    }
    return JSON.parse(readFileSync(path, 'utf8'));
}
function parseNumberEnv(name, fallback) {
    const value = process.env[name];
    if (!value)
        return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}
function getRegressionConfig() {
    const failOnWarningRaw = (process.env.STRESS_REGRESSION_FAIL_ON_WARN || 'false').toLowerCase();
    return {
        maxP95IncreaseMs: parseNumberEnv('STRESS_REGRESSION_WARN_P95_MS', 20),
        maxErrorRateIncrease: parseNumberEnv('STRESS_REGRESSION_WARN_ERROR_RATE', 0.002),
        maxRequestDropRatio: parseNumberEnv('STRESS_REGRESSION_WARN_REQUEST_DROP_RATIO', 0.2),
        failOnWarning: failOnWarningRaw === 'true' || failOnWarningRaw === '1' || failOnWarningRaw === 'yes',
    };
}
function getRegressionWarnings(report, baseline, config) {
    if (!baseline || baseline.profile !== report.profile) {
        return [];
    }
    const warnings = [];
    for (const result of report.results) {
        const baselineResult = baseline.results.find((item) => item.path === result.path);
        if (!baselineResult)
            continue;
        const p95Delta = result.p95 - baselineResult.p95;
        if (p95Delta > config.maxP95IncreaseMs) {
            warnings.push({
                path: result.path,
                metric: 'p95',
                current: result.p95,
                baseline: baselineResult.p95,
                threshold: config.maxP95IncreaseMs,
                delta: p95Delta,
            });
        }
        const errorRateDelta = result.errorRate - baselineResult.errorRate;
        if (errorRateDelta > config.maxErrorRateIncrease) {
            warnings.push({
                path: result.path,
                metric: 'errorRate',
                current: result.errorRate,
                baseline: baselineResult.errorRate,
                threshold: config.maxErrorRateIncrease,
                delta: errorRateDelta,
            });
        }
        const requestDropRatio = baselineResult.total > 0 ? (baselineResult.total - result.total) / baselineResult.total : 0;
        if (requestDropRatio > config.maxRequestDropRatio) {
            warnings.push({
                path: result.path,
                metric: 'requestDrop',
                current: result.total,
                baseline: baselineResult.total,
                threshold: config.maxRequestDropRatio,
                delta: requestDropRatio,
            });
        }
    }
    return warnings;
}
function buildSummary(report, baseline, baselinePath, config, warnings) {
    const lines = [];
    const baselineProvided = Boolean(baselinePath);
    const baselineLoaded = Boolean(baseline);
    const baselineComparable = Boolean(baseline && baseline.profile === report.profile);
    lines.push('## Backend Stress Summary');
    lines.push('');
    lines.push(`- Profile: \`${report.profile}\``);
    lines.push(`- Base URL: \`${report.baseUrl}\``);
    lines.push(`- Generated: \`${report.generatedAt}\``);
    lines.push(`- Overall: **${report.passed ? 'PASS' : 'FAIL'}**`);
    if (baselineProvided) {
        const baselineStatus = baselineComparable ? 'loaded and comparable' : baselineLoaded ? 'profile mismatch' : 'missing/unreadable';
        lines.push(`- Baseline: \`${baselinePath}\` (${baselineStatus})`);
    }
    else {
        lines.push('- Baseline: not provided');
    }
    lines.push('');
    lines.push('| Endpoint | Total Requests | p95 (ms) | Error Rate | Status |');
    lines.push('|---|---:|---:|---:|---|');
    for (const result of report.results) {
        lines.push(`| ${result.path} | ${result.total} | ${result.p95} | ${formatPercent(result.errorRate)} | ${result.passed ? 'PASS' : 'FAIL'} |`);
    }
    lines.push('');
    lines.push('### Thresholds');
    lines.push(`- max error rate: \`${formatPercent(report.config.thresholds.maxErrorRate)}\``);
    lines.push(`- max p95: \`${report.config.thresholds.maxP95Ms}ms\``);
    lines.push(`- min requests: \`${report.config.thresholds.minRequests}\``);
    if (baselineComparable && baseline) {
        lines.push('');
        lines.push('### Baseline Delta');
        lines.push('| Endpoint | p95 Delta (ms) | Error Rate Delta | Request Delta |');
        lines.push('|---|---:|---:|---:|');
        for (const result of report.results) {
            const baselineResult = baseline.results.find((item) => item.path === result.path);
            if (!baselineResult)
                continue;
            const p95Delta = result.p95 - baselineResult.p95;
            const errDelta = result.errorRate - baselineResult.errorRate;
            const reqDelta = result.total - baselineResult.total;
            lines.push(`| ${result.path} | ${p95Delta} | ${formatPercent(errDelta)} | ${reqDelta} |`);
        }
    }
    if (baselineComparable && baseline) {
        lines.push('');
        lines.push('### Regression Guardrails');
        lines.push(`- max p95 increase: \`${config.maxP95IncreaseMs}ms\``);
        lines.push(`- max error-rate increase: \`${formatPercent(config.maxErrorRateIncrease)}\``);
        lines.push(`- max request drop ratio: \`${formatPercent(config.maxRequestDropRatio)}\``);
        lines.push(`- fail on warning: \`${config.failOnWarning ? 'true' : 'false'}\``);
        if (warnings.length === 0) {
            lines.push('- drift check: PASS');
        }
        else {
            lines.push(`- drift check: WARN (${warnings.length})`);
            lines.push('');
            lines.push('| Endpoint | Metric | Baseline | Current | Delta | Threshold |');
            lines.push('|---|---|---:|---:|---:|---:|');
            for (const warning of warnings) {
                const baselineDisplay = warning.metric === 'errorRate' ? formatPercent(warning.baseline) : warning.baseline.toString();
                const currentDisplay = warning.metric === 'errorRate' ? formatPercent(warning.current) : warning.current.toString();
                const deltaDisplay = warning.metric === 'errorRate' || warning.metric === 'requestDrop'
                    ? formatPercent(warning.delta)
                    : warning.delta.toString();
                const thresholdDisplay = warning.metric === 'errorRate' || warning.metric === 'requestDrop'
                    ? formatPercent(warning.threshold)
                    : warning.threshold.toString();
                lines.push(`| ${warning.path} | ${warning.metric} | ${baselineDisplay} | ${currentDisplay} | ${deltaDisplay} | ${thresholdDisplay} |`);
            }
        }
    }
    else if (baselineProvided) {
        lines.push('');
        lines.push('### Regression Guardrails');
        lines.push(`- max p95 increase: \`${config.maxP95IncreaseMs}ms\``);
        lines.push(`- max error-rate increase: \`${formatPercent(config.maxErrorRateIncrease)}\``);
        lines.push(`- max request drop ratio: \`${formatPercent(config.maxRequestDropRatio)}\``);
        lines.push(`- fail on warning: \`${config.failOnWarning ? 'true' : 'false'}\``);
        if (baselineLoaded) {
            lines.push('- drift check: SKIPPED (baseline profile mismatch)');
        }
        else {
            lines.push('- drift check: SKIPPED (baseline missing/unreadable)');
        }
    }
    lines.push('');
    return lines.join('\n');
}
function main() {
    const reportPath = process.argv[2] || 'stress-artifacts/stress-smoke-report.json';
    const outputPath = process.argv[3] || 'stress-artifacts/stress-summary.md';
    const baselinePath = process.argv[4];
    const metadataPath = process.argv[5] || outputPath.replace(/\.md$/i, '.meta.json');
    const report = loadReport(reportPath);
    const baseline = maybeLoadBaseline(baselinePath);
    const regressionConfig = getRegressionConfig();
    const warnings = getRegressionWarnings(report, baseline, regressionConfig);
    const baselineComparable = Boolean(baseline && baseline.profile === report.profile);
    const markdown = buildSummary(report, baseline, baselinePath, regressionConfig, warnings);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, markdown);
    console.log(`Wrote stress summary: ${outputPath}`);
    const metadata = {
        profile: report.profile,
        reportPassed: report.passed,
        warningCount: warnings.length,
        baselinePath,
        baselineComparable,
        failOnWarning: regressionConfig.failOnWarning,
        generatedAt: new Date().toISOString(),
    };
    mkdirSync(dirname(metadataPath), { recursive: true });
    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`Wrote stress summary metadata: ${metadataPath}`);
    if (!report.passed) {
        process.exit(1);
    }
    if (warnings.length > 0) {
        console.warn(`Stress regression warnings: ${warnings.length}`);
        if (regressionConfig.failOnWarning) {
            process.exit(1);
        }
    }
}
main();
