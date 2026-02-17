import { Router } from 'express';

// Custom imports
import createUrl from '@/controllers/url/createUrl';
import authMiddleware from '@/middleware/authMiddleware';
import deleteUrl from '@/controllers/url/deleteUrl';
import listUrl from '@/controllers/url/listUrls';
import updateUrl from '@/controllers/url/updateUrl';
import { createUrlSchema, updateUrlSchema } from '@/schemas/url.schema';
import { validate } from '@/middleware/validator';

const router = Router();

// Route for creating URL.
router.post('/createurl', authMiddleware, validate(createUrlSchema), createUrl);

// Route for list of urls
router.get('/my-urls', authMiddleware, listUrl);

// Route for edit specific URL.

router.patch('/:id', authMiddleware, validate(updateUrlSchema), updateUrl);
// Route for deleting URL.
router.delete('/:id', authMiddleware, deleteUrl);

export default router;
