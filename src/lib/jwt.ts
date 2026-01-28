// Node Modules
import jwt from 'jsonwebtoken';

// Custom imports
import config from '@/config';

// Types
// import type { Types } from 'mongoose';
import type { JwtPayload } from 'jsonwebtoken';

export type TokenPayload = { userId: string };
export type ResetLinkPayload = { email: string };

const generateAccessToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: '30m',
  });
  return token;
};

const generateRefreshToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
  return token;
};

const verifyAccessToken = (accessToken: string): string | JwtPayload => {
  return jwt.verify(accessToken, config.JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (refreshToken: string): string | JwtPayload => {
  return jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
