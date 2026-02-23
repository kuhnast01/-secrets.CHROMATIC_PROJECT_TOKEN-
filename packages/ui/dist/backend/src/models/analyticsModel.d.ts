import { Prisma } from '@prisma/client';
export declare function getAnalytics(args?: {
    where?: Prisma.AnalyticsWhereInput;
}): Promise<{
    id: number;
    value: number;
    metric: string;
    recorded_at: Date;
}[]>;
