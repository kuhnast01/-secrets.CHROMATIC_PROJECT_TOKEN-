import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(1),
  config: z.any(),
  created_by: z.number().optional(),
});

export const userSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  role: z.string().min(1),
});
