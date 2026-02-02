import { genUniqueURL } from '@/lib/generateUniqueURL';
import { Url } from '@/models/url';
import { urlExists } from '@/utils';

import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

type RequestBody = { url: string };

const createUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { url: originalUrl } = req.body as RequestBody;
    const userId = req.userId as Types.ObjectId;
    const alreadyExists = await urlExists({ originalUrl, userId });

    if (alreadyExists) {
      res.status(200).json({
        code: 'Already Exists',
        message: 'URL already exists',
        shortUrl: alreadyExists.shortUrl,
      });
      return;
    }

    const shortUrl = await genUniqueURL();

    await Url.create({
      originalUrl,
      shortUrl,
      userId,
      clicks: 0,
    });

    res.status(201).json({
      code: 'Success',
      message: 'Url shortened successfully',
      shortUrl,
    });
  } catch (error) {
    next(error);
  }
};

export default createUrl;
