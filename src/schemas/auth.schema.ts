import { z } from 'zod';

const emailField = z.email('Invalid Credentials').trim().toLowerCase();
const passwordField = z
  .string()
  .min(8, 'Password must be atleast 8 characters');

export const userLoginSchema = z.object({
  body: z.object({
    email: emailField,
    password: passwordField,
  }),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

export const userRegisterSchema = z.object({
  body: z.object({
    email: emailField,
    password: passwordField,
    name: z.string().trim(),
    role: z.enum(['ADMIN', 'USER']),
  }),
});

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;

export const resetPasswordSchema = z.object({
  body: z.object({
    email: emailField,
  }),
});

export type resetPasswordInput = z.infer<typeof resetPasswordSchema>;
