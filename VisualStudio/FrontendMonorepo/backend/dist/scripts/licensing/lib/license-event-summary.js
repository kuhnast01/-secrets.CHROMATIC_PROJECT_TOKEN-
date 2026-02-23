export const TRACKED_EVENTS = new Set([
    'license.tools.hash.executed',
    'license.tools.hash.rejected',
    'license.tools.validate.executed',
    'license.tools.validate.rejected',
]);
function bucketIsoDay(epochMs) {
    return new Date(epochMs).toISOString().slice(0, 10);
}
function csvEscape(value) {
    if (/[,"\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
function mapToCsvRows(section, map) {
    return Object.entries(map)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, count]) => [section, key, String(count)].map(csvEscape).join(','));
}
export function summarizeLicenseEvents(input) {
    const now = input.nowMs ?? Date.now();
    const fromMs = now - input.sinceHours * 60 * 60 * 1000;
    let scanned = 0;
    let parsedRows = 0;
    let ignoredRows = 0;
    const byEvent = {};
    const byReason = {};
    const byDay = {};
    const byRole = {};
    for (const line of input.lines) {
        scanned += 1;
        const trimmed = line.trim();
        if (!trimmed)
            continue;
        let row;
        try {
            row = JSON.parse(trimmed);
            parsedRows += 1;
        }
        catch {
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
export function renderSummary(result, format) {
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
