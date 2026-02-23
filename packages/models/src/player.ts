import type { Currency } from './currency';

export type Player = {
  id: string;
  name: string;
  level: number;
  currencies: Currency[];
  equippedCosmetics?: Record<string, string>; // e.g., { skin: 'cosmeticId', frame: 'cosmeticId' }
};
