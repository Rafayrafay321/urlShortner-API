import { prisma } from '@/config/prisma';
import config from '@/config/config';
import { hashPassword } from '@/lib/password';
import { AppError } from '@/lib/appError';
import { userExists } from '@/utils/index';

import type { Request, Response, NextFunction } from 'express';

// TODO Replace later with ZOD.
type registerRequestBody = {
  name: string;
  email: string;
  password: string;
  role: 'User' | 'Admin';
};

const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as registerRequestBody;

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

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
      },
    });

    res.status(201).json({
      message: 'User Created Successfully',
      user: {
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
