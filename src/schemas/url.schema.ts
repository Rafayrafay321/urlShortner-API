import { z } from 'zod';

export const createUrlSchema = z.object({
  body: z.object({
    url: z
      .url('Please provide a valid URL (e.g: https://google.com')
      .trim()
      .toLowerCase(),
  }),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;

export const updateUrlSchema = z.object({
  body: z.object({
    url: z
      .url('Please provide a valid URL (e.g: https://google.com')
      .optional(),
  }),
  params: z.object({
    id: z.cuid2('Invalid ID'),
  }),
});

export type UpdateUrlInput = z.infer<typeof updateUrlSchema>;
