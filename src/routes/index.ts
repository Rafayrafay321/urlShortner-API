import { Router } from 'express';

// custom imports
import authRouter from '@/routes/auth';
import urlRouter from '@/routes/url';
import redirectRouter from '@/routes/redirect';
import apiKeyRouter from '@/routes/apiKey';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    docs: 'https://docs.shortly.codewithrafay.com',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRouter);
router.use('/url', urlRouter);
router.use('/keys', apiKeyRouter);

// The redirect router should be last.
router.use('/', redirectRouter);

export default router;
