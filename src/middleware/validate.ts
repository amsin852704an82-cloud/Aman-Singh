import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: e.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    return res.status(400).json({
      error: 'Validation failed',
      details: [{ field: 'unknown', message: (e as any)?.message || 'Invalid input' }]
    });
  }
};
