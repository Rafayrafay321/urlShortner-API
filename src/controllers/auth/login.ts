import { AppError } from '@/lib/appError';
import { comparePassword } from '@/lib/password';
import { generateRefreshToken, generateAccessToken } from '@/lib/jwt';
import config from '@/config/config';
import { prisma } from '@/config/prisma';

import type { Request, Response, NextFunction } from 'express';
import { UserLoginInput } from '@/schemas/auth.schema';

const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body as UserLoginInput['body'];

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError(401, 'Bad Request', 'Invalid Email or Password');
    }

    const isPassCorrect = await comparePassword(password, user.password);
    if (!isPassCorrect) {
      throw new AppError(401, 'Bad Request', 'Invalid Email or Password');
    }

    const userId = user.id;
    const refreshToken = generateRefreshToken({ userId });
    const accessToken = generateAccessToken({ userId });

    await prisma.$transaction(async (tx) => {
      await tx.refreshToken.upsert({
        where: { userId },
        update: {
          refreshToken: refreshToken,
          refreshTokenStatus: 'active',
        },
        create: {
          refreshToken: refreshToken,
          refreshTokenStatus: 'active',
          user: {
            connect: { id: userId },
          },
        },
      });
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: config.COOKIE_MAX_AGE,
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
    });

    res.status(200).json({
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export default login;
