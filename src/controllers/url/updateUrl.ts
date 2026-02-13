// Types
import { AppError } from '@/lib/appError';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/config/prisma';

const updateUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // TODO validate with ZOD
  try {
    if (!req.userId) {
      throw new AppError(401, 'Unauthorized', 'Not allowed.');
    }
    const userId = req.userId.toString();
    const urlId = req.params.id;

    if (!urlId) {
      throw new AppError(400, 'Bad Request', 'Not allowed.');
    }
    const originalUrl = req.body.url;
    await prisma.url.updateMany({
      where: {
        id: urlId,
        userId: userId,
      },
      data: {
        orignalUrl: originalUrl,
      },
    });

    res.status(200).json({
      code: 'Success',
      message: 'URL updated Successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default updateUrl;
