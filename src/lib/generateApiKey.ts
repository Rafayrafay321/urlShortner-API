import crypto from 'node:crypto';

const generateApiKey = (): string => {
  return `ls_live${crypto.randomBytes(32).toString('hex')}`;
};

const hashApiKey = (apiKey: string): string => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};

const compareApiKey = (
  providedHashKey: string,
  storedHashKey: string,
): boolean => {
  return crypto.timingSafeEqual(
    Buffer.from(providedHashKey),
    Buffer.from(storedHashKey),
  );
};

export { generateApiKey, hashApiKey, compareApiKey };
