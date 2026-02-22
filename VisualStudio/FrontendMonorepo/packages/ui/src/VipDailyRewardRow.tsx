import React from 'react';
import './VipDailyRewardRow.css';

interface VipDailyRewardRowProps {
  reward: string;
  claimed: boolean;
  claimable: boolean;
  onClaim: () => void;
  timer: string;
  onViewLadder: () => void;
}

export function VipDailyRewardRow({ reward, claimed, claimable, onClaim, timer, onViewLadder }: VipDailyRewardRowProps) {
  return (
    <div className="vip-daily-reward-row">
      <div className="vip-daily-reward-row__info">
        <div className="vip-daily-reward-row__title">VIP Daily Reward</div>
        <div className="vip-daily-reward-row__reward">{reward}</div>
        <div className="vip-daily-reward-row__timer">Next reset: {timer}</div>
      </div>
      {claimable && !claimed ? (
        <button className="vip-daily-reward-row__claim-btn" onClick={onClaim}>Claim</button>
      ) : claimed ? (
        <div className="vip-daily-reward-row__claimed">Claimed</div>
      ) : null}
      <button className="vip-daily-reward-row__ladder-btn" onClick={onViewLadder}>View VIP Ladder</button>
    </div>
  );
}
