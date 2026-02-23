export interface EventRow {
  time?: number;
  event?: string;
  reason?: string | null;
  valid?: boolean;
  revoked?: boolean;
  actorRole?: string | null;
}

export interface SummaryCounts {
  byEvent: Record<string, number>;
  byReason: Record<string, number>;
  byDay: Record<string, number>;
  byRole: Record<string, number>;
}

export interface SummaryInput {
  lines: string[];
  sinceHours: number;
  nowMs?: number;
}

export interface SummaryResult {
  schemaVersion: number;
  window: {
    sinceHours: number;
    fromIso: string;
    toIso: string;
  };
  scanned: number;
  parsedRows: number;
  ignoredRows: number;
  trackedEvents: string[];
  counts: SummaryCounts;
}

export type OutputFormat = 'json' | 'csv';

export const TRACKED_EVENTS = new Set<string>([
  'license.tools.hash.executed',
  'license.tools.hash.rejected',
  'license.tools.validate.executed',
  'license.tools.validate.rejected',
]);

function bucketIsoDay(epochMs: number): string {
  return new Date(epochMs).toISOString().slice(0, 10);
}

function csvEscape(value: string): string {
  if (/[,"\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function mapToCsvRows(section: string, map: Record<string, number>): string[] {
  return Object.entries(map)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, count]) => [section, key, String(count)].map(csvEscape).join(','));
}

export function summarizeLicenseEvents(input: SummaryInput): SummaryResult {
  const now = input.nowMs ?? Date.now();
  const fromMs = now - input.sinceHours * 60 * 60 * 1000;

  let scanned = 0;
  let parsedRows = 0;
  let ignoredRows = 0;

  const byEvent: Record<string, number> = {};
  const byReason: Record<string, number> = {};
  const byDay: Record<string, number> = {};
  const byRole: Record<string, number> = {};

  for (const line of input.lines) {
    scanned += 1;
    const trimmed = line.trim();
    if (!trimmed) continue;

    let row: EventRow;
    try {
      row = JSON.parse(trimmed) as EventRow;
      parsedRows += 1;
    } catch {
      ignoredRows += 1;
      continue;
    }

    if (!row.event || !TRACKED_EVENTS.has(row.event)) {
      continue;
    }

    const eventTime = typeof row.time === 'number' ? row.time : undefined;
    if (eventTime && eventTime < fromMs) {
      continue;
    }

    byEvent[row.event] = (byEvent[row.event] ?? 0) + 1;

    const reasonKey = row.reason ?? (row.valid ? 'valid' : 'none');
    byReason[reasonKey] = (byReason[reasonKey] ?? 0) + 1;

    if (eventTime) {
      const dayKey = bucketIsoDay(eventTime);
      byDay[dayKey] = (byDay[dayKey] ?? 0) + 1;
    }

    const roleKey = row.actorRole ?? 'unknown';
    byRole[roleKey] = (byRole[roleKey] ?? 0) + 1;
  }

  return {
    schemaVersion: 1,
    window: {
      sinceHours: input.sinceHours,
      fromIso: new Date(fromMs).toISOString(),
      toIso: new Date(now).toISOString(),
    },
    scanned,
    parsedRows,
    ignoredRows,
    trackedEvents: Array.from(TRACKED_EVENTS.values()),
    counts: {
      byEvent,
      byReason,
      byDay,
      byRole,
    },
  };
}

export function renderSummary(result: SummaryResult, format: OutputFormat): string {
  if (format === 'json') {
    return JSON.stringify(result, null, 2);
  }

  const lines = [
    'section,key,count',
    ...mapToCsvRows('event', result.counts.byEvent),
    ...mapToCsvRows('reason', result.counts.byReason),
    ...mapToCsvRows('day', result.counts.byDay),
    ...mapToCsvRows('role', result.counts.byRole),
  ];

  return lines.join('\n');
}
