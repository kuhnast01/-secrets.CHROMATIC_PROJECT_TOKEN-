import React from 'react';
import { SummonBanner } from '@models';
interface BannerCarouselProps {
    banners: SummonBanner[];
    onSelect: (banner: SummonBanner) => void;
    selectedBannerId?: string;
}
export declare const BannerCarousel: React.FC<BannerCarouselProps>;
export {};
