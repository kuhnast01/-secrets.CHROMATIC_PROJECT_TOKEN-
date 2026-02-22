// homeConfig.ts
// Config for home screen UI, banners, and text

export interface HomeScreenConfig {
  welcomeText: string;
  banners: Array<{ image: string; link?: string; alt?: string }>;
  news: Array<{ title: string; body: string; date: string }>;
}

export const HOME_SCREEN_CONFIG: HomeScreenConfig = {
  welcomeText: 'Welcome to the Game! Enjoy new features and rewards.',
  banners: [
    { image: 'https://cdn.example.com/banners/home1.png', alt: 'Spring Event' },
    { image: 'https://cdn.example.com/banners/home2.png', alt: 'VIP Sale' },
  ],
  news: [
    { title: 'Update 1.2 Released', body: 'New features and bug fixes.', date: '2026-02-10' },
    { title: 'VIP Event', body: 'Special rewards for VIPs this week.', date: '2026-02-08' },
  ],
};
