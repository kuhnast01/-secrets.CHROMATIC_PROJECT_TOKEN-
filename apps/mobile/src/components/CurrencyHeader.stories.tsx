import React from 'react';
import CurrencyHeader from './CurrencyHeader';
import { View } from 'react-native';

export default {
  title: 'Shop/CurrencyHeader',
  component: CurrencyHeader,
};

export const Default = () => (
  <View style={{ padding: 16 }}>
    <CurrencyHeader showSeasonal={false} highlightSeasonal={false} />
  </View>
);
