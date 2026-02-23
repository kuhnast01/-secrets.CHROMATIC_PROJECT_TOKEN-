// vipConfig.ts
// Config for VIP screen UI, perks, and text

export interface VipScreenConfig {
  title: string;
  perks: Array<{ icon: string; label: string; description: string }>;
  bannerImage?: string;
  infoText?: string;
}

export const VIP_SCREEN_CONFIG: VipScreenConfig = {
  title: 'VIP Rewards',
  perks: [
    { icon: '💎', label: 'Double Gems', description: 'Earn double gems on all purchases.' },
    { icon: '⚡', label: 'Faster Energy', description: 'Energy refills twice as fast.' },
    { icon: '🎁', label: 'Exclusive Gifts', description: 'Receive special gifts every week.' },
  ],
  bannerImage: 'https://cdn.example.com/banners/vip.png',
  infoText: 'Upgrade to VIP for the best experience!',
};
