import React from 'react';
import GiftFriendModal from './GiftFriendModal';

export default {
  title: 'Shop/GiftFriendModal',
  component: GiftFriendModal,
};

export const Default = () => (
  <GiftFriendModal
    visible={true}
    friends={[
      { id: 'f1', name: 'Alice', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { id: 'f2', name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    ]}
    onSelect={() => {}}
    onClose={() => {}}
  />
);
