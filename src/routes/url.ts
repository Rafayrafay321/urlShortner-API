import { Router } from 'express';

// Custom imports
import createUrl from '@/controllers/url/createUrl';
import authMiddleware from '@/middleware/authMiddleware';
import validationError from '@/middleware/validationError';
import deleteUrl from '@/controllers/url/deleteUrl';
import listUrl from '@/controllers/url/listUrls';
import updateUrl from '@/controllers/url/updateUrl';
import { mongoIdValidator, urlValidator } from '@/validators/commonValidators';

const router = Router();

// Route for creating URL.
router.post(
  '/createurl',
  authMiddleware,
  urlValidator,
  validationError,
  createUrl,
);

// Route for list of urls
router.get('/my-urls', authMiddleware, listUrl);

// Route for edit specific URL.

router.patch(
  '/:id',
  authMiddleware,
  mongoIdValidator,
  validationError,
  updateUrl,
);
// Route for deleting URL.
router.delete('/:id', authMiddleware, deleteUrl);

export default router;
