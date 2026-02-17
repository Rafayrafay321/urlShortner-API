import { z } from 'zod';

export const apiKeyCreationSchema = z.object({
  body: z.object({
    name: z.string().trim().toLowerCase(),
  }),
});
