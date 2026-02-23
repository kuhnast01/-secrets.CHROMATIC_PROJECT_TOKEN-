export type LiveOpsObjectType = 'event' | 'shop' | 'rewards' | 'battlepass' | 'banner';
export interface LiveOpsConfig {
    type: LiveOpsObjectType;
    data: any;
}
export declare class LiveOpsValidator {
    validate(config: LiveOpsConfig): {
        valid: boolean;
        errors: string[];
    };
    simulate(config: LiveOpsConfig): {
        result: string;
    };
    predictEconomyImpact(change: any): {
        impact: string;
    };
}
