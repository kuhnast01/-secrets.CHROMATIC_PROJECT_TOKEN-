import React from 'react';
import type { SummonBanner } from '@models';
interface BannerDetailProps {
    banner: SummonBanner;
    testID?: string;
    accessibilityLabel?: string;
    style?: object;
}
export declare const BannerDetail: React.FC<BannerDetailProps>;
export {};
