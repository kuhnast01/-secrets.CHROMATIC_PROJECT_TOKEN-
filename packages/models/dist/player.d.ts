import type { Currency } from './currency';
export type Player = {
    id: string;
    name: string;
    level: number;
    currencies: Currency[];
    equippedCosmetics?: Record<string, string>;
};
//# sourceMappingURL=player.d.ts.map