import dotenv from 'dotenv';

// Type
type NodeEnv = 'development' | 'production' | 'test';

dotenv.config();

const CORS_WHITELIST = ['https://shortly.codewithrafay.com'];
const _1H_IN_MILLISECONDS = 60 * 60 * 1000;
const _7DAYS_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
const NODE_ENV = process.env.NODE_ENV as NodeEnv;

const config = {
  PORT: process.env.PORT!,
  NODE_ENV,
  CORS_WHITELIST,
  LOG_LEVEL: process.env.LOG_LEVEL,
  WINDOW_MS: _1H_IN_MILLISECONDS,
  MONGO_CONNECTION_URI: process.env.MONGO_CONNECTION_URI!,
  WHITELISTED_EMAILS: process.env.WHITELISTED_EMAILS?.split(','),
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS!),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  COOKIE_MAX_AGE: _7DAYS_IN_MILLISECONDS!,
  MAX_API_REQUESTS: Number(process.env.RATE_LIMIT_MAX_API_REQUESTS) || 100,
  MAX_AUTH_REQUESTS: Number(process.env.RATE_LIMIT_MAX_AUTH_REQUESTS) || 20,
  MAX_RESET_REQUESTS:
    Number(process.env.RATE_LIMIT_MAX_PASSRESET_REQUEST) || 10,
};

export default config;
