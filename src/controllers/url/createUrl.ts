import { prisma } from '@/config/prisma';
import { AppError } from '@/lib/appError';
import { genUniqueURL } from '@/lib/generateUniqueURL';
import { urlExists } from '@/utils';

import type { Request, Response, NextFunction } from 'express';
import { CreateUrlInput } from '@/schemas/url.schema';

const createUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError(401, 'Unauthorized', 'Not allowed');
    }

    const userId = req.userId.toString();

    const { url: orignalUrl } = req.body as CreateUrlInput['body'];
    const alreadyExists = await urlExists({ orignalUrl, userId });

    if (alreadyExists) {
      res.status(200).json({
        code: 'Already Exists',
        message: 'URL already exists',
        shortUrl: alreadyExists.shortUrl,
      });
      return;
    }

    const shortUrl = await genUniqueURL();

    await prisma.url.create({
      data: {
        orignalUrl,
        shortUrl,
        userId,
        click: {
          create: {
            clickCounts: 0,
          },
        },
      },
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
