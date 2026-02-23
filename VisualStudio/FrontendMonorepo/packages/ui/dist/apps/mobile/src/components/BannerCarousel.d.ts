import React from 'react';
import type { SummonBanner } from '@models';
interface BannerCarouselProps {
    banners: SummonBanner[];
    onSelect: (banner: SummonBanner) => void;
    selectedBannerId?: string;
    testID?: string;
    accessibilityLabel?: string;
    style?: object;
}
export declare const BannerCarousel: React.FC<BannerCarouselProps>;
export {};
