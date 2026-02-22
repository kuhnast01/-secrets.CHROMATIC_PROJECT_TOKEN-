import { z } from 'zod';
export declare const PitySchema: z.ZodObject<{
    current: z.ZodNumber;
    max: z.ZodNumber;
}, z.core.$strip>;
export declare const SummonBannerSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    artUrl: z.ZodString;
    featuredUnits: z.ZodArray<z.ZodString>;
    cost: z.ZodNumber;
    currency: z.ZodString;
    endTime: z.ZodString;
    pity: z.ZodObject<{
        current: z.ZodNumber;
        max: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SummonBanner = z.infer<typeof SummonBannerSchema>;
//# sourceMappingURL=summonBanner.zod.d.ts.map