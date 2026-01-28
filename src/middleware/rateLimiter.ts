import { rateLimit } from 'express-rate-limit';
import type { RateLimitRequestHandler, Options } from 'express-rate-limit';
import config from '@/config';

type RateLimitType = 'basic' | 'auth' | 'passReset';

export const defaultLimitOpt: Partial<Options> = {
  windowMs: config.WINDOW_MS,
  standardHeaders: true,
  legacyHeaders: true,
};

const rateLimitOpt = new Map<RateLimitType, Partial<Options>>([
  ['basic', { ...defaultLimitOpt, limit: config.MAX_API_REQUESTS }],
  ['auth', { ...defaultLimitOpt, limit: config.MAX_AUTH_REQUESTS }],
  ['passReset', { ...defaultLimitOpt, limit: config.MAX_RESET_REQUESTS }],
]);

const expressRateLimit = (type: RateLimitType): RateLimitRequestHandler => {
  return rateLimit(rateLimitOpt.get(type));
};

export default expressRateLimit;
