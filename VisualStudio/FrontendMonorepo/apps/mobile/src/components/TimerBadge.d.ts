import React from 'react';
/**
 * Props for TimerBadge component.
 * @property expiresAt Expiration time as ISO string (required)
 * @property testID Optional testID for testing
 * @property accessibilityLabel Optional accessibility label for a11y
 * @property style Optional custom style for badge container
 * @property formatLabel Optional function to format the label text (for i18n/customization). If not provided, uses react-i18next for translation.
 */
export interface TimerBadgeProps {
    expiresAt: string;
    testID?: string;
    accessibilityLabel?: string;
    style?: object;
    /**
     * Optional function to format the label text (for i18n/customization)
     * Receives: { valid, remaining, expiresAt }
     */
    formatLabel?: (params: {
        valid: boolean;
        remaining?: string;
        expiresAt: string;
    }) => string;
}
/**
 * TimerBadge displays a countdown or expiration badge for a given ISO date string.
 * It is accessible, testable, and supports custom styles.
 */
declare const TimerBadge: React.FC<TimerBadgeProps>;
export default TimerBadge;
//# sourceMappingURL=TimerBadge.d.ts.map