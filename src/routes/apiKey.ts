import { Router } from 'express';

// Custom imports
import authMiddleware from '@/middleware/authMiddleware';
import createApiKey from '@/controllers/apiKey/createApiKey';
import listApiKeys from '@/controllers/apiKey/listApiKeys';
import expressRateLimit from '@/middleware/rateLimiter';
import { validate } from '@/middleware/validator';
import { apiKeyCreationSchema } from '@/schemas/apikey.schema';

const router = Router();

router.post(
  '/createKey',
  validate(apiKeyCreationSchema),
  authMiddleware,
  expressRateLimit('basic'),
  createApiKey,
);

router.get(
  '/list-keys',
  authMiddleware,
  expressRateLimit('basic'),
  listApiKeys,
);

export default router;
