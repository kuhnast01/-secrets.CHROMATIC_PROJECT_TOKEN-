export interface ShopTabConfig {
    key: string;
    label: string;
    icon: string;
    bannerImage?: string;
    description?: string;
    seasonEnd?: string;
}
export declare function fetchShopTabsConfig(): Promise<ShopTabConfig[]>;
export declare function useShopTabsConfig(): {
    tabs: ShopTabConfig[];
    loading: boolean;
    error: any;
};
