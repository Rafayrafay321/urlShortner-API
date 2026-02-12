import { Prisma } from '@prisma/client';
// Custom imports
import { prisma } from '@/config/prisma';
import { AppError } from '@/lib/appError';

// Types
import type { Request, Response, NextFunction } from 'express';

const redirectUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { shortUrl } = req.params;
  if (!shortUrl) {
    throw new AppError(400, 'Bad Request', 'Short URL not found');
  }
  try {
    const updatedUrl = await prisma.url.update({
      where: { shortUrl: shortUrl },
      data: {
        click: {
          update: {
            clickCounts: { increment: 1 },
          },
        },
      },
      select: { orignalUrl: true },
    });
    res.redirect(updatedUrl.orignalUrl);
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return next(
        new AppError(404, 'Not Found', 'This short link does not exists'),
      );
    }
    next(error);
  }
};

export default redirectUrl;
