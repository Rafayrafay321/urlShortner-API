// Node modules
import bcrypt from 'bcrypt';

// Custom Imports
import config from '@/config';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = config.SALT_ROUNDS;
  const salt = await bcrypt.genSalt(saltRounds);
  const token = await bcrypt.hash(password, salt);
  return token;
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export { hashPassword, comparePassword };
