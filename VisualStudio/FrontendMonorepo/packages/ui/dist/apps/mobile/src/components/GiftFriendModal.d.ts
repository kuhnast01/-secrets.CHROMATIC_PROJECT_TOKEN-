export interface Friend {
    id: string;
    name: string;
}
interface GiftFriendModalProps {
    visible: boolean;
    friends: Friend[];
    onSelect: (friend: Friend) => void;
    onClose: () => void;
}
export default function GiftFriendModal({ visible, friends, onSelect, onClose }: GiftFriendModalProps): import("react/jsx-runtime").JSX.Element;
export {};
