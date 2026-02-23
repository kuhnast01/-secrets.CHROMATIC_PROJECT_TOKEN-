import type { Meta, StoryObj } from '@storybook/react';
import BannerCarousel from '../../../apps/web/src/components/BannerCarousel';

const meta: Meta<typeof BannerCarousel> = {
  title: 'Web/BannerCarousel',
  component: BannerCarousel,
};
export default meta;

type Story = StoryObj<typeof BannerCarousel>;

export const Default: Story = {
  args: {
    banners: [],
  },
};
