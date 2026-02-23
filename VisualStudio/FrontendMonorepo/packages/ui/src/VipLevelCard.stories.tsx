import type { Meta, StoryObj } from '@storybook/react';
import VipLevelCard from './VipLevelCard';

const meta: Meta<typeof VipLevelCard> = {
  title: 'UI/VipLevelCard',
  component: VipLevelCard,
};
export default meta;

type Story = StoryObj<typeof VipLevelCard>;

export const Default: Story = {
  args: {
    level: 5,
  },
};
