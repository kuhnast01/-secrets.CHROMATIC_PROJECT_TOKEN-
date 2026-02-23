import React from 'react';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  color?: string;
};

export const Button: React.FC<ButtonProps> = ({ title, onPress, color }) => (
  <button style={{ backgroundColor: color || '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: 4 }} onClick={onPress}>
    {title}
  </button>
);
