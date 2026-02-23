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
    { id: '3', name: 'Potion', description: '', type: 'epic', price: 10, currency: 'seasonal', imageUrl: '', available: true, timer: new Date(Date.now() + 60000).toISOString() },
  ],
  seasonal: [
    { id: '4', name: 'Seasonal Sword', description: '', type: 'legendary', price: 200, currency: 'seasonal', imageUrl: '', available: true },
  ],
  arena: [],
  raid: [],
  guild: [],
  faction: [],
};

describe('ShopScreen Battery', () => {
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

  it('handles rapid tab switching', async () => {
    const { getByText } = render(<ShopScreen />);
    fireEvent.press(getByText('Seasonal'));
    fireEvent.press(getByText('Featured'));
    fireEvent.press(getByText('Arena'));
    fireEvent.press(getByText('Seasonal'));
    expect(getByText('Shop')).toBeTruthy();
  });

  it('handles multiple rapid purchases', async () => {
    const { findByText, getByText } = render(<ShopScreen />);
    const buyButton = await findByText(/Buy for 100/);
    fireEvent.press(buyButton);
    fireEvent.press(buyButton);
    fireEvent.press(buyButton);
    expect(await findByText('Sword')).toBeTruthy();
    fireEvent.press(getByText('Continue'));
  });

  it('handles expired timer', async () => {
    const { findByText } = render(<ShopScreen />);
    // Fast-forward timer
    jest.advanceTimersByTime(70000);
    expect(await findByText('Expired')).toBeTruthy();
  });

  it('handles shop fetch failure and retry', async () => {
    (api.fetchShop as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const { findByText, rerender } = render(<ShopScreen />);
    expect(await findByText('Failed to load shop.')).toBeTruthy();
    (api.fetchShop as jest.Mock).mockResolvedValueOnce(mockShopData);
    rerender(<ShopScreen />);
    expect(await findByText('Sword')).toBeTruthy();
  });

  it('handles purchase with insufficient currency', async () => {
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

  it('handles purchase of sold out item', async () => {
    const { findByText } = render(<ShopScreen />);
    expect(await findByText('Sold out')).toBeTruthy();
  });

  it('handles reward popup close and repeat purchase', async () => {
    const { findByText, getByText } = render(<ShopScreen />);
    const buyButton = await findByText(/Buy for 100/);
    fireEvent.press(buyButton);
    expect(await findByText('Sword')).toBeTruthy();
    fireEvent.press(getByText('Continue'));
    fireEvent.press(buyButton);
    expect(await findByText('Sword')).toBeTruthy();
  });

  it('handles corrupted/malformed shop data gracefully', async () => {
    (api.fetchShop as jest.Mock).mockResolvedValueOnce({
      featured: [
        { id: null, name: null, price: 'not-a-number', available: undefined },
        undefined,
        { id: 'dup', name: 'Duplicate', price: 10, available: true },
        { id: 'dup', name: 'Duplicate', price: 10, available: true },
      ],
      seasonal: null, arena: null, raid: null, guild: null, faction: null,
    });
    const { findByText, queryByText } = render(<ShopScreen />);
    // Should not crash, and should skip invalid items
    expect(await findByText('Shop')).toBeTruthy();
    expect(queryByText('Duplicate')).toBeTruthy();
  });

  it('handles missing required fields in shop items', async () => {
    (api.fetchShop as jest.Mock).mockResolvedValueOnce({
      featured: [
        { id: 'missing' /* missing name, price, available */ },
      ],
      seasonal: [], arena: [], raid: [], guild: [], faction: [],
    });
    const { findByText } = render(<ShopScreen />);
    expect(await findByText('Shop')).toBeTruthy();
  });

  it('handles extremely large shop data sets', async () => {
    const bigList = Array.from({ length: 1000 }, (_, i) => ({
      id: `item${i}`, name: `Item ${i}`, description: '', type: 'rare', price: i, currency: 'gems', imageUrl: '', available: true,
    }));
    (api.fetchShop as jest.Mock).mockResolvedValueOnce({
      featured: bigList,
      seasonal: [], arena: [], raid: [], guild: [], faction: [],
    });
    const { findByText } = render(<ShopScreen />);
    expect(await findByText('Item 999')).toBeTruthy();
  });

  it('handles rapid open/close of reward popup', async () => {
    const { findByText, getByText } = render(<ShopScreen />);
    const buyButton = await findByText(/Buy for 100/);
    for (let i = 0; i < 5; i++) {
      fireEvent.press(buyButton);
      fireEvent.press(getByText('Continue'));
    }
    expect(getByText('Shop')).toBeTruthy();
  });

  it('handles all items sold out', async () => {
    (api.fetchShop as jest.Mock).mockResolvedValueOnce({
      featured: [
        { id: 'sold1', name: 'Sold1', price: 10, available: false },
        { id: 'sold2', name: 'Sold2', price: 20, available: false },
      ],
      seasonal: [], arena: [], raid: [], guild: [], faction: [],
    });
    const { findByText } = render(<ShopScreen />);
    expect(await findByText('Sold out')).toBeTruthy();
  });
});
