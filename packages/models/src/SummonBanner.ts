// Banner model for Summoning system
export interface SummonBanner {
  id: string;
  name: string;
  artUrl: string;
  featuredUnits: string[];
  cost: number;
  currency: string;
  endTime: string;
  pity: {
    current: number;
    max: number;
  };
}
