// Custom imports
import { prisma } from '@/config/prisma';
import { AppError } from '@/lib/appError';
// type
import { Request, Response, NextFunction } from 'express';

const listApiKeys = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError(401, 'Unauthorized', 'Not Allowed');
    }
    const userId = req.userId.toString();

    const apiList = await prisma.apiKey.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        userId: true,
        name: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      code: 'Success',
      apiList,
    });
  } catch (error) {
    next(error);
  }
};

export default listApiKeys;
