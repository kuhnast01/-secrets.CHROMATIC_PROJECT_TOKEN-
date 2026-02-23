import React from 'react';
import type { SummonBanner } from '@models';
interface BannerDetailProps {
    banner: SummonBanner;
    onSummon: () => void;
    loading: boolean;
    result?: string[];
}
export declare const BannerDetail: React.FC<BannerDetailProps>;
export {};
