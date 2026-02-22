/* eslint-env jest */
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ShopItemCard from './ShopItemCard';

expect.extend(toHaveNoViolations);

describe('ShopItemCard accessibility', () => {
  it('should have no accessibility violations', async () => {
    const item = { id: 1, name: 'Test Item', price: 100 };
    const { container } = render(<ShopItemCard item={item} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
