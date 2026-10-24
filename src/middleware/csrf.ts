import { doubleCsrf } from 'csrf-csrf';
import { Request, Response, NextFunction } from 'express';

const csrfSecret = process.env.COOKIE_SECRET || 'bharat_connect_csrf_secret_min_32_characters_key!';

export const {
  generateCsrfToken,
  doubleCsrfProtection
} = doubleCsrf({
  getSecret: () => csrfSecret,
  getSessionIdentifier: (req: Request) => req.ip || req.cookies?.token || 'bharat_session',
  cookieName: 'bc_csrf_token',
  cookieOptions: {
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getCsrfTokenFromRequest: (req: Request) =>
    (req.headers['x-csrf-token'] as string) || (req.body && req.body._csrf)
});

// Helper for generating token in endpoint
export const generateToken = (req: Request, res: Response) => {
  return generateCsrfToken(req, res);
};

// Middleware for CSRF that gracefully allows API testing and token-based client requests
export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Allow safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  // Allow direct bearer-authorized requests
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return next();
  }
  return doubleCsrfProtection(req, res, next);
};
