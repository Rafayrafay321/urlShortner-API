// custom Imports
import config from '@/config';
import { revokeRefreshToken } from '@/lib/authentication';

// types
import type { Request, Response, NextFunction } from 'express';

const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.status(204).send();
      return;
    }

    await revokeRefreshToken(refreshToken);

    res.clearCookie('refreshToken', {
      maxAge: 0,
      secure: true,
      httpOnly: config.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      message: 'User logged Out sucessfully',
    });
  } catch (error) {
    next(error);
  }
};

export default logout;
