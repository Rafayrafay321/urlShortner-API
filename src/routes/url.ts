import { Router } from 'express';

// Custom imports
import createUrl from '@/controllers/url/createUrl';
import authMiddleware from '@/middleware/authMiddleware';
import deleteUrl from '@/controllers/url/deleteUrl';
import listUrl from '@/controllers/url/listUrls';
import updateUrl from '@/controllers/url/updateUrl';
import { createUrlSchema, updateUrlSchema } from '@/schemas/url.schema';
import { validate } from '@/middleware/validator';
import { apiKeyAuthMiddleware } from '@/middleware/apiKeyAuthMiddleware';

const router = Router();

// Route for creating URL.
router.post(
  '/createurl',
  apiKeyAuthMiddleware,
  authMiddleware,
  validate(createUrlSchema),
  createUrl,
);

// Route for list of urls
router.get('/my-urls', apiKeyAuthMiddleware, authMiddleware, listUrl);

// Route for edit specific URL.

router.patch(
  '/:id',
  apiKeyAuthMiddleware,
  authMiddleware,
  validate(updateUrlSchema),
  updateUrl,
);
// Route for deleting URL.
router.delete('/:id', apiKeyAuthMiddleware, authMiddleware, deleteUrl);

export default router;
