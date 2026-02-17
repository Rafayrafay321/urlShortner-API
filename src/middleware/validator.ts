// Node imports
import { z } from 'zod';
// Types
import { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));

      res.status(400).json({
        status: 'Validation Failed',
        errors: errorMessages,
      });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validateData = result.data as any;
    req.body = validateData.body;
    req.params = validateData.params;
    req.query = validateData.query;
    return next();
  };
