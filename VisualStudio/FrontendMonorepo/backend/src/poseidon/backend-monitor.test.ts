// Phase 2 Pillar 3: Backend + Monitoring Integration tests for Poseidon
import { BackendMonitor, LogEntry } from './backend-monitor';

describe('BackendMonitor', () => {
  let monitor: BackendMonitor;
  const now = Date.now();

  beforeEach(() => {
    monitor = new BackendMonitor();
  });

  it('should ingest logs and classify errors', () => {
    monitor.ingestLog({ timestamp: now, level: 'info', message: 'ok' });
    monitor.ingestLog({ timestamp: now, level: 'error', message: 'fail' });
    const result = monitor.classifyErrors();
    expect(result.errorCount).toBe(1);
    expect(result.errors[0].message).toBe('fail');
  });

  it('should summarize incidents', () => {
    monitor.ingestLog({ timestamp: now, level: 'error', message: 'crash' });
    const summary = monitor.summarizeIncidents();
    expect(summary).toContain('Incidents: 1 errors. Latest: crash');
  });

  it('should suggest patch if errors exist', () => {
    monitor.ingestLog({ timestamp: now, level: 'error', message: 'oops' });
    expect(monitor.suggestPatch()).toContain('Patch required');
  });

  it('should not suggest patch if no errors', () => {
    monitor.ingestLog({ timestamp: now, level: 'info', message: 'all good' });
    expect(monitor.suggestPatch()).toBe('No patch needed.');
  });
});
