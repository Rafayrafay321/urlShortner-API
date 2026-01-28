import { AppError } from '@/lib/appError';
import { comparePassword } from '@/lib/password';
import { generateRefreshToken, generateAccessToken } from '@/lib/jwt';
import config from '@/config';
import { User } from '@/models/user';

import type { Request, Response, NextFunction } from 'express';
import type { IUser } from '@/models/user';

type RequestBody = Pick<IUser, 'email' | 'password'>;

const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body as RequestBody;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError(401, 'Bad Request', 'Invalid Email or Password');
    }

    const isPassCorrect = await comparePassword(password, user.password);
    if (!isPassCorrect) {
      throw new AppError(401, 'Bad Request', 'Invalid Email or Password');
    }

    const userId = user._id.toString();
    const refreshToken = generateRefreshToken({ userId });
    const accessToken = generateAccessToken({ userId });

    user.refreshToken = refreshToken;
    await user.save();

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
