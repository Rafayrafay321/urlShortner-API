import { Router } from 'express';

// Custom imports
import redirectUrl from '@/controllers/url/redirectUrl';
import expressRateLimit from '@/middleware/rateLimiter';

const router = Router();

// This router will handle the redirection for the shortURL.
// It does not have authMiddleware, making it public.
router.get('/:shortUrl', expressRateLimit('basic'), redirectUrl);

export default router;
