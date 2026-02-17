import { z } from 'zod';

const authBase = {
  email: z.email('Invalid Email').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
};

export const userLoginSchema = z.object({
  body: z.object({ ...authBase }),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

export const userRegisterSchema = z.object({
  body: z.object({
    ...authBase,
    name: z.string().trim(),
    role: z.enum(['ADMIN', 'USER']),
  }),
});

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
