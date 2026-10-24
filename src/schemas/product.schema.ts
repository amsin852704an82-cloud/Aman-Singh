import { z } from 'zod';

export const createOrderSchema = z.object({
  productId: z.string().min(1, { message: 'Product ID is required' }),
  quantity: z.number().int().positive().max(100).optional(),
  buyerName: z.string().max(100).optional(),
  buyerPhone: z.string().max(20).optional(),
  buyerAddress: z.string().max(300).optional()
});
