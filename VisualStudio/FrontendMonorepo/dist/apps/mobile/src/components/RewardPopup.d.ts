import React from 'react';
export interface RewardPopupProps {
    visible: boolean;
    imageUrl?: string;
    name: string;
    amount: number;
    rarity: string;
    onContinue: () => void;
    description?: string;
}
export declare const RewardPopup: React.FC<RewardPopupProps>;
