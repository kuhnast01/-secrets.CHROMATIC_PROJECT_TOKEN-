/* eslint-env jest */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ShopScreen from '../screens/ShopScreen';
import * as api from '@api/src/shopApi';

jest.mock('@api');

const mockShopData = {
  featured: [
    { id: '1', name: 'Sword', description: '', type: 'rare', price: 100, currency: 'gems', imageUrl: '', available: true },
    { id: '2', name: 'Shield', description: '', type: 'common', price: 50, currency: 'gold', imageUrl: '', available: false },
  ],
  seasonal: [],
  arena: [],
  raid: [],
  guild: [],
  faction: [],
};

describe('ShopScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(api, 'fetchShop').mockResolvedValue(mockShopData);
    jest.spyOn(api, 'purchaseShopItem').mockResolvedValue({
      success: true,
      newBalance: 0,
      newLimit: 0,
      reward: { id: '1', name: 'Sword', amount: 1, rarity: 'rare' },
    });
  });

  it('shows loading skeletons during slow network', async () => {
    jest.useFakeTimers();
    (api.fetchShop as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(() => { resolve(mockShopData); }, 2000)));
    const { getAllByTestId, findByText } = render(<ShopScreen />);
    // Skeletons should be visible before the promise resolves
    expect(getAllByTestId('ShopItemSkeleton').length).toBeGreaterThan(0);
    // Fast-forward timers to resolve the fetchShop promise
    jest.advanceTimersByTime(2000);
    // Wait for the real data to appear
    expect(await findByText('Sword')).toBeTruthy();
    jest.useRealTimers();
  });

  it('renders loading skeletons', async () => {
    const { getAllByTestId } = render(<ShopScreen />);
    expect(getAllByTestId('ShopItemSkeleton').length).toBeGreaterThan(0);
  });

  it('renders shop items after loading', async () => {
    const { findByText } = render(<ShopScreen />);
    expect(await findByText('Sword')).toBeTruthy();
    expect(await findByText('Shield')).toBeTruthy();
  });

  it('disables purchase button for sold out items', async () => {
    const { findByText } = render(<ShopScreen />);
    const soldOut = await findByText('Sold out');
    expect(soldOut).toBeTruthy();
  });

  it('shows reward popup after purchase', async () => {
    const { findByText, getByText } = render(<ShopScreen />);
    const buyButton = await findByText(/Buy for 100/);
    fireEvent.press(buyButton);
    expect(await findByText('Sword')).toBeTruthy(); // Reward popup
    fireEvent.press(getByText('Continue'));
    expect(getByText('Shop')).toBeTruthy(); // Back to shop
  });

  it('shows error on purchase failure', async () => {
    (api.purchaseShopItem as jest.Mock).mockResolvedValueOnce({
      success: false,
      newBalance: 0,
      newLimit: 0,
      reward: { id: '', name: '', amount: 0, rarity: '' },
      error: 'Insufficient currency',
    });
    const { findByText } = render(<ShopScreen />);
    const buyButton = await findByText(/Buy for 100/);
    fireEvent.press(buyButton);
    expect(await findByText('Insufficient currency')).toBeTruthy();
  });

  it('shows error on network failure', async () => {
    (api.fetchShop as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const { findByText } = render(<ShopScreen />);
    expect(await findByText('Failed to load shop.')).toBeTruthy();
  });
});
