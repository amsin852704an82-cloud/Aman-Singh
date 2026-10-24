import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(30, { message: 'Username must not exceed 30 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
  fullName: z
    .string()
    .min(1, { message: 'Full name is required' })
    .max(100, { message: 'Full name cannot exceed 100 characters' }),
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .max(254, { message: 'Email cannot exceed 254 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least 1 uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least 1 number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least 1 special character' })
    .optional()
});

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .max(254, { message: 'Email cannot exceed 254 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least 1 uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least 1 number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least 1 special character' })
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .max(254, { message: 'Email cannot exceed 254 characters' })
});

export const sendOtpSchema = z.object({
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number is too long' })
});

export const verifyOtpSchema = z.object({
  phone: z.string().optional(),
  otp: z.string().min(4, { message: 'OTP must be at least 4 digits' }).max(8)
});
