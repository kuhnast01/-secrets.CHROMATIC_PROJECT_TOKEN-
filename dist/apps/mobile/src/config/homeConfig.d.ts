export interface HomeScreenConfig {
    welcomeText: string;
    banners: Array<{
        image: string;
        link?: string;
        alt?: string;
    }>;
    news: Array<{
        title: string;
        body: string;
        date: string;
    }>;
}
export declare const HOME_SCREEN_CONFIG: HomeScreenConfig;
