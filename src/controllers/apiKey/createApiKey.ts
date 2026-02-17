// Custom imports
import { generateApiKey, hashApiKey } from '@/lib/generateApiKey';
import { AppError } from '@/lib/appError';
import { prisma } from '@/config/prisma';
// Types
import { Request, Response, NextFunction } from 'express';

const createApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) {
      throw new AppError(401, 'Unauthorized', 'Not Allowed');
    }
    const userId = req.userId.toString();
    const { name } = req.body;

    if (!name) {
      throw new AppError(400, 'Bad Request', 'name is required');
    }

    const plainKey = generateApiKey();
    const hashedKey = hashApiKey(plainKey);

    await prisma.apiKey.create({
      data: {
        userId,
        keyHash: hashedKey,
        name,
      },
    });

    res.status(200).json({
      code: 'Success',
      message: 'Api Key created Successfully',
      apiKey: {
        plainKey,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default createApiKey;
