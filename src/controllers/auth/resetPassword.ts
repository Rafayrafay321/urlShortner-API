// Custom Imports
import { prisma } from '@/config/prisma';
import { AppError } from '@/lib/appError';
import { hashToken } from '@/lib/generatePassResetToken';
import { hashPassword } from '@/lib/password';
import {
  resetPasswordInput,
  forgotPasswordTokeninput,
} from '@/schemas/auth.schema';
import config from '@/config/config';
// Types
import { Request, Response, NextFunction } from 'express';

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, passwordConfirmation } =
      req.body as resetPasswordInput['body'];

    if (password !== passwordConfirmation) {
      throw new AppError(
        400,
        'Bad request',
        'Password and confirm password should be same',
      );
    }

    const { token } = req.query as unknown as forgotPasswordTokeninput['query'];
    const hashedToken = hashToken(token);

    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: {
        passwordResetTokenHash: hashedToken,
        tokenExpirey: { gt: new Date() },
      },
    });

    if (!resetTokenRecord) {
      throw new AppError(400, 'Bad Request', 'Token is Invalid or Expired');
    }

    const hashedPassword = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetTokenRecord.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { userId: resetTokenRecord.userId },
      }),
    ]);

    res.clearCookie('refreshToken', {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
    });

    res.status(200).json({
      code: 'Success',
      message:
        'Password Updated Succesfully. Please login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
