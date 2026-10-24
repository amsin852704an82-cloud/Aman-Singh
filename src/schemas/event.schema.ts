import { z } from 'zod';

export const rsvpEventSchema = z.object({
  eventId: z.string().optional(),
  seatsCount: z.number().int().positive().max(10).optional(),
  userName: z.string().max(100).optional(),
  userEmail: z.string().email().optional()
});
