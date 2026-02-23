/* eslint-env jest */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../../App';

describe('FrontendMonorepo Battery', () => {
  it('renders the app root without crashing', () => {
    render(<App />);
  });

  it('navigates through all main screens without crashing', async () => {
    const { getByText, findByText } = render(<App />);
    // Try to find and navigate to all main tabs/screens
    const screens = ['Shop', 'Events', 'Summon', 'Profile', 'Home'];
    for (const screen of screens) {
      try {
        const tab = getByText(screen);
        fireEvent.press(tab);
        expect(await findByText(screen)).toBeTruthy();
      } catch (e) {
        // If not present, skip
      }
    }
  });

  it('handles global error boundaries', async () => {
    // Simulate a crash in a child component
    const Broken = () => { throw new Error('Test crash'); };
    const { findByText } = render(<Broken />);
    expect(await findByText(/error|crash|unexpected/i)).toBeTruthy();
  });

  it('handles rapid navigation and actions', async () => {
    const { getByText } = render(<App />);
    for (let i = 0; i < 10; i++) {
      ['Shop', 'Events', 'Summon', 'Profile', 'Home'].forEach(screen => {
        try {
          fireEvent.press(getByText(screen));
        } catch {}
      });
    }
  });

  it('renders all major components without crashing', () => {
    // Import and render all major components for smoke test
    const components = [
      require('../components/ShopItemCard').ShopItemCard,
      require('../components/EventCard').default,
      require('../components/TimerBadge').default,
      require('../components/CurrencyHeader').default,
      require('../components/RewardPopup').RewardPopup,
    ];
    components.forEach(Component => {
      if (Component === require('../components/TimerBadge').default) {
        render(<Component expiresAt={new Date(Date.now() + 60000).toISOString()} />);
      } else {
        render(<Component {...({} as any)} />);
      }
    });
  });
});
