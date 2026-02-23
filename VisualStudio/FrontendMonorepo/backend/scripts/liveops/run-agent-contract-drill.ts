import fs from 'node:fs';
import path from 'node:path';

import { PoseidonAgent } from '../../src/poseidon/agent';
import { ToolExecutionContext } from '../../src/poseidon/tool-interfaces';

type StepStatus = 'pass' | 'fail';

type AgentDomain = 'Engineering' | 'QA' | 'LiveOps' | 'SRE' | 'Security';

type Contract = {
  agent: AgentDomain;
  contractVersion: string;
  allowedTools: string[];
  deniedByDefault: true;
};

type DrillArtifact = {
  schemaVersion: number;
  pipeline: 'AI-01';
  status: StepStatus;
  generatedAt: string;
  reportPath: string;
  contractPath: string;
  steps: Array<{
    name: string;
    status: StepStatus;
    details: string;
  }>;
  contracts: Contract[];
};

const CONTRACT_VERSION = '2026-02-18.v1';

const CONTRACTS: Contract[] = [
  {
    agent: 'Engineering',
    contractVersion: CONTRACT_VERSION,
    allowedTools: ['file.read', 'file.write', 'code.build', 'code.test', 'git.diff'],
    deniedByDefault: true,
  },
  {
    agent: 'QA',
    contractVersion: CONTRACT_VERSION,
    allowedTools: ['file.read', 'code.test', 'code.lint'],
    deniedByDefault: true,
  },
  {
    agent: 'LiveOps',
    contractVersion: CONTRACT_VERSION,
    allowedTools: ['file.read', 'event.validate', 'event.stage'],
    deniedByDefault: true,
  },
  {
    agent: 'SRE',
    contractVersion: CONTRACT_VERSION,
    allowedTools: ['file.read', 'deploy.preflight', 'deploy.rollback', 'health.check'],
    deniedByDefault: true,
  },
  {
    agent: 'Security',
    contractVersion: CONTRACT_VERSION,
    allowedTools: ['file.read', 'secrets.audit', 'secrets.rotate', 'policy.validate'],
    deniedByDefault: true,
  },
];

function parseArgs(argv: string[]): Record<string, string> {
  return argv.reduce<Record<string, string>>((accumulator, argument) => {
    const [rawKey, ...rest] = argument.split('=');
    if (!rawKey?.startsWith('--') || rest.length === 0) {
      return accumulator;
    }

    accumulator[rawKey.slice(2)] = rest.join('=');
    return accumulator;
  }, {});
}

function utcTimestampCompact(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function writeJson(filePath: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
}

function isToolAllowed(contract: Contract, tool: string): boolean {
  return contract.allowedTools.includes(tool);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const now = new Date();
  const timestamp = utcTimestampCompact(now);

  const backendRoot = path.resolve(__dirname, '..', '..');
  const reportPath = path.resolve(args.reportDir ?? path.join(backendRoot, 'tmp/liveops-artifacts'), `ai-01-agent-contract-${timestamp}.json`);
  const contractPath = path.resolve(args.contractDir ?? path.join(backendRoot, 'tmp/agent-contracts'), `agent-contracts-${timestamp}.json`);

  const steps: DrillArtifact['steps'] = [];

  try {
    writeJson(contractPath, {
      schemaVersion: 1,
      generatedAt: now.toISOString(),
      contracts: CONTRACTS,
    });

    steps.push({
      name: 'agent-contracts:versioned-contracts-published',
      status: 'pass',
      details: `Published ${CONTRACTS.length} domain contracts at ${contractPath}`,
    });

    const contractFailures: string[] = [];
    for (const contract of CONTRACTS) {
      if (!contract.contractVersion || contract.allowedTools.length === 0 || contract.deniedByDefault !== true) {
        contractFailures.push(`Invalid contract for ${contract.agent}`);
      }

      if (isToolAllowed(contract, 'tool.unknown') || isToolAllowed(contract, 'admin.root')) {
        contractFailures.push(`Deny-by-default failed for ${contract.agent}`);
      }
    }

    if (contractFailures.length > 0) {
      throw new Error(contractFailures.join('; '));
    }

    steps.push({
      name: 'agent-contracts:deny-by-default-policy',
      status: 'pass',
      details: 'Unknown tools are denied for every domain contract',
    });

    const sandboxRoot = path.resolve(backendRoot, 'tmp/agent-contract-deny-default');
    fs.mkdirSync(sandboxRoot, { recursive: true });
    const noWriteContext: ToolExecutionContext = {
      user: 'security-enforcer',
      sandboxRoot,
      allowWrites: false,
    };

    const guardedAgent = new PoseidonAgent(noWriteContext);

    try {
      await guardedAgent.safeWriteFile('deny-default-test.txt', 'blocked');
      throw new Error('Write succeeded unexpectedly when allowWrites=false');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown_error';
      if (!message.includes('File writes are not allowed')) {
        throw error;
      }
    }

    steps.push({
      name: 'agent-contracts:runtime-deny-default-enforced',
      status: 'pass',
      details: 'Runtime guard prevented write when write permission was disabled',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    steps.push({
      name: 'agent-contracts:validation',
      status: 'fail',
      details: message,
    });
  }

  const status: StepStatus = steps.every((step) => step.status === 'pass') ? 'pass' : 'fail';

  const artifact: DrillArtifact = {
    schemaVersion: 1,
    pipeline: 'AI-01',
    status,
    generatedAt: new Date().toISOString(),
    reportPath,
    contractPath,
    steps,
    contracts: CONTRACTS,
  };

  writeJson(reportPath, artifact);
  console.log(JSON.stringify(artifact, null, 2));

  if (status === 'fail') {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'unknown_error';
  console.error(JSON.stringify({ error: message }, null, 2));
  process.exit(1);
});
