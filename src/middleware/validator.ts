// Node imports
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
// Types
import { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const validationError = fromZodError(result.error);
      return res.status(400).json({
        status: 'Validation Failed',
        message: validationError.toString(),
      });
    }

    const data = result.data as { body: unknown; params: unknown; query: unknown; };
    req.body = data.body;
    req.params = data.params as Record<string, string>;
    req.query = data.query as Record<string, string | string[]>;

    return next();
  };
