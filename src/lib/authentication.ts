import { User } from '@/models/user';

export const revokeRefreshToken = async (token: string): Promise<boolean> => {
  const user = await User.findOne({ refreshToken: token });
  if (!user) return false;
  user.refreshTokenStatus = 'revoked';
  await user.save();
  return true;
};
