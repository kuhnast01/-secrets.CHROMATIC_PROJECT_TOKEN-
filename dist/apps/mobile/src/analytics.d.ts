import analytics from '@react-native-firebase/analytics';
export declare function logScreenView(screenName: string): Promise<void>;
export declare function logEvent(event: string, params?: Record<string, any>): Promise<void>;
export default analytics;
