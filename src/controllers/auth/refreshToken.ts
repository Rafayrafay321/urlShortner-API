// Custom imports
import {
  generateAccessToken,
  verifyRefreshToken,
  TokenPayload,
} from '@/lib/jwt';
import { AppError } from '@/lib/appError';

// Type
import type { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { prisma } from '@/config/prisma';

const refreshTokenCon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(401, 'Unauthorized', 'Refresh token not found.');
  }

  try {
    const { userId } = verifyRefreshToken(refreshToken) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        refreshToken: true,
      },
    });

    if (!user) {
      throw new AppError(401, 'Unauthorized', 'User not found');
    }
    if (!user.refreshToken) {
      throw new AppError(401, 'Unauthorized', 'User not found');
    }
    if (
      user.refreshToken.refreshTokenStatus === 'revoked' ||
      user.refreshToken.refreshToken !== refreshToken
    ) {
      throw new AppError(
        401,
        'Unauthorized',
        'Refresh token revoked or invalid',
      );
    }
    const accessToken = generateAccessToken({ userId: user.id });
    res.status(200).json({
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
    return;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new AppError(401, 'Token Error', 'Refresh Token Expired'));
    }
    if (error instanceof JsonWebTokenError) {
      return next(new AppError(401, 'Token Error', 'Invalid Refresh Token'));
    }
    next(error);
  }
};

export default refreshTokenCon;
