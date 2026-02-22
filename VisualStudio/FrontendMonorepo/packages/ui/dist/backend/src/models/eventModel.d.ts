import { Prisma } from '@prisma/client';
export declare function getAllEvents({ skip, take }?: {
    skip?: number | undefined;
    take?: number | undefined;
}): Promise<{
    id: number;
    name: string;
    config: Prisma.JsonValue;
    created_by: number | null;
    createdAt: Date;
}[]>;
export declare function createEvent(event: Prisma.EventUncheckedCreateInput): Promise<{
    id: number;
    name: string;
    config: Prisma.JsonValue;
    created_by: number | null;
    createdAt: Date;
}>;
