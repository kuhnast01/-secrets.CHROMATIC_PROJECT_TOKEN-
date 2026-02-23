import type { EventVersion } from 'models/event';
export declare function saveEventVersion(version: EventVersion): Promise<any>;
export declare function getEventVersions(limit?: number): Promise<EventVersion[]>;
export declare function clearEventVersions(): Promise<any>;
//# sourceMappingURL=eventVersionApi.d.ts.map