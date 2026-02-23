interface VipUpgradeBannerProps {
    nextLevel: number;
    nextPerks: string[];
    nextDaily: string;
    onUpgrade: () => void;
    onShowModal: () => void;
    upgrading?: boolean;
}
export declare function VipUpgradeBanner({ nextLevel, nextPerks, nextDaily, onUpgrade, onShowModal, upgrading }: VipUpgradeBannerProps): import("react/jsx-runtime").JSX.Element;
interface VipUpgradeModalProps {
    visible: boolean;
    nextLevel: number;
    nextPerks: string[];
    nextDaily: string;
    onClose: () => void;
}
export declare function VipUpgradeModal({ visible, nextLevel, nextPerks, nextDaily, onClose }: VipUpgradeModalProps): import("react/jsx-runtime").JSX.Element;
export {};
