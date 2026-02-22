import React from 'react';

interface VipPerkListProps {
  perks: string[];
}

export function VipPerkList({ perks }: VipPerkListProps) {
  if (!perks || perks.length === 0) {
    return <div style={{ color: '#aaa', fontSize: 14 }}>No perks available.</div>;
  }
  return (
    <ul style={{ paddingLeft: 20, margin: 0 }}>
      {perks.map((perk, i) => (
        <li key={i} style={{ fontSize: 15, color: '#444', marginBottom: 4 }}>
          {/* TODO: Add icon support if available */}
          {perk}
        </li>
      ))}
    </ul>
  );
}
