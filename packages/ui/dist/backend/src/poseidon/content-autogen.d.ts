export type AutoGenType = 'event' | 'shop' | 'reward' | 'season' | 'localization' | 'patch-notes';
export interface AutoGenRequest {
    type: AutoGenType;
    params: any;
}
export declare class ContentAutoGenerator {
    generate(request: AutoGenRequest): {
        content: any;
        summary: string;
    };
    generateCalendar(events: any[]): {
        calendar: string;
    };
}
