export declare function useGlobalNow(intervalMs?: number): Date;
export declare function useTimeRemaining(expiresAt: any, now: any): {
    expired: boolean;
    hours: number;
    minutes: number;
    isExpired: boolean;
};
