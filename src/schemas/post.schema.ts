import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

export const createPostSchema = z.object({
  caption: z
    .string()
    .min(1, { message: 'Post content cannot be empty' })
    .max(2000, { message: 'Post content cannot exceed 2000 characters' })
    .transform((val) => DOMPurify.sanitize(val.trim())),
  imageUrl: z
    .string()
    .refine(
      (url) => !url || (url.startsWith('https://') && (url.includes('cloudinary.com') || url.includes('unsplash.com') || url.includes('google'))),
      { message: 'Image URL must be secure HTTPS from an approved domain' }
    )
    .optional(),
  location: z.string().max(100).optional(),
  tags: z.array(z.string().max(50)).optional(),
  isAnonymous: z.boolean().optional()
});

export const createCommentSchema = z.object({
  text: z
    .string()
    .min(1, { message: 'Comment cannot be empty' })
    .max(500, { message: 'Comment cannot exceed 500 characters' })
    .transform((val) => DOMPurify.sanitize(val.trim()))
});
