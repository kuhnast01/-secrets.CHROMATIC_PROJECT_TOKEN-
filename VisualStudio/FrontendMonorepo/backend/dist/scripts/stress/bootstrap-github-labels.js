class ToolError extends Error {
    constructor(message, errorType, exitCode) {
        super(message);
        this.errorType = errorType;
        this.exitCode = exitCode;
    }
}
function usageError(message) {
    return new ToolError(message, 'usage', 2);
}
function authError(message) {
    return new ToolError(message, 'auth', 3);
}
function apiError(message) {
    return new ToolError(message, 'api', 4);
}
const DEFAULT_LABELS = [
    { name: 'reliability', color: '0e8a16', description: 'Reliability and resilience tracking' },
    { name: 'backend', color: '1d76db', description: 'Backend domain' },
    { name: 'performance', color: '5319e7', description: 'Performance and latency tracking' },
    { name: 'kpi:legal-drift-review', color: '5319e7', description: 'KPI tracking label for quarterly legal drift review' },
    { name: 'reliability-spike', color: 'fbca04', description: 'Spike-profile reliability signal' },
    { name: 'reliability-soak', color: 'd93f0b', description: 'Soak-profile reliability signal' },
    { name: 'stress-spike', color: 'fef2c0', description: 'Stress regression in spike profile' },
    { name: 'stress-soak', color: 'f9d0c4', description: 'Stress regression in soak profile' },
];
function parseRepoContext(raw) {
    const source = raw || process.env.GITHUB_REPOSITORY;
    if (!source || !source.includes('/')) {
        throw usageError('Repository not provided. Pass owner/repo as first arg or set GITHUB_REPOSITORY.');
    }
    const [owner, repo] = source.split('/', 2);
    if (!owner || !repo) {
        throw usageError(`Invalid repository format: ${source}. Expected owner/repo.`);
    }
    return { owner, repo };
}
function printUsage() {
    console.log('Usage: pnpm run stress:labels:bootstrap -- [owner/repo] [--repo owner/repo] [--dry-run] [--list-defaults] [--json]');
    console.log('');
    console.log('Flags:');
    console.log('  --repo <owner/repo>   Explicit repository target (overrides positional arg).');
    console.log('  --dry-run             Preview labels that would be created using GitHub API.');
    console.log('  --list-defaults       Print built-in label definitions and exit (no token/API required).');
    console.log('  --json                Emit machine-readable JSON output.');
    console.log('  --help                Show this help text.');
    console.log('');
    console.log('Environment:');
    console.log('  GITHUB_TOKEN or GH_TOKEN (required for create and dry-run modes).');
    console.log('  GITHUB_REPOSITORY=owner/repo (optional fallback when repo arg is omitted).');
}
function printUsageJson() {
    emitJson({
        ok: true,
        mode: 'help',
        message: 'Usage: stress:labels:bootstrap [owner/repo] [--repo owner/repo] [--dry-run] [--list-defaults] [--json]',
    });
}
function printDefaultLabels() {
    console.log('Default labels:');
    for (const label of DEFAULT_LABELS) {
        console.log(`- ${label.name} (${label.color}): ${label.description}`);
    }
}
function emitJson(result) {
    console.log(JSON.stringify(result, null, 2));
}
function argvHasJsonFlag(argv) {
    return argv.includes('--json');
}
function parseCliOptions(argv) {
    const positionalArgs = [];
    let dryRun = false;
    let listDefaults = false;
    let help = false;
    let json = false;
    let repoArg;
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--dry-run') {
            dryRun = true;
            continue;
        }
        if (arg === '--list-defaults') {
            listDefaults = true;
            continue;
        }
        if (arg === '--help' || arg === '-h') {
            help = true;
            continue;
        }
        if (arg === '--json') {
            json = true;
            continue;
        }
        if (arg === '--repo') {
            const repoValue = argv[index + 1];
            if (!repoValue || repoValue.startsWith('--')) {
                throw usageError('Missing value for --repo. Expected owner/repo.');
            }
            repoArg = repoValue;
            index += 1;
            continue;
        }
        if (arg.startsWith('--')) {
            throw usageError(`Unknown option: ${arg}`);
        }
        positionalArgs.push(arg);
    }
    if (!repoArg && positionalArgs.length > 0) {
        repoArg = positionalArgs[0];
    }
    if (positionalArgs.length > 1) {
        throw usageError('Too many positional arguments. Expected at most one: owner/repo.');
    }
    return {
        repoArg,
        dryRun,
        listDefaults,
        help,
        json,
    };
}
function requireToken() {
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!token) {
        throw authError('Missing token. Set GITHUB_TOKEN (or GH_TOKEN) with repo scope.');
    }
    return token;
}
async function githubRequest(token, path, method = 'GET', body) {
    let response;
    try {
        response = await fetch(`https://api.github.com${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'User-Agent': 'backend-stress-label-bootstrap',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw apiError(`GitHub API request failed: ${message}`);
    }
    if (!response.ok) {
        const text = await response.text();
        if (response.status === 401 || response.status === 403) {
            throw authError(`GitHub API authentication failed (${response.status}): ${text}`);
        }
        throw apiError(`GitHub API ${method} ${path} failed: ${response.status} ${text}`);
    }
    return (await response.json());
}
async function main() {
    const options = parseCliOptions(process.argv.slice(2));
    if (options.help) {
        if (options.json) {
            printUsageJson();
        }
        else {
            printUsage();
        }
        return;
    }
    if (options.listDefaults) {
        if (options.json) {
            emitJson({
                ok: true,
                mode: 'list-defaults',
                labels: DEFAULT_LABELS,
                message: 'Built-in label definitions.',
            });
        }
        else {
            printDefaultLabels();
        }
        return;
    }
    const token = requireToken();
    const { owner, repo } = parseRepoContext(options.repoArg);
    if (!options.json) {
        console.log(`Bootstrapping stress/reliability labels for ${owner}/${repo}${options.dryRun ? ' (dry run)' : ''}...`);
    }
    const existingLabels = await githubRequest(token, `/repos/${owner}/${repo}/labels?per_page=100`);
    const existingNames = new Set(existingLabels.map((label) => label.name));
    const toCreate = DEFAULT_LABELS.filter((label) => !existingNames.has(label.name));
    if (toCreate.length === 0) {
        if (options.json) {
            emitJson({
                ok: true,
                mode: options.dryRun ? 'dry-run' : 'apply',
                repository: `${owner}/${repo}`,
                dryRun: options.dryRun,
                existingCount: existingNames.size,
                missingLabels: [],
                createdLabels: [],
                message: 'All required labels already exist. Nothing to create.',
            });
        }
        else {
            console.log('All required labels already exist. Nothing to create.');
        }
        return;
    }
    if (options.dryRun) {
        if (options.json) {
            emitJson({
                ok: true,
                mode: 'dry-run',
                repository: `${owner}/${repo}`,
                dryRun: true,
                existingCount: existingNames.size,
                missingLabels: toCreate,
                createdLabels: [],
                message: `Dry run complete. ${toCreate.length} label(s) would be created.`,
            });
        }
        else {
            console.log('Dry run mode enabled. The following labels would be created:');
            for (const label of toCreate) {
                console.log(`- ${label.name} (${label.color}): ${label.description}`);
            }
        }
        return;
    }
    const createdLabels = [];
    for (const label of toCreate) {
        await githubRequest(token, `/repos/${owner}/${repo}/labels`, 'POST', label);
        createdLabels.push(label.name);
        if (!options.json) {
            console.log(`Created label: ${label.name}`);
        }
    }
    if (options.json) {
        emitJson({
            ok: true,
            mode: 'apply',
            repository: `${owner}/${repo}`,
            dryRun: false,
            existingCount: existingNames.size,
            missingLabels: toCreate,
            createdLabels,
            message: `Label bootstrap complete. Created ${createdLabels.length} label(s).`,
        });
    }
    else {
        console.log(`Label bootstrap complete. Created ${toCreate.length} label(s).`);
    }
}
main().catch((error) => {
    const isToolError = error instanceof ToolError;
    const message = error instanceof Error ? error.message : String(error);
    const exitCode = isToolError ? error.exitCode : 1;
    const errorType = isToolError ? error.errorType : 'unknown';
    if (argvHasJsonFlag(process.argv.slice(2))) {
        emitJson({
            ok: false,
            mode: 'error',
            message,
            errorType,
            exitCode,
        });
    }
    else {
        console.error(message);
    }
    process.exit(exitCode);
});
export {};
