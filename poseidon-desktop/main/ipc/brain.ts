import { ipcMain } from 'electron';

// The "brain" orchestrates tool calls and LLM for end-to-end automation
ipcMain.handle('poseidon:brain', async (_event, message: string) => {
  const lower = message.toLowerCase();
  // 1. Health check intent
  if (/\b(health|status|uptime|system)\b/.test(lower)) {
    const snapshot = await ipcMain.emitWithResult('tools:observabilitySnapshot');
    const health = snapshot?.health || { status: 'unknown' };
    const services = snapshot?.services || [];
    let summary = `Backend health: ${health.status || 'unknown'}`;
    if (Array.isArray(services)) {
      summary += '\nService status:';
      for (const s of services) summary += `\n  ${s.name} (port ${s.port}): ${s.open ? 'running' : 'not running'}`;
    }
    if (Array.isArray(snapshot?.alerts) && snapshot.alerts.length > 0) {
      summary += '\nAlerts:';
      for (const alert of snapshot.alerts) summary += `\n  - ${alert.severity.toUpperCase()}: ${alert.message}`;
    }
    return { role: 'poseidon', text: summary };
  }
  // 2. Run command
  if (/\b(run|start|stop|restart|exec|command)\b/.test(lower)) {
    const match = message.match(/run ([^\n]+)/i);
    if (match) {
      const result = await ipcMain.emitWithResult('tools:runCommand', match[1]);
      return { role: 'poseidon', text: result.status === 'ok' ? result.output : `Error: ${result.error}` };
    }
  }
  // 3. .env/config
  if (/\b(env|config|variable)\b/.test(lower)) {
    const env = await ipcMain.emitWithResult('tools:readEnv');
    if (env.status === 'ok') {
      return { role: 'poseidon', text: 'Env variables:\n' + JSON.stringify(env.env, null, 2) };
    } else {
      return { role: 'poseidon', text: `Error: ${env.error}` };
    }
  }
  // 4. Log/error search
  if (/\b(log|error|warn|fail)\b/.test(lower)) {
    const match = message.match(/log ([^\n]+)/i);
    const file = match ? match[1] : 'logs/app.log';
    const result = await ipcMain.emitWithResult('tools:searchLogs', file);
    if (result.status === 'ok') {
      return { role: 'poseidon', text: 'Log matches:\n' + result.matches.join('\n') };
    } else {
      return { role: 'poseidon', text: `Error: ${result.error}` };
    }
  }
  // 5. Git status
  if (/\b(git|branch|commit|repo)\b/.test(lower)) {
    const result = await ipcMain.emitWithResult('tools:getGitStatus');
    return { role: 'poseidon', text: result.status === 'ok' ? result.output : `Error: ${result.error}` };
  }
  // 6. Plugin system
  if (/\bplugin\b/.test(lower)) {
    const match = message.match(/plugin ([^\s]+)(.*)/i);
    if (match) {
      const pluginName = match[1];
      const args = match[2] ? match[2].trim().split(/\s+/) : [];
      const result = await ipcMain.emitWithResult('tools:runPlugin', pluginName, ...args);
      return { role: 'poseidon', text: result.status === 'ok' ? JSON.stringify(result.result) : `Error: ${result.error}` };
    }
  }
  // 7. Observability/telemetry
  if (/\b(metric|telemetry|track|alert)\b/.test(lower)) {
    const match = message.match(/track ([^\s]+) (.+)/i);
    if (match) {
      const metric = match[1];
      const value = match[2];
      await ipcMain.emitWithResult('tools:trackMetric', metric, value);
      return { role: 'poseidon', text: `Metric ${metric} tracked with value: ${value}` };
    }
  }
  // 8. Test runner
  if (/\b(test|jest|cypress)\b/.test(lower)) {
    const match = message.match(/test ([^\s]+)/i);
    const runner = match ? match[1] : 'jest';
    const result = await ipcMain.emitWithResult('tools:runTests', runner);
    return { role: 'poseidon', text: result.status === 'ok' ? result.output : `Error: ${result.error}` };
  }
  // 9. Incident runbook
  if (/\b(runbook|incident)\b/.test(lower)) {
    if (/\b(start|begin|launch)\b/.test(lower)) {
      const start = await ipcMain.emitWithResult('tools:incidentRunbookStart', 'backend-outage');
      if (start.status !== 'ok') {
        return { role: 'poseidon', text: `Error: ${start.error}` };
      }
      return { role: 'poseidon', text: `Incident runbook started: ${start.run.runId}` };
    }
    const idMatch = message.match(/run\s*id[:\s]+([a-z0-9\-]+)/i);
    if (/\b(next|step)\b/.test(lower) && idMatch) {
      const execNext = await ipcMain.emitWithResult('tools:incidentRunbookExecuteNext', idMatch[1]);
      if (execNext.status !== 'ok') {
        return { role: 'poseidon', text: `Runbook step failed: ${execNext.error}` };
      }
      return { role: 'poseidon', text: `Runbook progress (${execNext.run.status}): ${execNext.run.runId}` };
    }
    if (/\b(status|show)\b/.test(lower) && idMatch) {
      const status = await ipcMain.emitWithResult('tools:incidentRunbookStatus', idMatch[1]);
      if (status.status !== 'ok') {
        return { role: 'poseidon', text: `Error: ${status.error}` };
      }
      const pending = status.run.steps.filter((s: any) => s.status === 'pending').length;
      const failed = status.run.steps.filter((s: any) => s.status === 'failed').length;
      return { role: 'poseidon', text: `Runbook ${status.run.runId}: ${status.run.status} (pending=${pending}, failed=${failed})` };
    }
    return { role: 'poseidon', text: 'Incident runbook commands: "start runbook", "run id: <id> next", "run id: <id> status"' };
  }
  // Fallback: use LLM (cloud/local)
  // (You can expand this to call LLM IPC as needed)
  return { role: 'poseidon', text: `Echo: ${message}` };
});

// Helper: emitWithResult for IPC (since ipcMain.invoke can't be called from main)
ipcMain.emitWithResult = async function(channel, ...args) {
  return await new Promise(resolve => {
    const event = { returnValue: undefined };
    ipcMain.emit(channel, event, ...args);
    resolve(event.returnValue);
  });
};
