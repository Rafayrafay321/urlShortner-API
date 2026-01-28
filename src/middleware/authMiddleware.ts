import { verifyAccessToken, TokenPayload } from '@/lib/jwt';
import { AppError } from '@/lib/appError';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { Types } from 'mongoose';

import type { Request, Response, NextFunction } from 'express';

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new AppError(401, 'Unauthorized', 'You need to login first');
    }
    const accessToken = authorization.split(' ')[1];

    const { userId } = verifyAccessToken(accessToken) as TokenPayload;
    const convertedUserId = new Types.ObjectId(userId);
    req.userId = convertedUserId;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new AppError(401, 'Token Error', 'Access Token Expired'));
    }
    if (error instanceof JsonWebTokenError) {
      return next(new AppError(401, 'Token Error', 'Invalid Access Token'));
    }
    next(error);
  }
};

export default authMiddleware;
