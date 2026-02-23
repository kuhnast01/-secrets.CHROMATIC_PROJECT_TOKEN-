import React from 'react';
import './VipXpBar.css';

interface VipXpBarProps {
  currentXp: number;
  nextLevelXp: number;
  animate?: boolean;
}

export function VipXpBar({ currentXp, nextLevelXp, animate }: VipXpBarProps) {
  const percent = Math.min(100, (currentXp / nextLevelXp) * 100);
  return (
    <div className="vip-xp-bar-container">
      <div className="vip-xp-bar-label">XP: {currentXp} / {nextLevelXp}</div>
      <div className="vip-xp-bar-background">
        <div
          className={`vip-xp-bar-fill${animate ? ' vip-xp-bar-animate' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
