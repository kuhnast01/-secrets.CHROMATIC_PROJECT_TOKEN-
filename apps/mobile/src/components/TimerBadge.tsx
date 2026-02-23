


import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGlobalNow, useTimeRemaining } from '../hooks/useGlobalTimer';

// i18n resource keys required in your translation files:
// {
//   "timerBadge": {
//     "expiresIn": "Expires in {{hours}}h {{minutes}}m",
//     "expired": "Expired"
//   }
// }

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
  formatLabel?: (params: { valid: boolean; remaining?: string; expiresAt: string }) => string;
}



/**
 * TimerBadge displays a countdown or expiration badge for a given ISO date string.
 * It is accessible, testable, and supports custom styles.
 */


const TimerBadge: React.FC<TimerBadgeProps> = ({ expiresAt, testID, accessibilityLabel, style, formatLabel }) => {
  const { t } = useTranslation();
  const now = useGlobalNow();
  let valid = true;
  let remainingObj: { expired: boolean; hours: number; minutes: number; isExpired: boolean } | undefined = undefined;
  let remaining: string | undefined = undefined;
  if (!expiresAt || typeof expiresAt !== 'string' || isNaN(Date.parse(expiresAt))) {
    valid = false;
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('[TimerBadge] Invalid or missing expiresAt prop:', expiresAt);
    }
  } else {
    remainingObj = useTimeRemaining(expiresAt, now);
    if (remainingObj && !remainingObj.expired) {
      remaining = t('timerBadge.expiresIn', { hours: remainingObj.hours, minutes: remainingObj.minutes });
    } else if (remainingObj && remainingObj.expired) {
      remaining = t('timerBadge.expired');
    }
  }
  // i18n/custom label support
  const label = formatLabel
    ? formatLabel({ valid, remaining, expiresAt })
    : (remaining || t('timerBadge.expired'));
  return (
    <View
      style={[styles.badge, style]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || label}
      testID={testID || 'timer-badge'}
    >
      <Text style={styles.text}>
        {remaining || t('timerBadge.expired')}
      </Text>
    </View>
  );
};

TimerBadge.propTypes = {
  expiresAt: PropTypes.string.isRequired,
  testID: PropTypes.string,
  accessibilityLabel: PropTypes.string,
  style: PropTypes.object,
  formatLabel: PropTypes.func,
};

export default TimerBadge;

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#222',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 2,
    marginBottom: 4,
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
