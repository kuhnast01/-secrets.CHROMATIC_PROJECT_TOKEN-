type SystemHealth = {
    uptime: number;
    platform: string;
    arch: string;
    totalmem: number;
    freemem: number;
    cpus: number;
    loadavg: number[];
    hostname: string;
    userInfo: any;
};
export declare function useSystemHealth(): {
    health: SystemHealth | null;
    loading: boolean;
    error: string | null;
};
export {};
