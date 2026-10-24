import { z } from 'zod';

export const updateUserSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z
    .string()
    .url()
    .refine((url) => url.startsWith('https://'), { message: 'Avatar URL must use HTTPS' })
    .optional()
});

export const followUserSchema = z.object({
  targetUserId: z.string().optional()
});
