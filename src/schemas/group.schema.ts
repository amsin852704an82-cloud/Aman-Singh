import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(3).max(100),
  hindiName: z.string().min(2).max(100).optional(),
  description: z.string().max(1000).optional(),
  category: z.string().min(2).max(50),
  isPrivate: z.boolean().optional()
});

export const joinGroupSchema = z.object({
  userId: z.string().optional()
});
