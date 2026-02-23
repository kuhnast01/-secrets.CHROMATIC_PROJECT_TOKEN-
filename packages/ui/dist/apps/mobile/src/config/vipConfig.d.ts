export interface VipScreenConfig {
    title: string;
    perks: Array<{
        icon: string;
        label: string;
        description: string;
    }>;
    bannerImage?: string;
    infoText?: string;
}
export declare const VIP_SCREEN_CONFIG: VipScreenConfig;
