import type { Meta, StoryObj } from '@storybook/react';
import ShopItemCard from '../../../apps/mobile/src/components/ShopItemCard';

const meta: Meta<typeof ShopItemCard> = {
  title: 'Mobile/ShopItemCard',
  component: ShopItemCard,
};
export default meta;

type Story = StoryObj<typeof ShopItemCard>;

export const Default: Story = {
  args: {
    item: { id: 1, name: 'Test Item', price: 100 },
  },
};
