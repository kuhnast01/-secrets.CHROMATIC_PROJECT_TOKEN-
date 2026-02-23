import type { StackScreenProps } from '@react-navigation/stack';
type Event = {
    name: string;
    featuredCommander?: {
        name: string;
        imageUrl?: string;
    };
    description?: string;
    milestones?: {
        id: number;
        desc: string;
        reward: string;
    }[];
    progress?: number;
};
type LegendaryHuntScreenRouteParams = {
    event: Event;
};
type Props = StackScreenProps<any, any> & {
    route: {
        params: LegendaryHuntScreenRouteParams;
    };
};
export default function LegendaryHuntScreen({ route, navigation }: Props): import("react/jsx-runtime").JSX.Element;
export {};
