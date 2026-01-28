// Custom imports
import {
  generateAccessToken,
  verifyRefreshToken,
  TokenPayload,
} from '@/lib/jwt';
import { User } from '@/models/user';
import { AppError } from '@/lib/appError';

// Type
import type { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

const refreshTokenCon = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | null> => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(401, 'Unauthorized', 'Refresh token not found.');
  }

  try {
    const { userId } = verifyRefreshToken(refreshToken) as TokenPayload;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(401, 'Unauthorized', 'User not found');
    }
    if (
      user.refreshTokenStatus === 'revoked' ||
      user.refreshToken !== refreshToken
    ) {
      throw new AppError(
        401,
        'Unauthorized',
        'Refresh token revoked or invalid',
      );
    }
    const accessToken = generateAccessToken({ userId: user._id.toString() });
    res.status(200).json({
      user: {
        userId: user._id.toString(),
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
