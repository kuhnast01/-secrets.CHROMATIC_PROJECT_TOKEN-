// integrationApi.ts
// Mock Express-style API for event versions and analytics
import type { EventVersion } from '../../models/src/event';

let eventVersions: EventVersion[] = [];

export function getEventVersionsAPI(req: any, res: any) {
  res.json(eventVersions.slice(0, 50));
}

export function saveEventVersionAPI(req: any, res: any) {
  const version = req.body as EventVersion;
  eventVersions.unshift(version);
  res.json({ success: true });
}

export function getAnalyticsAPI(req: any, res: any) {
  const region = req.query.region || 'NA';
  // Return mock data (see LiveOpsAnalyticsPanel)
  // ...
  res.json({ region, /* ...mock data... */ });
}
