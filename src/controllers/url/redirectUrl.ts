// Custom imports
import { AppError } from '@/lib/appError';
import { urlExists } from '@/utils';

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
    const foundUrl = await urlExists({ shortUrl });
    if (!foundUrl) {
      throw new AppError(404, 'Not Found', 'shortUrl not exists');
    }
    foundUrl.clicks++;
    foundUrl.save();
    res.redirect(foundUrl.originalUrl);
  } catch (error) {
    next(error);
  }
};

export default redirectUrl;
