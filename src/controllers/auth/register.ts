import { User, type IUser } from '@/models/user';
import config from '@/config';
import { hashPassword } from '@/lib/password';
import { AppError } from '@/lib/appError';
import { userExists } from '@/utils/index';

import type { Request, Response, NextFunction } from 'express';

type RequestBody = Pick<IUser, 'name' | 'email' | 'password' | 'role'>;

const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as RequestBody;

    if (role === 'Admin' && !config.WHITELISTED_EMAILS?.includes(email)) {
      throw new AppError(
        400,
        'Bad Request',
        'You are not allowed to create an admin account',
      );
    }

    const isExists = await userExists({ email });
    if (isExists) {
      throw new AppError(409, 'Conflict', 'Email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: 'User Created Successfully',
      User: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default register;
