import { prisma } from '@/config/prisma';
import logger from './winston';

export const revokeRefreshToken = async (token: string) => {
  try {
    const result = await prisma.refreshToken.updateMany({
      where: {
        refreshToken: token,
        refreshTokenStatus: 'active',
      },
      data: {
        refreshTokenStatus: 'revoked',
      },
    });
    return result.count > 0;
  } catch (error) {
    logger.error('Token revocation failed:', error);
    return false;
  }
};
