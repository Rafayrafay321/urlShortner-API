// Custom imports
import { AppError } from '@/lib/appError';
import { hashApiKey } from '@/lib/generateApiKey';
import { prisma } from '@/config/prisma';
// type
import { Request, Response, NextFunction } from 'express';

export const apiKeyAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO Sort the api or general route.
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) return next();

    const hashedApi = hashApiKey(apiKey);
    const result = await prisma.apiKey.findUnique({
      where: {
        keyHash: hashedApi,
      },
    });

    if (!result) {
      throw new AppError(401, 'Unauthorized', 'Not Allowed');
    }

    await prisma.apiKey.update({
      where: { id: result.id },
      data: { lastUsedAt: new Date() },
    });

    req.userId = result.userId;
    return next();
  } catch (error) {
    next(error);
  }
};
