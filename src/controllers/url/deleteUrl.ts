// Custom imports
import { AppError } from '@/lib/appError';
import { Url } from '@/models/url';

// Types
import type { Request, Response, NextFunction } from 'express';

const deleteUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Find the document by its ID from the URL parameters.
    const url = await Url.findById(req.params.id);

    if (!url) {
      throw new AppError(404, 'Not Found', 'No URL found with that ID.');
    }

    // 3. Check for ownership. T
    if (!url.userId.equals(req.userId)) {
      throw new AppError(
        403,
        'Forbidden',
        'You are not authorized to delete this URL.',
      );
    }

    // 4. If all checks pass, delete the document.
    await Url.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default deleteUrl;
