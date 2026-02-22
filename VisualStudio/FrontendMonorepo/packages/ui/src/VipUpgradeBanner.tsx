import React from 'react';
import { VipPerkList } from './VipPerkList';
import styles from './VipUpgradeBanner.module.css';


interface VipUpgradeBannerProps {
  nextLevel: number;
  nextPerks: string[];
  nextDaily: string;
  onUpgrade: () => void;
  onShowModal: () => void;
  upgrading?: boolean;
}

export function VipUpgradeBanner({
  nextLevel,
  nextPerks,
  nextDaily,
  onUpgrade,
  onShowModal,
  upgrading,
}: VipUpgradeBannerProps) {

  return (
    <div className="vip-upgrade-banner">
      <div className="vip-upgrade-title">Upgrade to VIP {nextLevel}</div>
      <div className="vip-upgrade-perks"><VipPerkList perks={nextPerks} /></div>
      <div className="vip-upgrade-daily">Daily Reward: {nextDaily}</div>
      <button
        className={`vip-upgrade-btn${upgrading ? ' upgrading' : ''}`}
        onClick={onUpgrade}
        disabled={upgrading}
      >
        {upgrading ? (
          <span className="vip-upgrade-loader-wrap">
            <span className="vip-upgrade-loader" />
          </span>
        ) : null}
        Upgrade VIP
      </button>
      <button className="vip-upgrade-details-btn" onClick={onShowModal}>View Details</button>
    </div>
  );
}

interface VipUpgradeModalProps {
  visible: boolean;
  nextLevel: number;
  nextPerks: string[];
  nextDaily: string;
  onClose: () => void;
}

export function VipUpgradeModal({ visible, nextLevel, nextPerks, nextDaily, onClose }: VipUpgradeModalProps) {
  if (!visible) return null;
  return (
    <div className="vip-upgrade-modal-overlay">
      <div className="vip-upgrade-modal">
        <div className="vip-upgrade-modal-title">VIP {nextLevel} Benefits</div>
        <div className="vip-upgrade-modal-perks"><VipPerkList perks={nextPerks} /></div>
        <div className="vip-upgrade-modal-daily">Daily Reward: {nextDaily}</div>
        <button className="vip-upgrade-modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
