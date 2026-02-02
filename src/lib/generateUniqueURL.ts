import { generateUrl } from './urlGenerator';
import { urlExists } from '@/utils';
import { AppError } from './appError';

const MAX_ATTEMPTS = 5;

export const genUniqueURL = async () => {
  let attempts = 0;
  let shortURL = '';

  while (attempts <= MAX_ATTEMPTS) {
    shortURL = generateUrl();
    const shortURLAlreadyExists = await urlExists({ shortUrl: shortURL });
    if (!shortURLAlreadyExists) {
      return shortURL;
    }
    attempts++;
  }

  throw new AppError(
    500,
    'Server Error',
    'Could not generate a unique URL. Please Try Again',
  );
};
