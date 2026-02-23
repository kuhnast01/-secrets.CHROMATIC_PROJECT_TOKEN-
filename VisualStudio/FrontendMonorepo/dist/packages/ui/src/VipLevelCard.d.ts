interface VipLevelCardProps {
    level: number;
    perks: string[];
    dailyReward: string;
    locked: boolean;
    current: boolean;
}
export declare function VipLevelCard({ level, perks, dailyReward, locked, current }: VipLevelCardProps): import("react/jsx-runtime").JSX.Element;
export {};
