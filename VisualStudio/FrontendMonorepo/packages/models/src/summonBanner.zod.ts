import { z } from 'zod';

export const PitySchema = z.object({
  current: z.number(),
  max: z.number(),
});

export const SummonBannerSchema = z.object({
  id: z.string(),
  name: z.string(),
  artUrl: z.string(),
  featuredUnits: z.array(z.string()),
  cost: z.number(),
  currency: z.string(),
  endTime: z.string(),
  pity: PitySchema,
});

export type SummonBanner = z.infer<typeof SummonBannerSchema>;
