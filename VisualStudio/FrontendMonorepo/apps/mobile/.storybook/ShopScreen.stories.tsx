import React from 'react';
import { View, Text } from 'react-native';
import { Meta, StoryObj } from '@storybook/react-native';
import ShopScreen from '../../src/screens/ShopScreen';

const meta: Meta<typeof ShopScreen> = {
  title: 'Screens/ShopScreen',
  component: ShopScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ShopScreen>;

export const Default: Story = {
  render: () => <ShopScreen />,
};
