import React from 'react';
export interface PurchaseButtonProps {
    onPress: () => void;
    disabled?: boolean;
    price: number;
    currency: string;
    testID?: string;
    accessibilityLabel?: string;
    style?: object;
}
export declare const PurchaseButton: React.FC<PurchaseButtonProps>;
