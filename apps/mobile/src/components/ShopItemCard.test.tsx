/* global describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ShopItemCard } from './ShopItemCard';

describe('ShopItemCard', () => {
  it('renders with item data', () => {
    const props = {
      name: 'Test Item',
      rarity: 'common',
      price: 100,
      currency: 'USD',
    };
    const { getByText } = render(<ShopItemCard {...props} />);
    expect(getByText('Test Item')).toBeTruthy();
    expect(getByText('common')).toBeTruthy();
    expect(getByText('100')).toBeTruthy();
    expect(getByText('USD')).toBeTruthy();
  });
});
