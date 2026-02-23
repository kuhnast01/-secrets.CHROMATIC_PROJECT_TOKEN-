/* eslint-env jest */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ShopScreen from '../screens/ShopScreen';
import * as api from '@api/src/shopApi';

jest.mock('@api');

const mockShopData = {
  featured: [
    { id: '1', name: 'Sword', description: '', type: 'rare', price: 100, currency: 'gems', imageUrl: '', available: true },
  ],
  seasonal: [],
  arena: [],
  raid: [],
  guild: [],
  faction: [],
};

const mockFriends = [
  { id: 'user2', name: 'Alice' },
  { id: 'user3', name: 'Bob' },
];

describe('ShopScreen gifting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(api, 'fetchShop').mockResolvedValue(mockShopData);
    jest.spyOn(api, 'giftShopItem').mockResolvedValue({
      success: true,
      newBalance: 0,
      reward: { id: '1', name: 'Sword', amount: 1, rarity: 'rare' },
    });
  });

  it('opens gift modal and gifts to a friend', async () => {
    const { findByText, getByText, queryByText } = render(<ShopScreen />);
    // Wait for shop item
    const giftBtn = await findByText('Gift');
    fireEvent.press(giftBtn);
    // Modal should show friends
    const friend = await findByText('Alice');
    fireEvent.press(friend);
    // Should show gifting loading state
    expect(getByText('Gifting...')).toBeTruthy();
    // Wait for reward popup
    expect(await findByText('Sword')).toBeTruthy();
    // Modal should close
    expect(queryByText('Select a Friend')).toBeNull();
  });

  it('shows error if gifting fails', async () => {
    (api.giftShopItem as jest.Mock).mockResolvedValueOnce({
      success: false,
      newBalance: 0,
      reward: { id: '', name: '', amount: 0, rarity: '' },
      error: 'Cannot gift to this user',
    });
    const { findByText } = render(<ShopScreen />);
    fireEvent.press(await findByText('Gift'));
    fireEvent.press(await findByText('Alice'));
    expect(await findByText('Cannot gift to this user')).toBeTruthy();
  });

  it('shows error on network failure', async () => {
    (api.giftShopItem as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const { findByText } = render(<ShopScreen />);
    fireEvent.press(await findByText('Gift'));
    fireEvent.press(await findByText('Alice'));
    expect(await findByText('Network error')).toBeTruthy();
  });
});
