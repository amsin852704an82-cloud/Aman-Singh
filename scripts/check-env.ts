// Environment Variables Checker and Safety Validator
import dotenv from 'dotenv';
dotenv.config();

export function validateEnvironment(): { valid: boolean; missing: string[]; warnings: string[] } {
  const isProduction = process.env.NODE_ENV === 'production';
  const missing: string[] = [];
  const warnings: string[] = [];

  const requiredKeys = [
    'JWT_SECRET',
    'COOKIE_SECRET',
    'DATABASE_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];

  for (const key of requiredKeys) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Validate JWT_SECRET length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long for cryptographic security.');
  }

  // Check production vs development secrets
  if (!isProduction && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1')) {
    warnings.push('Warning: Non-local database URL detected in non-production environment.');
  }

  if (isProduction && missing.length > 0) {
    console.error('❌ FATAL: Missing required production environment variables:');
    missing.forEach((k) => console.error(`  - ${k}`));
    throw new Error(`Production startup aborted. Missing: ${missing.join(', ')}`);
  } else if (missing.length > 0) {
    // Development mode fallback defaults
    console.warn('⚠️ Development Notice: Missing some production keys, using development placeholders:');
    missing.forEach((k) => {
      console.warn(`  - ${k}: set to development fallback`);
      if (!process.env[k]) {
        if (k === 'JWT_SECRET') process.env.JWT_SECRET = 'bharatconnect_jwt_secret_min_32_characters_key_2026!';
        if (k === 'COOKIE_SECRET') process.env.COOKIE_SECRET = 'bharatconnect_cookie_secret_key_32_chars_long!';
        if (k === 'DATABASE_URL') process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:5432/bharatconnect?schema=public';
        if (k === 'CLOUDINARY_CLOUD_NAME') process.env.CLOUDINARY_CLOUD_NAME = 'bharatconnect-dev';
        if (k === 'CLOUDINARY_API_KEY') process.env.CLOUDINARY_API_KEY = '123456789012345';
        if (k === 'CLOUDINARY_API_SECRET') process.env.CLOUDINARY_API_SECRET = 'dev_secret_key_placeholder';
        if (k === 'GOOGLE_CLIENT_ID') process.env.GOOGLE_CLIENT_ID = 'dev_google_client_id.apps.googleusercontent.com';
        if (k === 'GOOGLE_CLIENT_SECRET') process.env.GOOGLE_CLIENT_SECRET = 'dev_google_client_secret';
      }
    });
    if (!process.env.GOOGLE_REDIRECT_URI) {
      process.env.GOOGLE_REDIRECT_URI = 'https://bharatconnect.vercel.app/api/auth/google/callback';
    }
  } else {
    if (!process.env.GOOGLE_REDIRECT_URI) {
      process.env.GOOGLE_REDIRECT_URI = 'https://bharatconnect.vercel.app/api/auth/google/callback';
    }
    console.log('✅ All required environment variables are set and validated.');
  }

  return { valid: missing.length === 0, missing, warnings };
}

// Auto-run when executed directly via tsx
if (process.argv[1]?.endsWith('check-env.ts')) {
  validateEnvironment();
}
