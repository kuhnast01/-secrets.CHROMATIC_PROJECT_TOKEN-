type AnalyticsClient = {
    logScreenView: (params: {
        screen_name: string;
        screen_class: string;
    }) => Promise<void>;
    logEvent: (event: string, params?: Record<string, any>) => Promise<void>;
};
declare const getAnalyticsClient: () => AnalyticsClient;
export declare function logScreenView(screenName: string): Promise<void>;
export declare function logEvent(event: string, params?: Record<string, any>): Promise<void>;
export default getAnalyticsClient;
