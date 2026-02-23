/* global describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react-native';
import TimerBadge from './TimerBadge';

// Mock i18n translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, v?: { hours?: number; minutes?: number }) => {
      if (k === 'timerBadge.expiresIn' && v)
        return `Expires in ${v.hours}h ${v.minutes}m`;
      if (k === 'timerBadge.expired') return 'Expired';
      return k;
    },
  }),
}));

// Mock timer hooks
jest.mock('../hooks/useGlobalTimer', () => ({
  useGlobalNow: () => new Date('2026-02-14T12:00:00Z'),
  useTimeRemaining: (expiresAt: string, now: Date) => {
    const end = new Date(expiresAt);
    const diff = end.getTime() - now.getTime();
    if (isNaN(end.getTime()) || diff <= 0)
      return { expired: true, hours: 0, minutes: 0, isExpired: true };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return { expired: false, hours, minutes, isExpired: false };
  },
}));

describe('TimerBadge', () => {
  it('renders hours and minutes correctly', () => {
    const timer = { hours: 1, minutes: 30 };
    const { getByText } = render(<TimerBadge timer={timer} />);
    expect(getByText('1h 30m')).toBeTruthy();
  });

  it('renders zero minutes correctly', () => {
    const timer = { hours: 2, minutes: 0 };
    const { getByText } = render(<TimerBadge timer={timer} />);
    expect(getByText('2h 0m')).toBeTruthy();
  });

  it('renders only minutes correctly', () => {
    const timer = { hours: 0, minutes: 45 };
    const { getByText } = render(<TimerBadge timer={timer} />);
    expect(getByText('0h 45m')).toBeTruthy();
  });

  it('renders countdown correctly', () => {
    const future = '2026-02-14T14:30:00Z';
    const { getByText } = render(<TimerBadge expiresAt={future} />);
    expect(getByText('Expires in 2h 30m')).toBeTruthy();
  });

  it('renders expired state', () => {
    const past = '2026-02-14T10:00:00Z';
    const { getByText } = render(<TimerBadge expiresAt={past} />);
    expect(getByText('Expired')).toBeTruthy();
  });

  it('handles invalid expiresAt', () => {
    const { getByText } = render(<TimerBadge expiresAt={''} />);
    expect(getByText('Expired')).toBeTruthy();
  });

  it('uses custom formatLabel', () => {
    const future = '2026-02-14T14:30:00Z';
    const { getByText } = render(
      <TimerBadge expiresAt={future} formatLabel={() => 'Custom Label'} />,
    );
    expect(getByText('Custom Label')).toBeTruthy();
  });

  it('sets accessibilityLabel and testID', () => {
    const future = '2026-02-14T14:30:00Z';
    const { getByLabelText, getByTestId } = render(
      <TimerBadge
        expiresAt={future}
        accessibilityLabel="MyLabel"
        testID="my-timer"
      />,
    );
    expect(getByLabelText('MyLabel')).toBeTruthy();
    expect(getByTestId('my-timer')).toBeTruthy();
  });
});
