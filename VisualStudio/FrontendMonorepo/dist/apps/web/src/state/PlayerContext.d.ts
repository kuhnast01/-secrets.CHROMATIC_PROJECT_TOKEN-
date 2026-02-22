import { ReactNode } from 'react';
import { Player } from '@models';
interface PlayerContextType {
    player: Player | null;
    setPlayer: (player: Player | null) => void;
    logout: () => void;
}
export declare const PlayerProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const usePlayer: () => PlayerContextType;
export {};
