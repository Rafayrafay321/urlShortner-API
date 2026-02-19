import crypto from 'node:crypto';

const genereratepassResetToken = (): string => {
  return `pr_${crypto.randomBytes(32).toString('hex')}`;
};

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export { genereratepassResetToken, hashToken };
