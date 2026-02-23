interface VipDailyRewardRowProps {
    reward: string;
    claimed: boolean;
    claimable: boolean;
    onClaim: () => void;
    timer: string;
    onViewLadder: () => void;
}
export declare function VipDailyRewardRow({ reward, claimed, claimable, onClaim, timer, onViewLadder }: VipDailyRewardRowProps): import("react/jsx-runtime").JSX.Element;
export {};
