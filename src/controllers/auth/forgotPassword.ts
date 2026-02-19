// Custom Imports
import { prisma } from '@/config/prisma';
import {
  genereratepassResetToken,
  hashToken,
} from '@/lib/generatePassResetToken';
import { forgotPasswordInput } from '@/schemas/auth.schema';
import { userExists } from '@/utils';
import config from '@/config/config';
import { sendPasswordResetEmail } from '@/lib/resend';
// Type
import { Request, Response, NextFunction } from 'express';

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body as forgotPasswordInput['body'];

    const user = await userExists({ email });

    if (user) {
      const plainPassResetToken = genereratepassResetToken();
      const hashPassResetToken = hashToken(plainPassResetToken);
      const tokenExpirey = new Date(Date.now() + 15 * 60 * 1000);

      await prisma.passwordResetToken.upsert({
        where: { userId: user.id },
        update: {
          passwordResetTokenHash: hashPassResetToken,
          tokenExpirey: tokenExpirey,
        },
        create: {
          userId: user.id,
          passwordResetTokenHash: hashPassResetToken,
          tokenExpirey: tokenExpirey,
        },
      });
      const clinetUrl = `${config.CLIENT_URL}/reset-password?token=${plainPassResetToken}`;
      await sendPasswordResetEmail(user.email, clinetUrl, user.name);
    }
    res.status(200).json({ message: 'Email will be sent if the user exists.' });
  } catch (error) {
    next(error);
  }
};
