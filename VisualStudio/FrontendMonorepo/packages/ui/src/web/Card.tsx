import React from 'react';

export type CardProps = {
  children: React.ReactNode;
  title?: string;
};

export const Card: React.FC<CardProps> = ({ children, title }) => (
  <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, margin: 8 }}>
    {title && <h2 style={{ marginBottom: 8 }}>{title}</h2>}
    {children}
  </div>
);
