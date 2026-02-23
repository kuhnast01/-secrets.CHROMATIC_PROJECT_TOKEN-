import React from 'react';
import { VipPerkList } from './VipPerkList';

interface VipLevelCardProps {
  level: number;
  perks: string[];
  dailyReward: string;
  locked: boolean;
  current: boolean;
}

export function VipLevelCard({ level, perks, dailyReward, locked, current }: VipLevelCardProps) {
  return (
    <div style={{
      opacity: locked ? 0.5 : 1,
      background: current ? '#e6f7ff' : '#fff',
      border: current ? '2px solid #3182ce' : '1px solid #eee',
      borderRadius: 12,
      padding: 20,
      margin: '8px 0',
      boxShadow: current ? '0 2px 8px #3182ce22' : '0 1px 4px #0001',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      minWidth: 220,
    }}>
      <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
        Level {level} {current && <span style={{ color: '#3182ce' }}>(Current)</span>}
      </div>
      <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
        <VipPerkList perks={perks} />
      </div>
      <div style={{ fontSize: 13, color: '#888' }}>Daily Reward: {dailyReward}</div>
      {locked && <div style={{ color: '#aaa', fontSize: 13, marginTop: 8 }}>Locked</div>}
    </div>
  );
}
