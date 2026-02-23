import { z } from 'zod';
export declare const eventSchema: z.ZodObject<{
    name: z.ZodString;
    config: z.ZodAny;
    created_by: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const userSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    role: z.ZodString;
}, z.core.$strip>;
