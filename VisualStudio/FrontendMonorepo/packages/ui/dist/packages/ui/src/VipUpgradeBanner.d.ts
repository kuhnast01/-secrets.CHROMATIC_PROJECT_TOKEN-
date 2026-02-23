interface VipUpgradeModalProps {
    visible: boolean;
    nextLevel: number;
    nextPerks: string[];
    nextDaily: string;
    onClose: () => void;
}
export declare function VipUpgradeModal({ visible, nextLevel, nextPerks, nextDaily, onClose }: VipUpgradeModalProps): import("react/jsx-runtime").JSX.Element | null;
export {};
