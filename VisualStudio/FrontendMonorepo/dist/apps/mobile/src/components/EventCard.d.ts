export declare function EventCardSkeleton(): import("react/jsx-runtime").JSX.Element;
type Event = {
    name: string;
    keyArtUrl?: string;
    description?: string;
    type: string;
    endTime?: string;
    rewards?: {
        iconUrl: string;
    }[];
};
interface EventCardProps {
    event: Event;
    onEnter: () => void;
}
export default function EventCard({ event, onEnter }: EventCardProps): import("react/jsx-runtime").JSX.Element;
export {};
