import type { StackScreenProps } from '@react-navigation/stack';
type Event = {
    name: string;
    keyArtUrl?: string;
    description?: string;
    bossHP?: number;
    playerHP?: number;
    attempts?: number;
    rewardTiers?: {
        tier: number;
        desc: string;
        reward: string;
    }[];
};
type SeasonalBossScreenRouteParams = {
    event: Event;
};
type Props = StackScreenProps<any, any> & {
    route: {
        params: SeasonalBossScreenRouteParams;
    };
};
export default function SeasonalBossScreen({ route, navigation }: Props): import("react/jsx-runtime").JSX.Element;
export {};
