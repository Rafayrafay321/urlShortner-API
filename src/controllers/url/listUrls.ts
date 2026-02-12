// Custom import
import { AppError } from '@/lib/appError';
import { prisma } from '@/config/prisma';
// Types
import { Request, Response, NextFunction } from 'express';

const listUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError(401, 'Unauthorized', 'Not allowed.');
    }

    const userId = req.userId.toString();
    const urlList = await prisma.url.findMany({
      where: {
        userId: userId,
      },
      include: {
        click: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      code: 'Success',
      urlList,
    });
  } catch (error) {
    next(error);
  }
};

export default listUrl;
