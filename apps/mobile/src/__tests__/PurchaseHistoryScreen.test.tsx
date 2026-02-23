/* eslint-env jest */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import PurchaseHistoryScreen from '../screens/PurchaseHistoryScreen';
import * as api from '@api/src/shopApi';

jest.mock('@api');

const mockHistory = [
  {
    id: '1',
    itemId: 'sword',
    name: 'Sword',
    rarity: 'rare',
    price: 100,
    currency: 'gems',
    imageUrl: '',
    purchasedAt: '2026-02-14T12:00:00Z',
  },
  {
    id: '2',
    itemId: 'shield',
    name: 'Shield',
    rarity: 'common',
    price: 50,
    currency: 'gold',
    imageUrl: '',
    purchasedAt: '2026-02-13T10:00:00Z',
  },
];

describe('PurchaseHistoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(api, 'fetchPurchaseHistory').mockResolvedValue(mockHistory);
  });

  it('renders purchase history items', async () => {
    const { findByText } = render(<PurchaseHistoryScreen />);
    expect(await findByText('Sword')).toBeTruthy();
    expect(await findByText('Shield')).toBeTruthy();
  });

  it('shows empty state if no purchases', async () => {
    (api.fetchPurchaseHistory as jest.Mock).mockResolvedValueOnce([]);
    const { findByText } = render(<PurchaseHistoryScreen />);
    expect(await findByText('No purchases yet.')).toBeTruthy();
  });

  it('shows error on fetch failure', async () => {
    (api.fetchPurchaseHistory as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const { findByText } = render(<PurchaseHistoryScreen />);
    expect(await findByText('Failed to load purchase history.')).toBeTruthy();
  });
});
