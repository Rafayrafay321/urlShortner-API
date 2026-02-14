// Custom imports
import { prisma } from '@/config/prisma';
import { AppError } from '@/lib/appError';

// Types
import { type Request, type Response, type NextFunction } from 'express';

const deleteUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!req.userId) {
      throw new AppError(401, 'Unauthorized', 'Not allowed.');
    }
    try {
      await prisma.url.delete({
        where: {
          id: id,
          userId: req.userId.toString(),
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AppError(404, 'Not Found', 'Url not found or not authorized');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default deleteUrl;
